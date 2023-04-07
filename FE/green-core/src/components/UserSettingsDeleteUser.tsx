import React, { useEffect } from 'react';
import { useAppDispatch, useAppSelector } from '@/core/hooks';
import { deleteUser, logOut } from '@/core/user/userAPI';
import AppButton from '@/components/button/AppButton';
import styles from '@/styles/user/settings.module.scss';
import { SET_IS_POSSIBLE_UPDATE_USER_FALSE } from '@/core/user/userSlice';
import { useRouter } from 'next/router';
import { getAuth, deleteUser as deleteUserByOauth, signOut } from 'firebase/auth';
import { getCookieToken, removeCookieToken } from '@/lib/cookies';

export default function UserDelete() {
	const dispatch = useAppDispatch();
	const auth = getAuth();
	const router = useRouter();

	const authType = useAppSelector((state) => state.common.authType);

	useEffect(() => {
		return () => {
			dispatch(SET_IS_POSSIBLE_UPDATE_USER_FALSE());
		};
	}, []);

	async function handleUserDelete() {
		const user = auth.currentUser;

		await dispatch(deleteUser());

		if (authType == 'FIREBASE') {
			await signOut(auth);
			await deleteUserByOauth(user);
		}
		if (getCookieToken()) removeCookieToken();

		router.push('/auth/login');
	}

	return (
		<div className={`${styles.container} flex flex-col mx-auto justify-center h-4/6`}>
			<div className={`${styles.wrap} flex flex-col justify-center space-y-20 h-full`}>
				<div className="space-y-5">
					<div className="modalTitle">회원탈퇴</div>
					<div>
						정말로 회원탈퇴를 진행하시겠습니까?
						<br />
						삭제된 계정은 복구할 수 없습니다.
					</div>
				</div>

				<AppButton text="회원탈퇴" bgColor="danger" handleClick={handleUserDelete} />
			</div>
		</div>
	);
}
