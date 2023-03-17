import React from 'react';
import Link from 'next/link';
import Skeleton from 'react-loading-skeleton';
import { SearchUserType } from '../core/user/userType';
import styles from '@/styles/feed.module.scss';

export default function SearchUserListItem(props: { searchUser: SearchUserType }) {
  const searchUser = props.searchUser;

  return (
    <>
      <div key={searchUser.nickname} className={`${styles.feedContainer} bg-green-300`}>
        <div>{searchUser.nickname || <Skeleton />} </div>
        <div>
          {searchUser.profileImagePath ? (
            <Link href={`/profile/${searchUser.nickname}`}>
              <img src={searchUser.profileImagePath} width={150} height={150} alt='' />
            </Link>
          ) : (
            <Skeleton width={150} height={150} />
          )}
        </div>
      </div>
    </>
  );
}
