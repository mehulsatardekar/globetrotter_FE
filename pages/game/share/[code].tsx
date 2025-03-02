import React from "react";
import { useRouter } from "next/router";
import { useEffect, useState } from "react";
import api from "@/src/lib/axios";
import styles from "./shareCode.module.css";
import { AxiosError } from "axios";
import UsernameModal from "@/src/components/UsernameModal/UsernameModal";

interface SharedGameData {
  id: string;
  user_id: string;
  score: number;
  correct_answers: number;
  total_questions: number;
  share_code: string;
  expires_at: string;
  created_at: string;
  user: {
    id: string;
    username: string;
  };
  rounds: Array<{
    is_correct: boolean;
    time_taken: number;
  }>;
}

const SharedGame = () => {
  const router = useRouter();
  const { code } = router.query;
  const [gameData, setGameData] = useState<SharedGameData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [showUsernameModal, setShowUsernameModal] = useState(false);
  const [playerName, setPlayerName] = useState<string>("");

  useEffect(() => {
    if (code) {
      fetchSharedGame();
    }
  }, [code]);

  const fetchSharedGame = async () => {
    try {
      console.log("Fetching shared game with code:", code);
      const { data } = await api.get(`/games/share/${code}`);
      console.log("Received game data:", data);
      setGameData(data);
    } catch (error: unknown) {
      const axiosError = error as AxiosError<{ error: string }>;
      console.error("Failed to load shared game:", {
        status: axiosError.response?.status,
        data: axiosError.response?.data,
        error: axiosError.message,
      });
      setError("Failed to load shared game");
    } finally {
      setLoading(false);
    }
  };

  const handlePlayGame = () => {
    setShowUsernameModal(true);
  };

  const handleStartGame = async (username: string) => {
    try {
      setPlayerName(username);

      // Register/get user (endpoint handles both new and existing users)
      const { data: userData } = await api.post("/users/register", {
        username,
      });

      // Start a new game with the user ID
      const { data: newGame } = await api.post("/games/start", {
        userId: userData.id,
      });

      // Get the original shared game data for the challenge info
      const { data: sharedGame } = await api.get(`/games/share/${code}`);

      await router.replace({
        pathname: `/game/${newGame.id}`,
        query: {
          challengedBy: sharedGame.user.username,
          challengeScore: sharedGame.correct_answers,
          playerName: username,
        },
      });
    } catch (error: unknown) {
      const axiosError = error as AxiosError<{ error: string }>;
      console.error("Error details:", {
        message: axiosError.message,
        response: {
          status: axiosError.response?.status,
          data: JSON.stringify(axiosError.response?.data, null, 2),
        },
      });

      setError(
        axiosError.response?.data?.error ||
          "Failed to start game. Please try again."
      );
      setShowUsernameModal(false);
    }
  };

  if (loading) {
    return <div className={styles.loading}>Loading shared game...</div>;
  }

  if (error || !gameData) {
    return (
      <div className={styles.error}>
        <h2>😢 Oops!</h2>
        <p>Failed to load shared game</p>
        <button onClick={handlePlayGame} className={styles.playButton}>
          Start Your Own Game
        </button>
      </div>
    );
  }

  return (
    <>
      <div className={styles.container}>
        <div className={styles.card}>
          <div className={styles.header}>
            <h1>
              🌍 {playerName ? `Welcome ${playerName} to ` : ""}
              Globetrotter Challenge
            </h1>
            <h2>{gameData.user.username}&apos;s Game Results</h2>
          </div>

          <div className={styles.statsGrid}>
            <div className={styles.statItem}>
              <h3>Total Score</h3>
              <p className={styles.value}>{gameData.score}</p>
            </div>
            <div className={styles.statItem}>
              <h3>Correct Answers</h3>
              <p className={styles.value}>{gameData.correct_answers}</p>
            </div>
            <div className={styles.statItem}>
              <h3>Questions</h3>
              <p className={styles.value}>{gameData.rounds.length}</p>
            </div>
            <div className={styles.statItem}>
              <h3>Accuracy</h3>
              <p className={styles.value}>
                {Math.round(
                  (gameData.correct_answers / gameData.rounds.length) * 100
                )}
                %
              </p>
            </div>
          </div>

          <div className={styles.callToAction}>
            <p>Think you can beat this score?</p>
            <button onClick={handlePlayGame} className={styles.playButton}>
              Play Your Own Game
            </button>
          </div>
        </div>
      </div>
      <UsernameModal isOpen={showUsernameModal} onSubmit={handleStartGame} />
    </>
  );
};

export default SharedGame;
