import React, { useState } from "react";
import dynamic from "next/dynamic";
import useGame from "./useGame";
import styles from "./game.module.css";
import ShareModal from "@/src/components/ShareModal/ShareModal";
import ChallengeBanner from "@/src/components/ChallengeBanner/ChallengeBanner";
import { GameState } from "./useGame"; // Import the GameState type

// Dynamically import the confetti component with ssr disabled
const ConfettiCanvas = dynamic(() => import("react-confetti-canvas"), {
  ssr: false, // Disable server-side rendering for this component
});

interface GameProps {
  sessionId: string;
  challengedBy?: string;
  challengeScore?: number;
  playerName?: string;
}

interface GameStateError {
  gameState: GameState;
  error: string;
}

const Game = ({
  sessionId,
  challengedBy,
  challengeScore,
  playerName,
}: GameProps) => {
  const { stats, actions } = useGame(sessionId);
  const { gameState, isLoading, error, selectedAnswer, isAnswerCorrect } =
    stats;
  const { submitAnswer, nextQuestion, startNewGame } = actions;
  const [showConfetti, setShowConfetti] = useState(false);
  const [isFading, setIsFading] = useState(false);
  const [isShareModalOpen, setIsShareModalOpen] = useState(false);
  const [showBanner, setShowBanner] = useState(true);

  // Get username from either prop or game state
  const username = playerName || gameState?.user?.username;

  console.log("Game data:", {
    playerName,
    gameStateUsername: gameState?.user?.username,
    finalUsername: username,
  });

  // First, update how we get summaryData
  const summaryData =
    error === "No more questions available"
      ? (stats.error as unknown as GameStateError)?.gameState
      : gameState?.is_completed
      ? gameState
      : null;

  // Get the share URL
  const shareUrl = gameState?.share_code
    ? `${window.location.origin}/game/share/${gameState.share_code}`
    : "";

  if (isLoading) {
    return <div className={styles.loading}>Loading game...</div>;
  }

  if (
    (error === "No more questions available" || gameState?.is_completed) &&
    summaryData
  ) {
    return (
      <div className={styles.container}>
        <div className={styles.questionCard}>
          <div className={styles.gameComplete}>
            <h2>🎯 Game Complete!</h2>
            <div className={styles.finalScore}>
              <p className={styles.summaryText}>
                Great job! You&apos;ve completed all questions.
              </p>
              <div className={styles.statsGrid}>
                <div className={styles.statItem}>
                  <h4>Correct Answers</h4>
                  <p className={styles.statValue}>
                    {summaryData.correct_answers || 0}
                  </p>
                </div>
                <div className={styles.statItem}>
                  <h4>Wrong Answers</h4>
                  <p className={`${styles.statValue} ${styles.wrongValue}`}>
                    {(summaryData.rounds?.length || 0) -
                      (summaryData.correct_answers || 0)}
                  </p>
                </div>
                <div className={styles.statItem}>
                  <h4>Questions Attempted</h4>
                  <p className={styles.statValue}>
                    {summaryData.rounds?.length || 0}
                  </p>
                </div>
                <div className={styles.statItem}>
                  <h4>Accuracy</h4>
                  <p className={styles.statValue}>
                    {Math.round(
                      ((summaryData.correct_answers || 0) /
                        (summaryData.rounds?.length || 1)) *
                        100
                    )}
                    %
                  </p>
                </div>
                <div className={styles.statItem}>
                  <h4>Total Score</h4>
                  <p className={styles.statValue}>{summaryData.score || 0}</p>
                </div>
              </div>
            </div>
            <div className={styles.actions}>
              <button onClick={startNewGame} className={styles.challengeButton}>
                Start New Game
              </button>
              <button
                onClick={() => setIsShareModalOpen(true)}
                className={styles.challengeButton}
              >
                Challenge a Friend
              </button>
            </div>
          </div>
        </div>
        <ShareModal
          isOpen={isShareModalOpen}
          onClose={() => setIsShareModalOpen(false)}
          score={{
            correct: summaryData.correct_answers || 0,
            incorrect:
              (summaryData.rounds?.length || 0) -
              (summaryData.correct_answers || 0),
          }}
          username={username || "Anonymous"}
          shareUrl={shareUrl}
        />
      </div>
    );
  }

  if (error) {
    return <div className={styles.error}>Error: {error}</div>;
  }

  if (!gameState || !gameState.current_round) {
    return <div className={styles.error}>Game not found</div>;
  }

  const { current_round } = gameState;
  const { destination } = current_round;

  const handleAnswer = async (answer: string) => {
    const isCorrect = await submitAnswer(answer);
    if (isCorrect) {
      setShowConfetti(true);
      // Start fade out after 2.5 seconds
      setTimeout(() => {
        setIsFading(true);
        // Remove component after fade animation
        setTimeout(() => {
          setShowConfetti(false);
          setIsFading(false);
        }, 500);
      }, 2500);
    }
  };

  const handleNextQuestion = () => {
    setShowConfetti(false);
    nextQuestion();
  };

  console.log({ playerName });

  return (
    <div className={styles.container}>
      <div className={styles.header}>
        <div className={styles.titleSection}>
          <h1>🌍 Globetrotter Challenge</h1>
          {username && (
            <p className={styles.welcomeText}>Welcome, {username}!</p>
          )}
        </div>
        <div className={styles.score}>
          Score: {gameState?.correct_answers || 0} correct,{" "}
          {(gameState?.rounds?.length || 0) - (gameState?.correct_answers || 0)}{" "}
          incorrect
        </div>
        <button
          className={styles.challengeButton}
          onClick={() => setIsShareModalOpen(true)}
        >
          Challenge a Friend
        </button>
      </div>

      {challengedBy && challengeScore !== undefined && showBanner && (
        <ChallengeBanner
          username={challengedBy}
          score={challengeScore}
          onClose={() => setShowBanner(false)}
        />
      )}

      <div className={styles.questionCard}>
        <h2>Where am I?</h2>
        <div className={styles.clues}>
          {destination?.clues?.map((clue, index) => (
            <p key={index}>{clue}</p>
          ))}
        </div>

        <div className={styles.options}>
          {destination?.options?.map((option, index) => {
            const isSelected = selectedAnswer === option;
            const correctAnswer = `${destination.city}, ${destination.country}`;
            const isCorrect = option === correctAnswer;

            return (
              <button
                key={index}
                className={`${styles.optionButton} ${
                  selectedAnswer && isCorrect ? styles.correct : ""
                } ${isSelected && !isCorrect ? styles.incorrect : ""}`}
                onClick={() => handleAnswer(option)}
                disabled={!!selectedAnswer}
              >
                {option}
              </button>
            );
          })}
        </div>

        {selectedAnswer && (
          <>
            <div
              className={`${styles.feedback} ${
                isAnswerCorrect ? styles.correct : styles.incorrect
              }`}
            >
              {isAnswerCorrect ? (
                <>
                  <h3>✨ Correct!</h3>
                  <p>
                    You guessed it right - it&apos;s{" "}
                    <strong>
                      {destination.city}, {destination.country}
                    </strong>
                    .
                  </p>
                </>
              ) : (
                <>
                  <h3>😢 Incorrect!</h3>
                  <p>
                    Sorry, the correct answer was{" "}
                    <strong>
                      {destination.city}, {destination.country}
                    </strong>
                    .
                  </p>
                </>
              )}
              {destination.fun_fact && (
                <div className={styles.funFactSection}>
                  <h4>Fun Fact:</h4>
                  <p>{destination.fun_fact}</p>
                </div>
              )}
              {destination.trivia && destination.trivia.length > 0 && (
                <div className={styles.triviaSection}>
                  <h4>Did you know?</h4>
                  <ul>
                    {destination.trivia.map((fact, index) => (
                      <li key={index}>{fact}</li>
                    ))}
                  </ul>
                </div>
              )}
            </div>
            <button onClick={handleNextQuestion} className={styles.nextButton}>
              Next Question
            </button>
          </>
        )}
      </div>

      {showConfetti && (
        <div
          className={`${styles.confettiWrapper} ${
            isFading ? styles.fadeOut : ""
          }`}
        >
          <ConfettiCanvas
            paperCount={250}
            ribbonParticleCount={80}
            duration={0.1}
            spread={360}
            startVelocity={20}
            ribbonParticleDrag={0.05}
            colors={[
              ["#F1948A", "#C39BD3"],
              ["#7FB3D5", "#76D7C4"],
              ["#F0B27A", "#7DCEA0"],
            ]}
          />
        </div>
      )}

      <ShareModal
        isOpen={isShareModalOpen}
        onClose={() => setIsShareModalOpen(false)}
        score={{
          correct: gameState?.correct_answers || 0,
          incorrect:
            (gameState?.rounds?.length || 0) -
            (gameState?.correct_answers || 0),
        }}
        username={username || "Anonymous"}
        shareUrl={shareUrl}
      />
    </div>
  );
};

export default Game;
