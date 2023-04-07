import AppButton from '@/components/button/AppButton';
import { SET_NOW_PAGE } from '@/core/common/commonSlice';
import { useAppDispatch } from '@/core/hooks';
import AppLayout from '@/layout/AppLayout';
import Image from 'next/image';
import { useRouter } from 'next/router';
import React, { useEffect } from 'react';

export default function ErrorPage() {
	const dispatch = useAppDispatch();
	const router = useRouter();

	useEffect(() => {
		dispatch(SET_NOW_PAGE('404'));
		return () => {};
	}, []);

	function handleLogInClick() {
		router.back();
	}

	function handleSignUpClick() {
		router.push('/');
	}

	return (
		<AppLayout>
			<div className="flex flex-col justify-center items-center h-4/5 space-y-10">
				<div className="flex flex-col items-center">
					<div className="font-bold">존재하지 않는 페이지입니다</div>
					<Image priority src="/images/notFound.png" alt="notFound" width={300} height={100} />
				</div>

				<div className="flex items-center space-x-5">
					<AppButton text="뒤로가기" bgColor="thin" handleClick={handleLogInClick}></AppButton>
					<AppButton text="홈으로" handleClick={handleSignUpClick}></AppButton>
				</div>
			</div>
		</AppLayout>
	);
}
