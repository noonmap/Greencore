import React, { useEffect } from 'react';
import AppLayout from '@/layout/AppLayout';

import { useForm } from 'react-hook-form';
import { useAppDispatch, useAppSelector } from '@/core/hooks';
import { getAuth as GitHubGetAuth, signInWithPopup as GitHubSignInWithPopup, GithubAuthProvider, signOut as GitHubSignOut } from 'firebase/auth';
import { getAuth as GoogleGetAuth, signInWithPopup as GoogleSignInWithPopup, GoogleAuthProvider, signOut as GoogleSignOut } from 'firebase/auth';

import { signUp, logIn, logOut, checkEmailDuplicated } from '@/core/user/userAPI';
import { SET_ACCESS_TOKEN, SET_IS_OAUTH_FALSE, SET_IS_OAUTH_TRUE } from '@/core/user/userSlice';
import { checkInputFormToast } from '@/lib/utils';
import * as cookies from '@/lib/cookies';

type StateType = {
  email: string;
  password: string;
  files: Object;
};

const initialState: StateType = {
  email: '',
  password: '',
  files: null,
};

export default function login() {
  const dispatch = useAppDispatch();
  const firebase = useAppSelector((state) => state.common.firebase);
  const accessToken = useAppSelector((state) => state.user.accessToken);

  // github
  const githubAuth = GitHubGetAuth(firebase);
  const githubProvider = new GithubAuthProvider();

  // google
  const googleAuth = GoogleGetAuth(firebase);
  const googleProvider = new GoogleAuthProvider();

  const { register, getValues, watch } = useForm<StateType>({ defaultValues: initialState });

  const [email, password, files] = getValues(['email', 'password', 'files']);

  async function handleLogIn() {
    if (email == '' || password == '') {
      checkInputFormToast();
      return;
    }

    // if (files != null) console.log(files[0]);

    try {
      const payload = { email, password };
      dispatch(logIn(payload));
    } catch (error) {
      console.error(error);
    }
  }

  function handleGithubLogIn() {
    GitHubSignInWithPopup(githubAuth, githubProvider)
      .then(async (result) => {
        // const credential = GithubAuthProvider.credentialFromResult(result);
        const token = result?.user?.stsTokenManager;
        const user = result?.user?.reloadUserInfo;

        // TODO: 만약 이메일 중복이 아니라면 -> 회원가입 되도록
        // const { data } = await checkEmailDuplicated();
        // console.log(data);

        const githubEmail = user.email;
        const githubUID = user.localId;
        const githubNickname = user.screenName;
        const githubPhotoUrl = user.photoUrl;

        const githubAccessToken = token.accessToken;
        const githubRefreshToken = token.refreshToken;

        console.log(githubEmail, githubUID, githubNickname, githubPhotoUrl);
        console.log(githubAccessToken, githubRefreshToken);

        if (!false) {
          const payload = { email: githubEmail, password: githubUID + '!', nickname: githubNickname };
          const { data } = await signUp(payload);
        }

        dispatch(SET_IS_OAUTH_TRUE());
        dispatch(SET_ACCESS_TOKEN(githubAccessToken));
        cookies.setRefreshToken(githubRefreshToken);
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
      .then(async (result) => {
        // const credential = GoogleAuthProvider.credentialFromResult(result);
        const token = result.user.stsTokenManager;
        const user = result?.user?.reloadUserInfo;

        const googleEmail = user.email;
        const googleUID = user.localId;
        const googleNickname = user.displayName;
        const googlePhotoUrl = user.photoUrl;

        const googleAccessToken = token.accessToken;
        const googleRefreshToken = token.refreshToken;

        console.log(googleEmail, googleNickname, googleUID, googlePhotoUrl);
        console.log(googleAccessToken, googleRefreshToken);

        // TODO: api 완성되면 이메일 중복 확인 하고 token 도 넘겨주기
        if (!false) {
          const payload = { email: googleEmail, password: googleUID + '!', nickname: googleNickname };
          const { data } = await signUp(payload);
        }

        dispatch(SET_IS_OAUTH_TRUE());
        dispatch(SET_ACCESS_TOKEN(googleAccessToken));
        cookies.setRefreshToken(googleRefreshToken);
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
      redirectUri: 'http://localhost:3000/user/kakao',
    });
  }

  async function handleLogOut() {
    try {
      dispatch(logOut(accessToken));
    } catch (error) {
      console.error(error);
    }

    GitHubSignOut(githubAuth)
      .then(() => {
        console.log('github sign out!');
        dispatch(SET_IS_OAUTH_FALSE());
        // dispatch(logOut());
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
      .then(function () {
        console.log('kakao sign out!');
        alert('logout ok\naccess token -> ' + window.Kakao.Auth.getAccessToken());
        dispatch(SET_IS_OAUTH_FALSE());
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

      <input type='file' accept='image/*' {...register('files')} />

      <div className='space-y-2'>
        <label>이메일</label>
        <input type='email' required className='block' {...register('email')} />
        <label>비밀번호</label>
        <input type='text' required className='block' {...register('password')} />
      </div>

      <div>
        req data:
        <div>
          {getValues('email')} {getValues('password')} {JSON.stringify(getValues('files'))}
        </div>
      </div>

      <button className='bg-blue-500 rounded' onClick={handleLogIn}>
        로그인
      </button>

      <div className='space-x-3 space-y-3'>
        <button className='bg-blue-500 rounded' onClick={handleGoogleLogIn}>
          구글 로그인
        </button>
        <button className='bg-blue-500 rounded' onClick={handleGithubLogIn}>
          깃허브 로그인
        </button>
        <button className='bg-blue-500 rounded' onClick={handleKakaoLogIn}>
          카카오 로그인
        </button>
        {/* <a id="kakao-login-btn" onClick={handleKakaoLogIn}>
					<img
						src="https://k.kakaocdn.net/14/dn/btroDszwNrM/I6efHub1SN5KCJqLm1Ovx1/o.jpg"
						width="222"
						alt="카카오 로그인 버튼"
					/>
				</a> */}
        <button className='bg-blue-500 rounded' onClick={handleLogOut}>
          로그아웃
        </button>
      </div>
    </AppLayout>
  );
}
