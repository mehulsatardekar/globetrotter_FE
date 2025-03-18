import React from "react";
import { useRouter } from "next/router";
import Head from "next/head";
import styles from "@/styles/Home.module.css";
import Game from "@/src/container/Game/Game";

export default function GamePage() {
  const router = useRouter();
  const { id, challengedBy, challengeScore, playerName } = router.query;

  console.log("Game page props:", {
    id,
    challengedBy,
    challengeScore,
    playerName,
  });

  if (!id) return null;

  return (
    <>
      <Head>
        <title>Globetrotter - Game</title>
        <meta name="description" content="Play Globetrotter" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <div
        className={`${styles.page}`}
      >
        <main className={styles.main}>
          <Game
            sessionId={id as string}
            challengedBy={challengedBy as string}
            challengeScore={challengeScore ? Number(challengeScore) : undefined}
            playerName={playerName as string}
          />
        </main>
      </div>
    </>
  );
}
