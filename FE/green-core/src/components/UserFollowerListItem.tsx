import { deleteFollow, updateFollow } from '@/core/follow/followAPI';
import Image from 'next/image';
import Link from 'next/link';
import React from 'react';
import Skeleton from 'react-loading-skeleton';
import AppButton from './button/AppButton';

export default function UserFollowerListItem({ follower, userProfileList }) {
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

  async function handleFollowerDelete() {}

  return (
    <div>
      <div key={follower.nickname} className='flex pt-4 space-x-2 items-center justify-between'>
        {userProfileList[follower.nickname] ? (
          <Link href={`/user/feed/${follower.nickname}`}>
            <Image
              src={userProfileList[follower.nickname]}
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
          {follower.nickname ? <Link href={`/user/feed/${follower.nickname}`}>{follower.nickname}</Link> : <Skeleton width={50} />}
          {follower.introduction ? <div className='w-80 introduction'>{follower.introduction}</div> : <Skeleton width={150} />}
        </div>

        <div className='flex space-x-2 items-center'>
          {follower.isFollowed ? (
            <AppButton
              text='언팔로우'
              className='hover:bg-red-100'
              bgColor='thin'
              size='small'
              handleClick={(e) => handleFollowDelete(e, follower.nickname)}
            />
          ) : (
            <AppButton text='팔로우 하기' size='small' handleClick={(e) => handleFollowUpdate(e, follower.nickname)} />
          )}

          <span className='material-symbols-outlined cursor-pointer close' onClick={handleFollowerDelete}>
            close
          </span>
        </div>
      </div>
    </div>
  );
}
