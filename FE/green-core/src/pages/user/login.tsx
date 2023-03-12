import React, { useEffect } from 'react';

import AppLayout from '@/layout/AppLayout';
import { logIn } from '@/core/user/userAPI';
import { useForm } from 'react-hook-form';
import { useAppDispatch, useAppSelector } from '@/core/hooks';
import {
	getAuth as GitHubGetAuth,
	signInWithPopup as GitHubSignInWithPopup,
	GithubAuthProvider,
	signOut as GitHubSignOut
} from 'firebase/auth';
import {
	getAuth as GoogleGetAuth,
	signInWithPopup as GoogleSignInWithPopup,
	GoogleAuthProvider,
	signOut as GoogleSignOut
} from 'firebase/auth';

import Toastify from 'toastify-js';
import message from '@/assets/message.json';
import toastifyCSS from '@/assets/toastify.json';

type StateType = {
	email: string;
	password: string;
	files: Object;
};

const initialState: StateType = {
	email: '',
	password: '',
	files: null
};

export default function login() {
	const dispatch = useAppDispatch();
	const firebase = useAppSelector((state) => state.common.firebase);

	// github
	const githubAuth = GitHubGetAuth(firebase);
	const githubProvider = new GithubAuthProvider();

	// google
	const googleAuth = GoogleGetAuth(firebase);
	const googleProvider = new GoogleAuthProvider();

	const {
		register,
		formState: { errors },
		setValue,
		getValues,
		watch
	} = useForm<StateType>({ defaultValues: initialState });

	const [email, password, files] = getValues(['email', 'password', 'files']);

	function toast() {
		Toastify({
			text: message.CheckInputForm,
			duration: 1500,
			position: 'center',
			stopOnFocus: true,
			style: toastifyCSS.fail
		}).showToast();
	}

	async function handleLogIn() {
		if (email == '' || password == '') {
			toast();
			return;
		}

		// if (files != null) console.log(files[0]);

		try {
			const payload = { email, password };
			console.log(payload);
			dispatch(logIn(payload));
		} catch (error) {
			console.error(error);
		}
	}

	function handleGithubLogIn() {
		GitHubSignInWithPopup(githubAuth, githubProvider)
			.then((result) => {
				const credential = GithubAuthProvider.credentialFromResult(result);
				const token = credential.accessToken;
				const user = result.user;
				console.log('credential:', credential);
				console.log('token:', token);
				console.log('user:', user);
				// setUser(user);
				// dispatch(logIn(result.user));
			})
			.catch((error) => {
				const errorCode = error.code;
				const errorMessage = error.message;
				const email = error.customData.email;
				const credential = GithubAuthProvider.credentialFromError(error);
				console.log('github error!');
				console.log(errorCode, errorMessage, email, credential);
			});
	}

	function handleGoogleLogIn() {
		GoogleSignInWithPopup(googleAuth, googleProvider)
			.then((result) => {
				const credential = GoogleAuthProvider.credentialFromResult(result);
				const token = credential.accessToken;
				const user = result.user;
				console.log('auth:', googleAuth);
				console.log('credential:', credential);
				console.log('token:', token);
				console.log('user:', user);
			})
			.catch((error) => {
				const errorCode = error.code;
				const errorMessage = error.message;
				const email = error.customData.email;
				const credential = GoogleAuthProvider.credentialFromError(error);
				console.log('google error!');
				console.log(errorCode, errorMessage, email, credential);
			});
	}

	function handleKakaoLogIn() {
		window.Kakao.Auth.authorize({
			redirectUri: 'http://localhost:3000/user/kakao'
		});
	}

	function handleLogOut() {
		GitHubSignOut(githubAuth)
			.then(() => {
				console.log('github sign out!');
				// dispatch(logOut());
			})
			.catch((error) => {
				console.error(error);
			});

		GoogleSignOut(googleAuth)
			.then(() => {
				console.log('google sign out!');
			})
			.catch((error) => {
				console.error(error);
			});

		window.Kakao.Auth.logout()
			.then(function () {
				console.log('kakao sign out!');
				alert('logout ok\naccess token -> ' + window.Kakao.Auth.getAccessToken());
				// deleteCookie();
			})
			.catch(function () {
				alert('Not logged in');
			});
	}

	useEffect(() => {
		watch();
		return () => {};
	}, []);

	return (
		<AppLayout>
			<h1>로그인</h1>

			<input type="file" accept="image/*" {...register('files')} />

			<div className="space-y-2">
				<label>이메일</label>
				<input type="email" required className="block" {...register('email')} />
				<label>비밀번호</label>
				<input type="text" required className="block" {...register('password')} />
			</div>

			<div>
				req data:
				<div>
					{getValues('email')} {getValues('password')} {JSON.stringify(getValues('files'))}
				</div>
			</div>

			<button className="bg-blue-500 rounded" onClick={handleLogIn}>
				로그인
			</button>

			<div className="space-x-3 space-y-3">
				<button className="bg-blue-500 rounded" onClick={handleGoogleLogIn}>
					구글 로그인
				</button>
				<button className="bg-blue-500 rounded" onClick={handleGithubLogIn}>
					깃허브 로그인
				</button>
				<button className="bg-blue-500 rounded" onClick={handleKakaoLogIn}>
					카카오 로그인
				</button>
				{/* <a id="kakao-login-btn" onClick={handleKakaoLogIn}>
					<img
						src="https://k.kakaocdn.net/14/dn/btroDszwNrM/I6efHub1SN5KCJqLm1Ovx1/o.jpg"
						width="222"
						alt="카카오 로그인 버튼"
					/>
				</a> */}
				<button className="bg-blue-500 rounded" onClick={handleLogOut}>
					로그아웃
				</button>
			</div>
		</AppLayout>
	);
}
