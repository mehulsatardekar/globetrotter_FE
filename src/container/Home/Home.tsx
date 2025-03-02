import React from "react";
import useHome from "./useHome";
import styles from "./home.module.css";

const Home = () => {
  const { stats, actions } = useHome();
  const { isUserCreationLoading, username } = stats || {};
  const { handleStart, handleUsernameChange } = actions || {};

  return (
    <>
      <div className={styles.hero}>
        <h1 className={styles.title}>
          Globe<span className={styles.highlight}>trotter</span>
        </h1>
        <p className={styles.description}>
          Test your geography knowledge in this exciting game of city
          recognition
        </p>
        <div className={styles.inputGroup}>
          <input
            type="text"
            value={username}
            onChange={(event) => handleUsernameChange(event)}
            placeholder="Enter your username"
            className={styles.input}
            onKeyPress={(e) => e.key === "Enter" && handleStart()}
          />
          <button
            onClick={handleStart}
            className={styles.button}
            disabled={isUserCreationLoading || !username.trim()}
          >
            {isUserCreationLoading ? "Starting..." : "Start Game"}
          </button>
        </div>
      </div>
      <div className={styles.globe}>
        {/* Add a globe animation or image here */}
      </div>
    </>
  );
};

export default Home;
