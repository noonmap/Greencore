import styles from '@/styles/Home.module.scss';
import AppLayout from '@/layout/AppLayout';
import { useAppDispatch } from '@/core/hooks';
import { useEffect } from 'react';
import { SET_NOW_PAGE } from '@/core/common/commonSlice';

export default function Home() {
	const dispatch = useAppDispatch();

	useEffect(() => {
		dispatch(SET_NOW_PAGE('home'));
		return () => {};
	}, []);

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
