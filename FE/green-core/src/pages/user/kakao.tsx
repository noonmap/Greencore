import AppLayout from '@/layout/AppLayout';
import { useRouter } from 'next/router';
import React from 'react';
import axios from 'axios';

import kakaoConfig from '~/config/kakaoConfig.json';

export default function kakao() {
  const router = useRouter();
  const { code } = router.query;

  async function handleKakaoLogin() {
    const restApiKey = kakaoConfig.apiKey;
    const redirectUri = kakaoConfig.redirectUri;

    const payload = {
      grant_type: 'authorization_code',
      client_id: restApiKey,
      redirect_uri: redirectUri,
      code,
    };

    console.log(payload);
    const headers = {
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
      },
    };
    // const tokenUrl = `https://kauth.kakao.com/oauth/token?grant_type=authorization_code&cliend_id=${restApiKey}&redirect_uri=${redirectUri}&code=${code}`;
    const tokenUrl = `https://kauth.kakao.com/oauth/token`;

    const res = await axios.post(tokenUrl, payload);
    console.log(res);
  }

  return (
    <AppLayout>
      <button className='bg-blue-500 rounded' onClick={handleKakaoLogin}>
        카카오 로그인
      </button>
      <div>{code}</div>
    </AppLayout>
  );
}
