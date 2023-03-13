import AppLayout from '@/layout/AppLayout';
import { useRouter } from 'next/router';
import React, { useState } from 'react';
import axios from 'axios';

import kakaoConfig from '~/config/kakaoConfig.json';

export default function kakao() {
	const router = useRouter();
	const { code } = router.query;
	const [accessToken, setAccessToken] = useState('');

	async function handleKakaoLogin() {
		let access_token = null;

		try {
			const client_id = kakaoConfig.apiKey;
			const redirect_uri = kakaoConfig.redirectUri;
			const client_secret = kakaoConfig.clientSecret;

			const payload = {
				grant_type: 'authorization_code',
				client_id,
				client_secret,
				redirect_uri,
				code
			};

			const headers = {
				headers: {
					'content-type': 'application/x-www-form-urlencoded'
				}
			};

			const url = `https://kauth.kakao.com/oauth/token`;

			const { data } = await axios.post(url, payload, headers);
			access_token = data.access_token;
			setAccessToken(access_token);
			console.log(accessToken);
		} catch (error) {
			console.error(error);
		}

		try {
			const headers = {
				headers: {
					Authorization: `Bearer ${access_token}`
				}
			};

			const { data } = await axios.get('https://kapi.kakao.com/v2/user/me', headers);
			console.log(data);

			const kakaoEmail = data.kakao_account.email;
			const kakaoNickname = data.kakao_account.profile.nickname;
			const kakaoProfileImageUrl = data.kakao_account.profile.profile_image_url;
			const kakaoUID = data.id;

			console.log(kakaoEmail, kakaoUID, kakaoNickname, kakaoProfileImageUrl);
		} catch (error) {
			console.error(error);
		}
	}

	async function handleLogOut() {
		try {
			const headers = {
				headers: {
					Authorization: `Bearer ${accessToken}`
				}
			};

			const payload = {
				target_id: '1696881652'
			};

			const res = await axios.post('https://kapi.kakao.com/v1/user/logout', payload, headers);
			console.log(res);
		} catch (error) {
			console.error(error);
		}
	}

	return (
		<AppLayout>
			<button className="bg-blue-500 rounded" onClick={handleKakaoLogin}>
				카카오 로그인
			</button>
			<div>{code}</div>

			<button className="bg-blue-500 rounded" onClick={handleLogOut}>
				로그아웃
			</button>
		</AppLayout>
	);
}
