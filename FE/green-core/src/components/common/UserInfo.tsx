import React from 'react';
import Skeleton from 'react-loading-skeleton';
import styles from './UserInfo.module.scss';

export default function UserInfo({ user }) {
  return (
    <div className={`${styles.helpTip} flex `}>
      <div id='userInfo'>
        {user.profileImagePath ? (
          <img className='mb-3' src={user.profileImagePath} alt='로고' width='30' height='30'></img>
        ) : (
          <Skeleton width={30} height={30} />
        )}
        <span>{user.nickname || <Skeleton />}</span>
        <br />
        <span>{user.introduction || <Skeleton />}</span>
        <br />
        <span>팔로워 수 : {user.followerCount || <Skeleton />}</span>
        <br />
        <span>팔로잉 수 : {user.followingCount || <Skeleton />}</span>
        <br />
        <span>팔로잉 여부 : {user.isFollowed ? <i className='fa-solid fa-heart'></i> : 'false'}</span>
      </div>
      <img className='mb-3' src={user.profileImagePath} alt='로고' width='30' height='30'></img>
      <span>{user.nickname || <Skeleton />}</span>
    </div>
  );
}
