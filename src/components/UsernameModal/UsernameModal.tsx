import React, { useState } from "react";
import styles from "./usernameModal.module.css";

interface UsernameModalProps {
  isOpen: boolean;
  onSubmit: (username: string) => void;
}

const UsernameModal = ({ isOpen, onSubmit }: UsernameModalProps) => {
  const [username, setUsername] = useState("");

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (username.trim()) {
      onSubmit(username.trim());
    }
  };

  return (
    <div className={styles.overlay}>
      <div className={styles.modal}>
        <h2>Enter Your Name</h2>
        <p>Before you start the challenge, let us know your name!</p>
        <form onSubmit={handleSubmit}>
          <input
            type="text"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            placeholder="Your name"
            className={styles.input}
            autoFocus
          />
          <button
            type="submit"
            className={styles.button}
            disabled={!username.trim()}
          >
            Start Challenge
          </button>
        </form>
      </div>
    </div>
  );
};

export default UsernameModal;
