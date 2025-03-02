import React, { useState } from "react";
import styles from "./shareButton.module.css";

interface ShareButtonProps {
  shareUrl: string;
  score: number;
  totalQuestions: number;
}

const ShareButton = ({ shareUrl, score, totalQuestions }: ShareButtonProps) => {
  const [copied, setCopied] = useState(false);

  const shareText = `🌍 I scored ${score}/${totalQuestions} in Globetrotter Challenge! Can you beat my score?`;

  const handleCopyLink = async () => {
    try {
      await navigator.clipboard.writeText(shareUrl);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      console.error("Failed to copy:", err);
    }
  };

  const handleWhatsAppShare = () => {
    const whatsappUrl = `https://wa.me/?text=${encodeURIComponent(
      `${shareText}\n\n${shareUrl}`
    )}`;
    window.open(whatsappUrl, "_blank");
  };

  return (
    <div className={styles.shareContainer}>
      <button onClick={handleCopyLink} className={styles.shareButton}>
        {copied ? "✓ Copied!" : "Copy Link"}
      </button>
      <button onClick={handleWhatsAppShare} className={styles.whatsappButton}>
        Share on WhatsApp
      </button>
    </div>
  );
};

export default ShareButton;
