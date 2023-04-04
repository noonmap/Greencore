import React, { useState, useEffect } from 'react';
import Skeleton from 'react-loading-skeleton';
import { useRouter } from 'next/router';
import { SearchUserType } from '../core/user/userType';
import { getStorage, ref, getDownloadURL } from 'firebase/storage';
import styles from '@/components/SearchUserListItem.module.scss';

export default function SearchUserListItem(props: { searchUser: SearchUserType }) {
  const searchUser = props.searchUser;
  const storage = getStorage();
  const router = useRouter();

  // 파이어베이스 이미지 불러오기
  const [userProfileImagePath, setUserProfileImagePath] = useState<string>('');

  useEffect(() => {
    getUserProfile(searchUser.nickname);
  }, []);

  function getUserProfile(nickname: string) {
    const profileRef = ref(storage, `${nickname}/profileImage`);

    getDownloadURL(profileRef)
      .then((downloadURL) => {
        setUserProfileImagePath(downloadURL);
      })
      .catch((error) => {
        console.error(error);
      });
  }

  function goProfile() {
    router.push(`user/feed/${searchUser.nickname}`);
  }
  return (
    <>
      <div key={searchUser.nickname} className={`${styles.container} p-5 flex items-center`} onClick={goProfile}>
        <div className='pr-5'>
          {searchUser.profileImagePath ? <img src={userProfileImagePath} width={50} height={50} alt='' /> : <Skeleton width={150} height={150} />}
        </div>
        <div>{searchUser.nickname || <Skeleton />} </div>
      </div>
    </>
  );
}
