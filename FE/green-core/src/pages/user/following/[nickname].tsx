import React, { useCallback, useEffect, useState } from 'react';
import AppLayout from '@/layout/AppLayout';
import Link from 'next/link';
import { useRouter } from 'next/router';
import { useAppSelector } from '@/core/hooks';
import { getFollowerList, getFollowingList } from '@/core/follow/followAPI';
import Image from 'next/image';
import { getProfile } from '@/core/user/userAPI';
import { ProfileType } from '@/core/user/userType';
import { getStorage, ref, getDownloadURL, uploadBytes } from 'firebase/storage';
import { updateFollow, deleteFollow } from '@/core/follow/followAPI';
import Skeleton from 'react-loading-skeleton';
import axios, { Axios } from 'axios';
import http from '@/lib/http';

import FollowLayout from '@/layout/FollowLayout';

export default function follow() {
  const router = useRouter();
  const storage = getStorage();

  const { nickname } = router.query;
  const { nickname: myNickname } = useAppSelector((state) => state.common.userInfo);

  const [isFollowing, setisFollowing] = useState(false);

  const [followingList, setFollowingList] = useState([]);
  const [followerList, setFollowerList] = useState([]);

  const [userProfileList, setUserProfileList] = useState({});

  const [isLoading, setIsLoading] = useState(false);

  function getUserProfile(nickname) {
    const profileRef = ref(storage, `${nickname}/profileImage`);

    getDownloadURL(profileRef)
      .then((downloadURL) => {
        userProfileList[nickname] = downloadURL;
        const newUserProfile = { ...userProfileList };
        setUserProfileList(newUserProfile);
      })
      .catch((error) => {
        console.error(error);
      });
  }

  async function fetchFollowingList() {
    try {
      const { data } = await getFollowingList(nickname);

      for (let i = 0; i < data.length; i++) {
        getUserProfile(data[i].nickname);
        if (i == data.length - 1) setIsLoading(true);
      }

      setFollowingList(data);
    } catch (error) {
      // console.error(error);
    }
  }

  async function fetchFollowerList() {
    try {
      const { data } = await getFollowerList(nickname);

      for (let i = 0; i < data.length; i++) {
        getUserProfile(data[i].nickname);
        if (i == data.length - 1) setIsLoading(true);
      }

      setFollowerList(data);
    } catch (error) {
      // console.error(error);
    }
  }

  async function handleSetUserProfile() {
    const res = await fetch('/images/noProfile.png');
    const blob = await res.blob();
    const file = new File([blob], 'noProfile', { type: 'image/png' });

    const profileRef = ref(storage, `${nickname}/profileImage`);

    uploadBytes(profileRef, file, { contentType: 'image/png' }).then(() => {});
  }

  async function handleFollowUpdate(e, nickname) {
    try {
      const { data } = await updateFollow(nickname);
      console.log(data);
    } catch (error) {
      console.error(error);
    }
  }
  async function handleFollowDelete(e, nickname) {
    try {
      const { data } = await deleteFollow(nickname);
      console.log(data);
    } catch (error) {
      console.error(error);
    }
  }

  useEffect(() => {
    if (!router.isReady) return;
    console.log(nickname);

    fetchFollowingList();
    // fetchFollowerList();

    return () => {};
  }, [nickname]);

  return (
    <FollowLayout>
      <div>
        {isLoading
          ? followingList.map((f) => (
              <div key={f.nickname} className='flex space-x-2'>
                {userProfileList[f.nickname] ? (
                  <Image
                    src={userProfileList[f.nickname]}
                    alt='사용자 프로필 이미지'
                    width={90}
                    height={90}
                    className='rounded-full bg-cover'
                    priority
                  />
                ) : (
                  <Skeleton width={90} height={90} circle />
                )}

                <Link href={`/user/feed/${f.nickname}`}>{f.nickname}</Link>

                <div>{f.introduction}</div>

                {f.isFollowed ? (
                  <button onClick={(e) => handleFollowDelete(e, f.nickname)}>팔로우중</button>
                ) : (
                  <button onClick={(e) => handleFollowUpdate(e, f.nickname)}>팔로우 하기</button>
                )}
              </div>
            ))
          : null}
      </div>

      <div>더보기?</div>
    </FollowLayout>
  );
}
