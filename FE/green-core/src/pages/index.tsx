import styles from '@/styles/Home.module.scss';
import AppLayout from '@/layout/AppLayout';
import { useAppDispatch } from '@/core/hooks';
import { useEffect } from 'react';
import { SET_IS_SEARCH_STATE, SET_NOW_PAGE } from '@/core/common/commonSlice';
import AppButton from '@/components/button/AppButton';
import { useRouter } from 'next/router';
import { getCookieToken } from '@/lib/cookies';
import Image from 'next/image';

export default function Home() {
	const router = useRouter();
	const dispatch = useAppDispatch();
	const isAuth = getCookieToken() ? true : false;

	useEffect(() => {
		dispatch(SET_NOW_PAGE('home'));
		dispatch(SET_IS_SEARCH_STATE('default'));
		return () => {};
	}, []);

	return (
		<AppLayout home>
			<main className="mx-7 my-7 flex flex-col justify-center items-center mt-20 overflow-x-hidden">
				<div className="flex flex-col animate__animated animate__fadeIn">
					<Image src={'/logo.png'} alt="" width={200} height={100} />
					<div className={`${styles.heading01}`}>식물을 키우고 있는, 키우고 싶은 사람들을 위한 반려식물 SNS</div>
				</div>

				<div className="space-y-16 mt-20 ">
					<div className={`${styles.heading1} flex flex-col justify-around items-center animate__animated animate__fadeInLeft`}>
						<div className={`${styles.title}`}>식물 도감</div>
						<img src="/images/heading/heading1.png" width="120" />
						<div className="flex flex-col items-center">
							<div>
								<div className={`${styles.sub}`}>궁금한 식물을 찾아봐요</div>
								<div className={`${styles.sub}`}>어떻게 키우는지 가이드도 얻을 수 있어요</div>
							</div>
						</div>
					</div>

					<div className={`${styles.heading1} flex flex-col justify-around items-center animate__animated animate__fadeInRight`}>
						<div className={`${styles.title}`}>병충해 분석</div>
						<img src="/images/heading/heading2.png" width="100" />
						<div className="flex flex-col items-center">
							<div>
								<div className={`${styles.sub}`}>식물의 병충해를 분석해요</div>
								<div className={`${styles.sub}`}>AI을 이용한 식물 병충해 분석 서비스!</div>
							</div>
						</div>
					</div>

					<div className={`${styles.heading1} flex flex-col justify-around items-center animate__animated animate__fadeInLeft`}>
						<div className={`${styles.title}`}>식물 스케줄링</div>
						<img src="/images/heading/heading3.png" width="100" />
						<div className="flex flex-col items-center">
							<div>
								<div className={`${styles.sub}`}>식물 스케줄링을 관리해요</div>
								<div className={`${styles.sub}`}>언제 물을 주고 분갈이를 할지 잊지않아요</div>
							</div>
						</div>
					</div>
				</div>

				{isAuth ? (
					<AppButton text="추천피드 보기" className="w-full mt-20 mb-20 mb-10" handleClick={() => router.push('/home/recommend')} />
				) : (
					<AppButton text="회원가입 하러가기" className="w-full mt-20 mb-10" handleClick={() => router.push('/auth/signup')} />
				)}
			</main>
		</AppLayout>
	);
}
