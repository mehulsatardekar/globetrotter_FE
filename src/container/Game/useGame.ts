import { useState, useEffect } from "react";
import { AxiosError } from "axios";
import api from "@/src/lib/axios";
import { useRouter } from "next/router";

export interface GameState {
  id: string;
  user: {
    id: string;
    username: string;
  };
  score: number;
  correct_answers: number;
  total_questions: number;
  is_completed?: boolean;
  current_round: {
    id: string;
    destination: {
      id: string;
      city: string;
      country: string;
      clues: string[];
      fun_fact: string[];
      trivia: string[];
      options: string[];
    };
  };
  rounds: Array<{
    id: string;
    is_correct: boolean;
    time_taken: number;
    user_answer: string;
    destination_id: string;
  }>;
  share_code: string;
}

const useGame = (sessionId: string) => {
  const router = useRouter();
  const [gameState, setGameState] = useState<GameState | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [selectedAnswer, setSelectedAnswer] = useState<string | null>(null);
  const [isAnswerCorrect, setIsAnswerCorrect] = useState<boolean | null>(null);

  const fetchGameSession = async () => {
    try {
      setIsLoading(true);
      setError(null);
      const { data } = await api.get(`/games/session/${sessionId}`);
      
      setGameState(data);
    } catch (error) {
      const axiosError = error as AxiosError<{
        error: string;
        gameState?: GameState;
      }>;
     
      if (
        axiosError.response?.status === 404 &&
        axiosError.response?.data?.gameState
      ) {
        // Game is complete
        setError("No more questions available");
        setGameState(axiosError.response.data.gameState);
      } else {
        if (axiosError.response?.data?.gameState) {
          setGameState(axiosError.response.data.gameState);
        }
        setError(axiosError.response?.data?.error || "Failed to load game");
      }
    } finally {
      setIsLoading(false);
    }
  };

  const submitAnswer = async (answer: string) => {
    try {
      setSelectedAnswer(answer);
      const { data } = await api.post(`/games/${sessionId}/answer`, {
        destinationId: gameState?.current_round.destination.id,
        answer,
        timeTaken: 0,
      });
      setIsAnswerCorrect(data.isCorrect);
      return data.isCorrect;
    } catch (error) {
      console.error("Failed to submit answer:", error);
      return false;
    }
  };

  const nextQuestion = async () => {
    await fetchGameSession();
    setSelectedAnswer(null);
    setIsAnswerCorrect(null);
  };

  const startNewGame = async () => {
    try {
      const { data } = await api.post("/games/start", {
        userId: gameState?.user?.id,
      });
      router.push(`/game/${data.id}`);
    } catch (error) {
      console.error("Failed to start new game:", error);
    }
  };

  useEffect(() => {
    if (sessionId) {
      fetchGameSession();
    }
  }, [sessionId]);

  return {
    stats: { gameState, isLoading, error, selectedAnswer, isAnswerCorrect },
    actions: { submitAnswer, nextQuestion, startNewGame },
  };
};

export default useGame;
