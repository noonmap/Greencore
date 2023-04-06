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
		router.push(`/user/feed/${searchUser.nickname}`);
	}
	return (
		<>
			<div key={searchUser.nickname} className={`${styles.container} p-5 flex items-center`} onClick={goProfile}>
				<div className="mr-5 overflow-hidden" style={{ borderRadius: '25px' }}>
					{searchUser.profileImagePath ? (
						<img
							src={userProfileImagePath}
							width={50}
							height={50}
							alt=""
							style={{ width: '50px', height: '50px', boxShadow: 'var(--box-shadow-card)' }}
						/>
					) : (
						<Skeleton width={50} height={50} circle />
					)}
				</div>
				<div>{searchUser.nickname || <Skeleton />} </div>
			</div>
		</>
	);
}
