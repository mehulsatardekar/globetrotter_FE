import { useState, useEffect } from "react";
import { AxiosError } from "axios";
import api from "@/src/lib/axios";
import { useRouter } from "next/router";
import { GameState } from "./types";

const useGame = (sessionId: string) => {
  const router = useRouter();
  const [gameState, setGameState] = useState<GameState | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [selectedAnswer, setSelectedAnswer] = useState<string | null>(null);
  const [isAnswerCorrect, setIsAnswerCorrect] = useState<boolean | null>(null);
  const [showConfetti, setShowConfetti] = useState(false);
  const [isFading, setIsFading] = useState(false);
  const [isShareModalOpen, setIsShareModalOpen] = useState(false);
  const [showBanner, setShowBanner] = useState(true);

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

  const handleNextQuestion = () => {
    setShowConfetti(false);
    nextQuestion();
  };

  const handleShareModalOpen = () => {
    setIsShareModalOpen(true);
  };

  const handleShareModalClose = () => {
    setIsShareModalOpen(false);
  };

  const handleShowBannerClose = ()=>{
    setShowBanner(false)
  }

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

  useEffect(() => {
    if (sessionId) {
      fetchGameSession();
    }
  }, [sessionId]);

  return {
    stats: {
      gameState,
      isLoading,
      error,
      selectedAnswer,
      isAnswerCorrect,
      showConfetti,
      isFading,
      isShareModalOpen,
      showBanner,
    },
    actions: {
      submitAnswer,
      nextQuestion,
      startNewGame,
      handleNextQuestion,
      handleShareModalOpen,
      handleShareModalClose,
      handleAnswer,
      handleShowBannerClose
    },
  };
};

export default useGame;
