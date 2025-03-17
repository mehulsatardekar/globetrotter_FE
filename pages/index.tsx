import Head from "next/head";
import styles from "@/styles/Home.module.css";
import Home from "@/src/container/Home/Home";

export default function Index() {
  return (
    <>
      <Head>
        <title>Globetrotter</title>
        <meta name="description" content="Test your geography knowledge" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <div className={styles.videocontainer}>
        <video
          autoPlay
          muted
          loop
          playsInline
          className={styles.videoBg}
          poster="https://res.cloudinary.com/dwhsfh3sc/image/upload/v1742225341/adecco/pexels-quang-nguyen-vinh-222549-2132180_bcueil.jpg"
        >
          <source
            src="https://cdn-imgix.headout.com/media/videos/42bc24e61f0e32e3fbbefb0cbedbc961-Global%20Banner%20Video%20Desktop%20Version.mp4"
            type="video/mp4"
          />
        </video>
      </div>
      <div className={`${styles.page} ${styles.overlayContent}`}>
        <main className={styles.main}>
          <Home />
        </main>
      </div>
    </>
  );
}
