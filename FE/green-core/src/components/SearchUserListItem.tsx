import React from 'react';
import Link from 'next/link';
import Skeleton from 'react-loading-skeleton';
import { searchUserType } from '../core/user/userType';
import styles from '@/styles/feed.module.scss';

export default function SearchUserListItem(props: { searchUser: searchUserType }) {
  const searchUser = props.searchUser;

  return (
    <div key={searchUser.nickname} className={`${styles.feedContainer} bg-green-300`}>
      <div>{searchUser.nickname || <Skeleton />} </div>
      <div>
        <Link href={`/profile/${searchUser.nickname}`}>
          {searchUser.profileImage ? <img src={searchUser.profileImage} width={150} height={150} alt='' /> : <Skeleton width={150} height={150} />}
        </Link>
      </div>
    </div>
  );
}
