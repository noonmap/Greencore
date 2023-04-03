import { deleteFollow, updateFollow } from '@/core/follow/followAPI';
import Image from 'next/image';
import Link from 'next/link';
import React from 'react';
import Skeleton from 'react-loading-skeleton';
import AppButton from './button/AppButton';

export const UserFollowingListItem = ({ following, userProfileList }) => {
  /** 팔로우 하는 함수 */
  async function handleFollowUpdate(e, nickname) {
    try {
      const { data } = await updateFollow(nickname);
      console.log(data);
    } catch (error) {
      console.error(error);
    }
  }

  /** 언팔로우 함수 */
  async function handleFollowDelete(e, nickname) {
    try {
      const { data } = await deleteFollow(nickname);
      console.log(data);
    } catch (error) {
      console.error(error);
    }
  }

  return (
    <div>
      <div className='flex pt-4 space-x-2 items-center justify-between'>
        {userProfileList[following.nickname] ? (
          <Link href={`/user/feed/${following.nickname}`}>
            <Image
              src={userProfileList[following.nickname]}
              alt='사용자 프로필 이미지'
              width={60}
              height={60}
              className='rounded-full bg-cover'
              priority
            />
          </Link>
        ) : (
          <Skeleton width={60} height={60} circle />
        )}

        <div className='flex flex-col'>
          {following.nickname ? <Link href={`/user/feed/${following.nickname}`}>{following.nickname}</Link> : <Skeleton width={50} />}
          {following.introduction ? <div className='w-80 introduction'>{following.introduction}</div> : <Skeleton width={150} />}
        </div>

        {following.isFollowed ? (
          <AppButton
            text='언팔로우'
            className='hover:bg-red-100'
            bgColor='thin'
            size='small'
            handleClick={(e) => handleFollowDelete(e, following.nickname)}
          />
        ) : (
          <AppButton text='팔로우 하기' size='small' handleClick={(e) => handleFollowUpdate(e, following.nickname)} />
        )}
      </div>
    </div>
  );
};
