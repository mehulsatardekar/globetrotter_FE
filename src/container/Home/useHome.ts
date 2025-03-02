import api from "@/src/lib/axios";
import { useRouter } from "next/router";
import React, { useState } from "react";

const useHome = () => {
  const [username, setUsername] = useState("");
  const [isUserCreationLoading, setIsUserCreationLoading] = useState(false);
  const router = useRouter();

  const handleStart = async () => {
    if (!username.trim()) return;
    setIsUserCreationLoading(true);
    try {
      // Check username availability
      const {
        data: { available, userId },
      } = await api.get(`/users/check-username?username=${username}`);

      let user;
      if (available) {
        // Register new user
        const { data } = await api.post("/users/register", { username });
        user = data;
      } else {
        // Use existing user
        user = { id: userId };
      }

      // Start game for either new or existing user
      const { data: game } = await api.post("/games/start", {
        userId: user.id,
      });

      router.push(`/game/${game.id}`);
    } catch (error) {
      console.error("Failed to start game:", error);
    } finally {
      setIsUserCreationLoading(false);
    }
  };

  const handleUsernameChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setUsername(event.target.value);
  };

  return {
    stats: { isUserCreationLoading, username },
    actions: { handleStart, handleUsernameChange },
  };
};

export default useHome;
