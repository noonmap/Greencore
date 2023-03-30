import Head from 'next/head';
// import styles from '@/styles/Home.module.scss';
import AppLayout from '@/layout/AppLayout';

export default function Home() {
	return (
		<AppLayout home>
			<main>
				안뇽
				<span className="material-symbols-outlined">search</span>
				<button className="bg-blue-500 px-3 rounded">hi</button>
				<span className="material-symbols-outlined">favorite</span>
			</main>
		</AppLayout>
	);
}
