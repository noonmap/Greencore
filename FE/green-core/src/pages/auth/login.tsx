import React, { useEffect, useState } from 'react';
import AppLayout from '@/layout/AppLayout';
import Image from 'next/image';
import Link from 'next/link';

import { useForm } from 'react-hook-form';
import { useAppDispatch, useAppSelector } from '@/core/hooks';
import { signInWithPopup, getRedirectResult, signInWithCredential } from 'firebase/auth';
import { getAuth, GoogleAuthProvider, GithubAuthProvider } from 'firebase/auth';
import { getStorage, ref, uploadBytes } from 'firebase/storage';

import { logIn, checkEmailDuplicated, logInByOAuth, signUp } from '@/core/user/userAPI';
import { checkInputFormToast } from '@/lib/utils';

import styles from '@/styles/Auth.module.scss';
import AppButton from '@/components/button/AppButton';
import FindPasswordModal from '@/components/modal/FindPasswordModal';
import { SET_AUTH_TYPE_DB, SET_AUTH_TYPE_FIREBASE, SET_AUTH_TYPE_KAKAO } from '@/core/common/commonSlice';

type StateType = {
  email: string;
  password: string;
};

const initialState: StateType = {
  email: 'test1@test.com',
  password: '1234',
};

export default function login() {
  const dispatch = useAppDispatch();

  const storage = getStorage();
  const auth = getAuth();
  const githubProvider = new GithubAuthProvider();
  const googleProvider = new GoogleAuthProvider();

  const [isOpenFindPasswordModal, setIsOpenFindPasswordModal] = useState<boolean>(false);
  const [isPossibleLogIn, setIsPossibleLogIn] = useState<boolean>(false);

  const { register, setValue, getValues, watch } = useForm<StateType>({ defaultValues: initialState });
  const [email, password] = getValues(['email', 'password']);

  useEffect(() => {
    watch();
  }, []);

  useEffect(() => {
    checkIsPossibleLogIn();
  }, [email, password, isPossibleLogIn]);

  /** 로그인 함수 */
  async function handleLogIn() {
    if (email == '' || password == '') {
      checkInputFormToast();
      return;
    }

    try {
      const payload = { email, password };
      console.log(payload);
      dispatch(SET_AUTH_TYPE_DB());
      dispatch(logIn(payload));
    } catch (error) {
      setValue('email', '');
      setValue('password', '');
      console.error(error);
    }
  }

  /** GitHub OAUTH 로그인 */
  function handleGithubLogIn() {
    signInWithPopup(auth, githubProvider)
      .then(async (result: any) => {
        // const credential = GithubAuthProvider.credentialFromResult(result);
        const token = result?.user?.stsTokenManager;
        const user = result?.user?.reloadUserInfo;

        const githubEmail = user.email;
        const githubUID = user.localId;
        const githubNickname = user.screenName;
        const githubPhotoUrl = user.photoUrl;

        const githubAccessToken = token.accessToken;
        const githubRefreshToken = token.refreshToken;

        // console.log(githubEmail, githubUID, githubNickname, githubPhotoUrl);
        // console.log(githubAccessToken, githubRefreshToken);

        try {
          const { data } = await checkEmailDuplicated(githubEmail);
          const logInPayload = { accessToken: githubAccessToken, refreshToken: githubRefreshToken };
          console.log(data);

          if (data) {
            // 없는 이메일이므로 회원가입 진행 후 로그인
            const signUpPayload = { email: githubEmail, password: githubUID + '!', nickname: githubNickname };
            const { data } = await signUp(signUpPayload);

            if (data) {
              dispatch(logInByOAuth(logInPayload));
              dispatch(SET_AUTH_TYPE_FIREBASE());
            }
          } else {
            dispatch(logInByOAuth(logInPayload));
            dispatch(SET_AUTH_TYPE_FIREBASE());
          }
        } catch (error) {
          console.error(error);
        }
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

  /** Google OAUTH 로그인 */
  function handleGoogleLogIn() {
    signInWithPopup(auth, googleProvider)
      .then(async (result: any) => {
        // const credential = GoogleAuthProvider.credentialFromResult(result);
        const token = result.user.stsTokenManager;
        const user = result?.user?.reloadUserInfo;

        const googleEmail = user.email;
        const googleUID = user.localId;
        const googleNickname = user.displayName;
        const googlePhotoUrl = user.photoUrl;

        const googleAccessToken = token.accessToken;
        const googleRefreshToken = token.refreshToken;

        try {
          const { data } = await checkEmailDuplicated(googleEmail);
          const logInPayload = { accessToken: googleAccessToken, refreshToken: googleRefreshToken };
          console.log(data);

          if (data) {
            // 없는 이메일이므로 회원가입 진행 후 로그인
            const signUpPayload = { email: googleEmail, password: googleUID + '!', nickname: googleNickname };
            const { data } = await signUp(signUpPayload);
            // console.log(data);

            if (data) {
              dispatch(logInByOAuth(logInPayload));
              dispatch(SET_AUTH_TYPE_FIREBASE());
            }
          } else {
            dispatch(logInByOAuth(logInPayload));
            dispatch(SET_AUTH_TYPE_FIREBASE());
          }
        } catch (error) {
          console.error(error);
        }
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

  /** Kakao OAUTH 로그인 */
  function handleKakaoLogIn() {
    window.Kakao.Auth.authorize({ redirectUri: 'http://localhost:3000/user/kakao' });
    // dispatch(SET_AUTH_TYPE_KAKAO());
  }

  /** 이메일&비밀번호 input 채웠는지 확인하는 함수 */
  function checkIsPossibleLogIn() {
    if (email != '' && password != '') setIsPossibleLogIn(true);
    else setIsPossibleLogIn(false);
  }

  /** 회원가입하면 firebase storage 에 프로필 이미지 초기 등록하도록 하는 함수 */
  async function handleSetUserProfile(nickname, profileUrl) {
    const res = await fetch(profileUrl);
    const blob = await res.blob();
    const file = new File([blob], 'noProfile', { type: 'image/png' });

    const profileRef = ref(storage, `${nickname}/profileImage`);

    uploadBytes(profileRef, file, { contentType: 'image/png' }).then(() => {});
  }

  return (
    <AppLayout>
      <FindPasswordModal isOpen={isOpenFindPasswordModal} handleModalClose={() => setIsOpenFindPasswordModal(false)} />

      <div className={`${styles.container} h-full flex flex-col`}>
        <Image src='/images/leaf1.png' priority width={512} height={512} alt='' className={`${styles.leaf1} `} />
        <Image src='/images/leaf2.png' priority width={512} height={512} alt='' className={`${styles.leaf2}`} />
        <Image src='/images/leaf3.png' priority width={512} height={512} alt='' className={`${styles.leaf3}`} />

        <div className={`w-96 ${styles.wrap} flex flex-col justify-between`}>
          <div className={`${styles.title}`}>LOGIN</div>

          <div>
            {/* 이메일 */}
            <div className={`${styles.content} space-y-2 mb-10`}>
              <label className={`${styles.email}`}>이메일</label>
              <input type='email' placeholder='ssafy@ssafy.com' className={`block w-full`} {...register('email')} />
            </div>

            {/* 비밀번호 */}
            <div className={`${styles.content} space-y-2`}>
              <div className='flex items-center space-x-2'>
                <label className={`${styles.password}`}>비밀번호</label>
                <div className={`${styles.help}`}>영어 소문자, 숫자, 특수문자 포함 최소 8자</div>
              </div>
              <input type='email' placeholder='비밀번호' className='block w-full' {...register('password')} />
            </div>
          </div>

          {/* 간편 로그인 */}
          <div className={`flex flex-col gap-2 items-center justify-center `}>
            <div className={`${styles.help} ${styles.line} `}>간편 로그인</div>
            <div className={`${styles.oauth} flex space-x-5 items-center justify-center`}>
              <div onClick={handleKakaoLogIn} className='flex items-center justify-center'>
                <Image src='/images/kakao.png' alt='hi' width={24} height={24} />
              </div>
              <div onClick={handleGoogleLogIn} className='flex items-center justify-center'>
                <i className='fa-brands fa-google text-2xl'></i>
              </div>
              <div onClick={handleGithubLogIn} className='flex items-center justify-center'>
                <i className='fa-brands fa-github text-2xl'></i>
              </div>
            </div>
          </div>

          {/* 로그인 버튼 */}
          <div>
            <div className={`${styles.find} flex justify-between space-x-2 mt-2`}>
              <Link href='/auth/signup' className={` underline cursor-pointer`}>
                회원가입
              </Link>
              <div className={`underline cursor-pointer`} onClick={() => setIsOpenFindPasswordModal(true)}>
                비밀번호 찾기
              </div>
            </div>
            <AppButton text='로그인' bgColor={isPossibleLogIn ? 'main' : 'thin'} handleClick={handleLogIn} />
          </div>
        </div>
      </div>
    </AppLayout>
  );
}
