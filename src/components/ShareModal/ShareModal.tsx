import React, { useState, useRef } from "react";
import styles from "./shareModal.module.css";
import * as htmlToImage from "html-to-image";

interface ShareModalProps {
  isOpen: boolean;
  onClose: () => void;
  score: {
    correct: number;
    incorrect: number;
  };
  username: string;
  shareUrl: string;
}

const ShareModal = ({
  isOpen,
  onClose,
  score,
  username,
  shareUrl,
}: ShareModalProps) => {
  const [copied, setCopied] = useState(false);
  const previewRef = useRef<HTMLDivElement>(null);

  if (!isOpen) return null;

  const handleCopyLink = async () => {
    try {
      // Try using clipboard API first
      if (navigator.clipboard && window.isSecureContext) {
        await navigator.clipboard.writeText(shareUrl);
      } else {
        // Fallback for non-HTTPS or unsupported browsers
        const textArea = document.createElement("textarea");
        textArea.value = shareUrl;
        textArea.style.position = "fixed";
        textArea.style.left = "-999999px";
        textArea.style.top = "-999999px";
        document.body.appendChild(textArea);
        textArea.focus();
        textArea.select();
        try {
          document.execCommand("copy");
        } catch (err) {
          console.error("Failed to copy text:", err);
        }
        textArea.remove();
      }
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      console.error("Failed to copy:", err);
    }
  };

  const handleWhatsAppShare = () => {
    const shareText = `🌍 Globetrotter Challenge\n${username} challenges you!\nScore: ${score.correct} correct, ${score.incorrect} incorrect\nCan you beat this score?`;
    const whatsappUrl = `https://wa.me/?text=${encodeURIComponent(
      `${shareText}\n\n${shareUrl}`
    )}`;
    window.open(whatsappUrl, "_blank");
  };

  const handleDownloadImage = async () => {
    if (previewRef.current) {
      try {
        const dataUrl = await htmlToImage.toPng(previewRef.current, {
          quality: 1.0,
          backgroundColor: "#3b82f6",
          style: {
            borderRadius: "12px",
            padding: "24px",
          },
        });

        const link = document.createElement("a");
        link.download = "globetrotter-score.png";
        link.href = dataUrl;
        link.click();
      } catch (err) {
        console.error("Failed to download image:", err);
      }
    }
  };

  return (
    <div className={styles.modalOverlay}>
      <div className={styles.modal}>
        <button className={styles.closeButton} onClick={onClose}>
          ×
        </button>
        <h3>Share with friends</h3>
        <p className={styles.scoreText}>
          Your score: {score.correct} correct, {score.incorrect} incorrect
        </p>

        <div className={styles.previewCard} ref={previewRef}>
          <div className={styles.logo}>🌍</div>
          <h2>Globetrotter Challenge</h2>
          <p>{username} challenges you!</p>
          <p className={styles.scorePreview}>
            Score: {score.correct} correct, {score.incorrect} incorrect
          </p>
          <p className={styles.callToAction}>Can you beat this score?</p>
          <p className={styles.clickText}>Click the link to play now!</p>
        </div>

        <button onClick={handleDownloadImage} className={styles.downloadButton}>
          Download Image
        </button>

        <button onClick={handleWhatsAppShare} className={styles.shareButton}>
          Share on WhatsApp
        </button>

        <button onClick={handleCopyLink} className={styles.copyButton}>
          {copied ? "✓ Link Copied!" : "Copy Link"}
        </button>
      </div>
    </div>
  );
};

export default ShareModal;
