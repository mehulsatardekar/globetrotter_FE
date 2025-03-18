import React from "react";
import styles from "../../container/Game/game.module.css";
import { ICompleteGameBoard } from "./types";


const CompleteGameBoard = (props: ICompleteGameBoard) => {
  const { state } = props || {};
  const { summaryData } = state || {};
  const { startNewGame, handleShareModalOpen } = props.actions;

  return (
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
            onClick={handleShareModalOpen}
            className={styles.challengeButton}
          >
            Challenge a Friend
          </button>
        </div>
      </div>
    </div>
  );
};

export default CompleteGameBoard;
