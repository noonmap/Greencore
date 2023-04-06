import Head from 'next/head';
import styles from '@/styles/Home.module.scss';
import AppLayout from '@/layout/AppLayout';
import AppLoading from '@/components/common/AppLoading';

export default function Home() {
	return (
		<AppLayout home>
			<main className="mx-7 my-7">
				<div>
					<div>식물을 키우고 있는, 키우고 싶은</div>
					<div>사람들을 위한</div>
					<div>반려식물 SNS</div>
					<div>GreenCore</div>
				</div>

				<div>식물 도감</div>
				<div>병충해 분석</div>
				<div>식물 스케줄링</div>

				<div>회원가입 하러가기</div>
			</main>
		</AppLayout>
	);
}
