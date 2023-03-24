import React from 'react';
import Link from 'next/link';
import AppButton from '@/components/button/AppButton';
import { useAppDispatch, useAppSelector } from '@/core/hooks';

import { getAuth as GitHubGetAuth, signInWithPopup as GitHubSignInWithPopup, GithubAuthProvider, signOut as GitHubSignOut } from 'firebase/auth';
import { getAuth as GoogleGetAuth, signInWithPopup as GoogleSignInWithPopup, GoogleAuthProvider, signOut as GoogleSignOut } from 'firebase/auth';
import { logOut } from '@/core/user/userAPI';
import { SET_IS_OAUTH_FALSE } from '@/core/user/userSlice';

import styles from './AppHeader.module.scss';

export default function AppHeader() {
  const dispatch = useAppDispatch();

  // github
  const githubAuth = GitHubGetAuth();
  const githubProvider = new GithubAuthProvider();

  // google
  const googleAuth = GoogleGetAuth();
  const googleProvider = new GoogleAuthProvider();

  /** 로그아웃: github, kakao, google, jwt */
  async function handleLogOut() {
    try {
      dispatch(logOut());
    } catch (error) {
      console.error(error);
    }

    GitHubSignOut(githubAuth)
      .then(() => {
        console.log('github sign out!');
        dispatch(SET_IS_OAUTH_FALSE());
      })
      .catch((error) => {
        console.error(error);
      });

    GoogleSignOut(googleAuth)
      .then(() => {
        console.log('google sign out!');
        dispatch(SET_IS_OAUTH_FALSE());
      })
      .catch((error) => {
        console.error(error);
      });

    window.Kakao.Auth.logout()
      .then(async function () {
        console.log('kakao sign out!');
        console.log(window.Kakao.Auth.getAccessToken());

        // const params = {
        // 	client_id: kakaoConfig.restApiKey,
        // 	logout_redirect_uri: kakaoConfig.logOutRedirectUri
        // };

        // await axios.get(`https://kauth.kakao.com/oauth/logout`, {params});
        // alert('logout ok\naccess token -> ' + window.Kakao.Auth.getAccessToken());
        dispatch(SET_IS_OAUTH_FALSE());
        // dispatch(logOut(accessToken));
      })
      .catch(function () {
        console.log('Not kakao logged in');
      });
  }

  return (
    <div className={`${styles.container} xl:w-56 w-20 flex-none fixed overflow-hidden h-full px-3 py-5`}>
      <div className='flex flex-col justify-between h-full px-4'>
        <div className=''>
          {/* <img src='/images/noProfile.png' width={50} className={`mb-7`} /> */}
          <div className=''>
            <div className={`${styles.title} mb-10`}>GREENCORE</div>
          </div>

          <div className={`${styles.navContainer} flex flex-col space-y-8`}>
            {/* <Link href='/'>비로그인</Link> */}
            <Link href='/feed'>Home</Link>
            <Link href='/'>식물 검색</Link>
            <Link href='/schedule'>식물 스케줄링</Link>
            <Link href='/user/follow/temp'>팔로우 관리</Link>
            <Link href='/alert'>알림</Link>
            <Link href='/user/password'>설정</Link>
            <Link href='/auth/signup'>회원가입</Link>
            <Link href='/auth/login'>로그인</Link>
          </div>
        </div>

        <div className='gap-3'>
          <Link href='/user/feed/식집사입니다만'>
            <div className='flex w-50 items-center rounded-full w-50 hover:bg-gray-100 p-3 gap-2'>
              <img src='/images/noProfile.png' width={50} height={50} />
              <div>
                <div className='font-bold text-ellipsis overflow-hidden text-sm'>사용자닉네임</div>
              </div>
            </div>
          </Link>

          <AppButton text='로그아웃' handleClick={handleLogOut} bgColor='thin' className='mb-3 mt-3' />
        </div>

        {/* <div className='flex flex-col items-center justify-center gap-3'>
          <Link href='/user/feed/식집사입니다만'>
            <div className='flex w-50 items-center gap-2 p-2 rounded-full w-50'>
              <img src='/images/noProfile.png' width={50} height={50} />
              <div>
                <div className='font-bold text-ellipsis overflow-hidden text-sm'>사용자닉네임</div>
              </div>
            </div>
          </Link>

          <AppButton />

          <div>로그아웃</div>
        </div> */}
      </div>
    </div>
  );
}
