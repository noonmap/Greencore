import React from 'react';
import Skeleton from 'react-loading-skeleton';
import { useRouter } from 'next/router';
import { SearchUserType } from '../core/user/userType';
import styles from '@/components/SearchUserListItem.module.scss';

export default function SearchUserListItem(props: { searchUser: SearchUserType }) {
  const searchUser = props.searchUser;
  const router = useRouter();

  function goProfile() {
    router.push(`user/feed/${searchUser.nickname}`);
  }
  return (
    <>
      <div key={searchUser.nickname} className={`${styles.container} p-5 flex items-center`} onClick={goProfile}>
        <div className='pr-5'>
          {searchUser.profileImagePath ? (
            <img src={searchUser.profileImagePath} width={50} height={50} alt='' />
          ) : (
            <Skeleton width={150} height={150} />
          )}
        </div>
        <div>{searchUser.nickname || <Skeleton />} </div>
      </div>
    </>
  );
}
