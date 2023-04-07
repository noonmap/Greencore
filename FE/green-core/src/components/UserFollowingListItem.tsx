import { createAlert } from '@/core/alert/alertAPI';
import { deleteFollow, updateFollow } from '@/core/follow/followAPI';
import { useAppDispatch, useAppSelector } from '@/core/hooks';
import { getTodayDate } from '@/lib/utils';
import Image from 'next/image';
import Link from 'next/link';
import { useRouter } from 'next/router';
import React from 'react';
import Skeleton from 'react-loading-skeleton';
import AppButton from './button/AppButton';
import styles from '@/styles/user/follow.module.scss';

export const UserFollowingListItem = ({ following, userProfileList }) => {
  const dispatch = useAppDispatch();
  const router = useRouter();
  const myNickname = useAppSelector((state) => state.common.userInfo?.nickname);

  /** 팔로우 하는 함수 */
  async function handleFollowUpdate(e, nickname) {
    try {
      const { data } = await updateFollow(nickname);

      if (data) {
        const payload = {
          nickname,
          mentionNickname: myNickname,
          type: 'ALERT_FOLLOW',
          urlPath: `/user/feed/${myNickname}`,
          createdAt: getTodayDate(),
          isRead: false,
        };
        dispatch(createAlert(payload));
      }

      console.log(data);
      router.reload();
    } catch (error) {
      console.error(error);
    }
  }

  /** 언팔로우 함수 */
  async function handleFollowDelete(e, nickname) {
    try {
      const { data } = await deleteFollow(nickname);
      console.log(data);
      router.reload();
    } catch (error) {
      console.error(error);
    }
  }

  return (
    <div>
      <div className='flex pt-4 space-x-2 items-center justify-between'>
        {userProfileList[following.nickname] ? (
          <Link href={`/user/feed/${following.nickname}`} style={{ width: '60px', height: '60px' }}>
            <Image
              src={userProfileList[following.nickname]}
              alt='사용자 프로필 이미지'
              width={60}
              height={60}
              className='rounded-full bg-cover'
              priority
              style={{ width: '60px', height: '60px', boxShadow: 'var(--box-shadow-card)' }}
            />
          </Link>
        ) : (
          <Skeleton width={60} height={60} circle />
        )}

        <div className='flex flex-col'>
          {following.nickname ? (
            <Link href={`/user/feed/${following.nickname}`} className='font-bold'>
              {following.nickname}
            </Link>
          ) : (
            <Skeleton width={50} />
          )}
          {following.introduction ? <div className={`w-80 introduction`}>{following.introduction}</div> : <div className={`w-80 introduction`}></div>}
        </div>

        {following.isFollowed ? (
          <AppButton text='언팔로우' bgColor='thin' size='small' handleClick={(e) => handleFollowDelete(e, following.nickname)} />
        ) : (
          <AppButton text='팔로우 하기' size='small' bgColor='main' handleClick={(e) => handleFollowUpdate(e, following.nickname)} />
        )}
      </div>
    </div>
  );
};
