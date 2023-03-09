import Head from "next/head";
import styles from "@/styles/Home.module.scss";
import AppLayout from "@/layout/AppLayout";

export default function Home() {
  return (
    <AppLayout>
      <Head>
        <title>Green Core</title>
        <meta name='description' content='SSAFY 특화 부울경 1반 일해라일조' />
        <meta name='viewport' content='width=device-width, initial-scale=1' />
        <link rel='icon' href='/favicon.ico' />
      </Head>

      <main className={styles.main}>
        안뇽
        <button className='bg-blue-500 px-3 rounded'>hi</button>
      </main>
    </AppLayout>
  );
}
