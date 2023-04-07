import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import AppButton from '@/components/button/AppButton';
import { useAppDispatch, useAppSelector } from '@/core/hooks';

import { getAuth as GitHubGetAuth, signInWithPopup as GitHubSignInWithPopup, GithubAuthProvider, signOut as GitHubSignOut } from 'firebase/auth';
import { getAuth as GoogleGetAuth, signInWithPopup as GoogleSignInWithPopup, GoogleAuthProvider, signOut as GoogleSignOut } from 'firebase/auth';
import { logOut } from '@/core/user/userAPI';
import { getStorage, ref, getDownloadURL, uploadBytes } from 'firebase/storage';

import styles from './AppHeader.module.scss';
import Skeleton from 'react-loading-skeleton';
import { useRouter } from 'next/router';
import { checkIsAlert } from '@/core/alert/alertAPI';
import { SET_NOW_PAGE } from '@/core/common/commonSlice';
import { getCookieToken } from '@/lib/cookies';

export default function AppHeader() {
  const dispatch = useAppDispatch();
  const router = useRouter();
  const storage = getStorage();

  const nowPage = useAppSelector((state) => state.common.nowPage);
  const nickname = useAppSelector((state) => state.common?.userInfo?.nickname);
  const isAlert = useAppSelector((state) => state.common?.isAlert);
  const isAuth = getCookieToken();

  const [userProfileImagePath, setUserProfileImagePath] = useState<string>('');

  // github
  const githubAuth = GitHubGetAuth();
  const githubProvider = new GithubAuthProvider();

  // google
  const googleAuth = GoogleGetAuth();
  const googleProvider = new GoogleAuthProvider();

  useEffect(() => {
    if (nickname) {
      getUserProfile();
      handleIsAlertCheck();
    }
  }, [nickname, userProfileImagePath]);

  /** 사용자 프로필 이미지 가져오는 함수 */
  function getUserProfile() {
    const profileRef = ref(storage, `${nickname}/profileImage`);

    getDownloadURL(profileRef)
      .then((downloadURL) => {
        setUserProfileImagePath(downloadURL);
      })
      .catch((error) => {
        console.error(error);
      });
  }

  /** 알림 체크하기 기능 */
  async function handleIsAlertCheck() {
    try {
      dispatch(checkIsAlert(nickname));
    } catch (error) {
      console.error(error);
    }
  }

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

    // window.Kakao.Auth.logout()
    //   .then(async function () {
    //     console.log('kakao sign out!');
    //     console.log(window.Kakao.Auth.getAccessToken());

    //     // const params = {
    //     // 	client_id: kakaoConfig.restApiKey,
    //     // 	logout_redirect_uri: kakaoConfig.logOutRedirectUri
    //     // };

    //     // await axios.get(`https://kauth.kakao.com/oauth/logout`, {params});
    //     // alert('logout ok\naccess token -> ' + window.Kakao.Auth.getAccessToken());
    //     // dispatch(SET_IS_OAUTH_FALSE());
    //     // dispatch(logOut(accessToken));
    //   })
    //   .catch(function () {
    //     console.log('Not kakao logged in');
    //   });

    router.push('/auth/login');
  }

  function handleNotPageClick(page) {
    dispatch(SET_NOW_PAGE(page));
  }

  return (
    <>
      <div className={`${styles.container} xl:w-56 w-20 flex-none fixed overflow-hidden h-full px-3 py-5`}>
        <div className='flex flex-col justify-between h-full xl:px-4'>
          <div className='flex flex-col items-center xl:items-start'>
            <div className=' flex mb-10'>
              <Image src='/images/leaf4.png' width={32} height={32} className={`xl:hidden block`} alt='logo' />
              <Link href='/' className={`${styles.title} xl:block hidden`} data-content='GREENCORE'>
                <Image src={'/logo.png'} alt='' width={200} height={100} />
              </Link>
            </div>

            <div className={`${styles.navContainer} flex flex-col space-y-7`}>
              {isAuth ? (
                <>
                  <Link href='/home/recommend' onClick={() => handleNotPageClick('home')}>
                    {nowPage == 'home' ? (
                      <div className='flex items-center space-x-3'>
                        <span className='material-symbols-outlined fill main'>home</span>
                        <span className={`xl:block hidden`}>Home</span>
                      </div>
                    ) : (
                      <div className='flex items-center space-x-3'>
                        <span className='material-symbols-outlined'>home</span>
                        <span className='xl:block hidden leading-3'>Home</span>
                      </div>
                    )}
                  </Link>

                  <Link href='/plant/docs' onClick={() => handleNotPageClick('dictonary')}>
                    {nowPage == 'dictonary' ? (
                      <div className='flex items-center space-x-3 '>
                        <span className='material-symbols-outlined fill main'>auto_stories</span>
                        <span className={`xl:block hidden`}>식물 도감</span>
                      </div>
                    ) : (
                      <div className='flex items-center space-x-3 '>
                        <span className='material-symbols-outlined '>auto_stories</span>
                        <span className='xl:block hidden leading-3'>식물 도감</span>
                      </div>
                    )}
                  </Link>

                  <Link href='/plant/disease' onClick={() => handleNotPageClick('bug')}>
                    {nowPage == 'bug' ? (
                      <div className='flex items-center space-x-3'>
                        <span className='material-symbols-outlined fill main'>bug_report</span>
                        <span className={`xl:block hidden`}>병충해 분석</span>
                      </div>
                    ) : (
                      <div className='flex items-center space-x-3'>
                        <span className='material-symbols-outlined '>bug_report</span>
                        <span className='xl:block hidden'>병충해 분석</span>
                      </div>
                    )}
                  </Link>

                  <Link href='/schedule' onClick={() => handleNotPageClick('schedule')}>
                    {nowPage == 'schedule' ? (
                      <div className='flex items-center space-x-3 '>
                        <span className='material-symbols-outlined fill main'>calendar_month</span>
                        <span className={`xl:block hidden`}>식물 스케줄링</span>
                      </div>
                    ) : (
                      <div className='flex items-center space-x-3 '>
                        <span className='material-symbols-outlined '>calendar_month</span>
                        <span className='xl:block hidden'>식물 스케줄링</span>
                      </div>
                    )}
                  </Link>

                  <Link href={`/user/following/${nickname}`} onClick={() => handleNotPageClick('follow')}>
                    {nowPage == 'follow' ? (
                      <div className='flex items-center space-x-3'>
                        <span className='material-symbols-outlined fill main'>group</span>
                        <span className={`xl:block hidden`}>팔로우 관리</span>
                      </div>
                    ) : (
                      <div className='flex items-center space-x-3'>
                        <span className='material-symbols-outlined '>group</span>
                        <span className='xl:block hidden'>팔로우 관리</span>
                      </div>
                    )}
                  </Link>

                  <Link href={`/user/bookmark/${nickname}`} onClick={() => handleNotPageClick('bookmark')}>
                    {nowPage == 'bookmark' ? (
                      <div className='flex items-center space-x-3'>
                        <span className='material-symbols-outlined fill main'>book</span>
                        <span className={`xl:block hidden`}>북마크</span>
                      </div>
                    ) : (
                      <div className='flex items-center space-x-3'>
                        <span className='material-symbols-outlined '>book</span>
                        <span className='xl:block hidden'>북마크</span>
                      </div>
                    )}
                  </Link>

                  <Link href={`/user/alert/${nickname}`} onClick={() => handleNotPageClick('alert')}>
                    {nowPage == 'alert' ? (
                      <div className='flex items-center space-x-3 relative'>
                        {isAlert ? (
                          <span className='material-symbols-outlined fill main'>notification_important</span>
                        ) : (
                          <span className='material-symbols-outlined fill main'>notifications</span>
                        )}
                        <span className={`xl:block hidden`}>알림</span>
                      </div>
                    ) : (
                      <div className='flex items-center space-x-3'>
                        {isAlert ? (
                          <span className='material-symbols-outlined fill main'>notification_important</span>
                        ) : (
                          <span className='material-symbols-outlined'>notifications</span>
                        )}
                        <span className='xl:block hidden'>알림</span>
                      </div>
                    )}
                  </Link>

                  <Link href='/user/settings/password' onClick={() => handleNotPageClick('settings')}>
                    {nowPage == 'settings' ? (
                      <div className='flex items-center space-x-3'>
                        <span className='material-symbols-outlined  fill main'>settings</span>
                        <span className={`xl:block hidden`}>설정</span>
                      </div>
                    ) : (
                      <div className='flex items-center space-x-3'>
                        <span className='material-symbols-outlined '>settings</span>
                        <span className='xl:block hidden'>설정</span>
                      </div>
                    )}
                  </Link>
                </>
              ) : (
                <>
                  <Link href='/' onClick={() => handleNotPageClick('home')}>
                    {nowPage == 'home' ? (
                      <div className='flex items-center space-x-3'>
                        <span className='material-symbols-outlined fill main'>home</span>
                        <span className={`xl:block hidden ${styles.navItemHome}`}>Home</span>
                      </div>
                    ) : (
                      <div className='flex items-center space-x-3'>
                        <span className='material-symbols-outlined'>home</span>
                        <span className='xl:block hidden'>Home</span>
                      </div>
                    )}
                  </Link>

                  <Link href='/plant/docs' onClick={() => handleNotPageClick('dictonary')}>
                    {nowPage == 'dictonary' ? (
                      <div className='flex items-center space-x-3 '>
                        <span className='material-symbols-outlined fill main'>auto_stories</span>
                        <span className={`xl:block hidden`}>식물 도감</span>
                      </div>
                    ) : (
                      <div className='flex items-center space-x-3 '>
                        <span className='material-symbols-outlined '>auto_stories</span>
                        <span className='xl:block hidden leading-3'>식물 도감</span>
                      </div>
                    )}
                  </Link>

                  <Link href='/plant/disease' onClick={() => handleNotPageClick('bug')}>
                    {nowPage == 'bug' ? (
                      <div className='flex items-center space-x-3'>
                        <span className='material-symbols-outlined fill main'>bug_report</span>
                        <span className={`xl:block hidden`}>병충해 분석</span>
                      </div>
                    ) : (
                      <div className='flex items-center space-x-3'>
                        <span className='material-symbols-outlined '>bug_report</span>
                        <span className='xl:block hidden'>병충해 분석</span>
                      </div>
                    )}
                  </Link>

                  <Link href='/auth/login'>
                    {/* <div className={`${styles.login} w-full`}>로그인</div> */}
                    {nowPage == 'login' ? <div className='main'>로그인</div> : <div>로그인</div>}
                  </Link>

                  <Link href='/auth/signup'>{nowPage == 'signup' ? <div className='main'>회원가입</div> : <div>회원가입</div>}</Link>
                </>
              )}
            </div>
          </div>

          {isAuth ? (
            <>
              <div className='gap-3'>
                <Link href={`/user/feed/${nickname}`} onClick={() => handleNotPageClick('profile')}>
                  <div className='flex flex-col items-center'>
                    {userProfileImagePath ? (
                      <Image
                        priority
                        src={userProfileImagePath}
                        width={50}
                        height={50}
                        className={`${styles.image} border rounded-full xl:hidden`}
                        alt=''
                      />
                    ) : (
                      <div className='xl:hidden'>
                        <Skeleton width={50} height={50} circle />
                      </div>
                    )}
                  </div>
                </Link>

                <Link href={`/user/feed/${nickname}`} onClick={() => handleNotPageClick('profile')} className='xl:block hidden'>
                  <div className={`${styles.profile} flex mb-4 w-50 items-center rounded-full p-3 py-4 gap-3`}>
                    {userProfileImagePath ? (
                      <Image
                        priority
                        src={userProfileImagePath}
                        width={50}
                        height={50}
                        className={`${styles.image} border rounded-full xl:block hidden`}
                        alt=''
                      />
                    ) : (
                      <div className='xl:block hidden'>
                        <Skeleton width={50} height={50} circle />
                      </div>
                    )}
                    <div className='xl:block hidden'>
                      <div className='font-bold w-16 text-ellipsis overflow-hidden text-sm xl:block hidden text-ellipsis'>{nickname}</div>
                    </div>
                  </div>
                </Link>

                <div className='xl:block hidden'>
                  <AppButton text='로그아웃' handleClick={handleLogOut} bgColor='thin' className={`${styles.logoutBtn} mb-3 mt-3 xl:block hidden`} />
                </div>
              </div>
            </>
          ) : null}
        </div>
      </div>
    </>
  );
}
