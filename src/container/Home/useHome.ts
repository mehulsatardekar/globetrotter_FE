import api from "@/src/lib/axios";
import { useRouter } from "next/router";
import React, { useState, useEffect } from "react";
import toast from "react-hot-toast";

const useHome = () => {
  const [username, setUsername] = useState("");
  const [isUserCreationLoading, setIsUserCreationLoading] = useState(false);
  const [usersPreviousgameSessionData, setUserPreviousGameSessionData] = useState([]);

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
        toast.success(`Welcome to Globetrotter ${username}`);
        user = data;
      } else {
        // Use existing user
        user = { id: userId };
        localStorage.setItem('userid',userId)
        toast.success("Found you.. continuing with your existing account");
      }

      // Start game for either new or existing user
      const { data: game } = await api.post("/games/start", {
        userId: user.id,
      });

      router.push(`/game/${game.id}`);
    } catch (error) {
      console.error("Failed to start game:", error);
      toast.error("Failed to start game. Please try again.");
    } finally {
      setIsUserCreationLoading(false);
    }
  };

  const handleUsernameChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setUsername(event.target.value);
  };


  const getUsersPreviousSession = async(userID:string)=>{
    console.log(userID)

   const data = await api.get(`/users/getUsersPreviousGameSession?userID=${userID}`);
   console.log(data.data.userSesssions)

    setUserPreviousGameSessionData(data.data.userSesssions);
  }



  useEffect(()=>{

  const userID = localStorage.getItem("userid") ||'';
   getUsersPreviousSession(userID);
 
     
   },[])

  return {
    stats: { isUserCreationLoading, username , usersPreviousgameSessionData},
    actions: { handleStart, handleUsernameChange },
  };
};

export default useHome;
