import React from "react";
import styles from "./challengeBanner.module.css";

interface ChallengeBannerProps {
  username: string;
  score: number;
  onClose: () => void;
}

const ChallengeBanner = ({
  username,
  score,
  onClose,
}: ChallengeBannerProps) => {
  return (
    <div className={styles.banner}>
      <p>
        🎯 <strong>{username}</strong> scored <strong>{score}</strong> correct
        answers and challenges you to do better!
      </p>
      <button onClick={onClose} className={styles.closeButton}>
        ×
      </button>
    </div>
  );
};

export default ChallengeBanner;
