import React, { useCallback, useEffect, useState } from 'react';
import AppLayout from '@/layout/AppLayout';
import Image from 'next/image';
import { useRouter } from 'next/router';
import { useAppSelector } from '@/core/hooks';

import { getProfile } from '@/core/user/userAPI';
import { getStorage, ref, listAll, uploadBytes, getDownloadURL } from 'firebase/storage';
import Skeleton from 'react-loading-skeleton';

type ProfileType = {
  followerCount: number;
  followingCount: number;
  introduction: string;
  isFollowed: boolean;
  nickname: string;
  profileImagePath: string;
};

export default function FeedDetail() {
  const firebase = useAppSelector((state) => state.common.firebase);
  const storage = getStorage();

  const router = useRouter();
  const { nickname } = router.query;
  const [profile, setProfile] = useState<ProfileType>();

  const getUserProfile = useCallback(async () => {
    const { data } = await getProfile(nickname);
    setProfile(data);
    console.log(data);
  }, [nickname]);

  function handleProfileImageUpdate() {
    console.log('handleProfileImageUpdate');
  }

  function handleNicknameUpdate() {
    console.log('handleNicknameUpdate');
  }

  useEffect(() => {
    if (!router.isReady) return;
    getUserProfile();
    return () => {};
  }, [nickname]);

  return (
    <AppLayout>
      <h1>User Feed</h1>

      <div className='space-y-2 '>
        {/* 프로필 라인 */}
        <div>
          <div className='flex space-x-3'>
            {profile?.profileImagePath ? (
              <Image src={profile?.profileImagePath} width={90} height={90} alt='사용자 프로필 이미지' onClick={handleProfileImageUpdate} /> || (
                <Skeleton width={90} height={90} />
              )
            ) : (
              <Skeleton width={90} height={90} />
            )}
            <div>
              <div className='flex'>
                <div>{profile?.nickname}</div>
                <span className='material-symbols-outlined' onClick={handleNicknameUpdate}>
                  edit
                </span>
              </div>
              <div>{profile?.introduction}</div>
              <div>
                {profile?.isFollowed ? (
                  <button className='bg-blue-500 rounded'>팔로우중</button>
                ) : (
                  <button className='bg-blue-500 rounded'>팔로우하기</button>
                )}
              </div>
            </div>
            <div>
              <div>팔로워 {profile?.followerCount}</div>
              <div>팔로잉 {profile?.followingCount}</div>
            </div>
          </div>
          <div>profileImagePath: {profile?.profileImagePath}</div>
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
