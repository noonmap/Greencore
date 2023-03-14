import React, { useCallback, useEffect, useRef, useState } from 'react';
import AppLayout from '@/layout/AppLayout';
import { useRouter } from 'next/router';
import { useAppSelector } from '@/core/hooks';

import { getProfile } from '@/core/user/userAPI';
import { getStorage, ref, uploadBytesResumable, getDownloadURL } from 'firebase/storage';
import Skeleton from 'react-loading-skeleton';
import { useForm } from 'react-hook-form';

import Toastify from 'toastify-js';
import message from '@/assets/message.json';
import toastifyCSS from '@/assets/toastify.json';
import { File } from 'buffer';
import Link from 'next/link';

type ProfileType = {
  followerCount: number;
  followingCount: number;
  introduction: string;
  isFollowed: boolean;
  nickname: string;
  profileImagePath: string;
};

type StateType = {
  uploadProfileImage: File;
};

const initialState: StateType = {
  uploadProfileImage: null,
};

export default function FeedDetail() {
  const router = useRouter();
  const storage = getStorage();

  const { nickname } = router.query;
  const myNickname = useAppSelector((state) => state.common.userInfo.nickname);

  const { register, setValue, getValues, watch } = useForm<StateType>({ defaultValues: initialState });
  const [uploadProfileImage] = getValues(['uploadProfileImage']);

  const [userProfile, setUserProfile] = useState<ProfileType>();
  const [isSameUser, setIsSameUser] = useState<boolean>(false);
  const [userProfileImagePath, setUserProfileImagePath] = useState<string>(null);

  const inputRef = useRef(null);

  const getUserProfile = useCallback(async () => {
    const { data } = await getProfile(nickname);
    setUserProfile(data);

    const profileRef = ref(storage, `${myNickname}/profileImage`);
    getDownloadURL(profileRef).then((downloadURL) => {
      setUserProfileImagePath(downloadURL);
    });
  }, [nickname]);

  function checkSameUser() {
    if (myNickname == nickname) setIsSameUser(true);
  }

  function handleImageExploerOpen() {
    const profileImageInput: any = document.querySelector(`.profileImageInput`);
    profileImageInput.click();
  }

  function handleProfileImageUpdate() {
    if (!uploadProfileImage) return;

    const profileRef = ref(storage, `${myNickname}/profileImage`);
    const uploadTask = uploadBytesResumable(profileRef, uploadProfileImage[0]);

    uploadTask.on(
      'state_changed',
      (snapshot) => {
        const progress = (snapshot.bytesTransferred / snapshot.totalBytes) * 100;

        switch (snapshot.state) {
          case 'paused':
            console.log('Upload is paused');
            break;
          case 'running':
            console.log('Upload is running');
            break;
        }
      },
      (error) => {
        Toastify({
          text: message.UpdateProfileImageFail,
          duration: 1500,
          position: 'center',
          stopOnFocus: true,
          style: toastifyCSS.fail,
        }).showToast();
        console.error(error);
      },
      () => {
        Toastify({
          text: message.UpdateProfileImageSuccess,
          duration: 1500,
          position: 'center',
          stopOnFocus: true,
          style: toastifyCSS.success,
        }).showToast();

        getDownloadURL(uploadTask.snapshot.ref).then((downloadURL) => {
          setUserProfileImagePath(downloadURL);
        });
      }
    );
  }

  useEffect(() => {
    if (!router.isReady) return;
    getUserProfile();
    checkSameUser();
    watch();

    handleProfileImageUpdate();
    return () => {};
  }, [nickname, isSameUser, uploadProfileImage, inputRef]);

  return (
    <AppLayout>
      <h1>User Feed</h1>

      <div className='space-y-2 '>
        {/* 프로필 라인 */}
        <div>
          <input type='file' accept='image/*' hidden className='profileImageInput' {...register('uploadProfileImage')} />
          <div className='flex space-x-3'>
            <div onClick={handleImageExploerOpen}>
              {userProfileImagePath ? (
                (
                  <img
                    src={userProfileImagePath}
                    alt='사용자 프로필 이미지'
                    className='rounded-full w-20 h-20 bg-cover'
                    onClick={handleProfileImageUpdate}
                  />
                ) || <Skeleton width={90} height={90} circle />
              ) : (
                <Skeleton width={90} height={90} circle />
              )}
            </div>

            <div>
              <div className='flex'>
                <div>{userProfile?.nickname}</div>
                {isSameUser ? (
                  <Link href='/user/settings'>
                    <span className='material-symbols-outlined'>edit</span>
                  </Link>
                ) : null}
              </div>
              <div>{userProfile?.introduction}</div>
              <div>
                {userProfile?.isFollowed ? (
                  <button className='bg-blue-500 rounded'>팔로우중</button>
                ) : (
                  <button className='bg-blue-500 rounded'>팔로우하기</button>
                )}
              </div>
            </div>
            <div>
              <div>팔로워 {userProfile?.followerCount}</div>
              <div>팔로잉 {userProfile?.followingCount}</div>
            </div>
          </div>
        </div>

        {/* 내키식 라인 */}
        <div>내키식 라인</div>

        {/* 관찰일지 라인 */}
        <div>관찰일지 라인</div>

        {/* 포스트 라인 */}
        <div>포스트 라인</div>
      </div>
    </AppLayout>
  );
}
