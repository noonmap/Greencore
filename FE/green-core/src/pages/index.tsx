import Head from 'next/head';
import styles from '@/styles/Home.module.scss';
import AppLayout from '@/layout/AppLayout';

export default function Home() {
  return (
    <AppLayout home>
      <main className={styles.main}>
        안뇽
        <button className='bg-blue-500 px-3 rounded'>hi</button>
      </main>
    </AppLayout>
  );
}
