import React, { useCallback, useEffect, useState } from 'react';
import { useAppDispatch, useAppSelector } from '@/core/hooks';
import { getStorage, ref, uploadBytesResumable, getDownloadURL } from 'firebase/storage';
import { useRouter } from 'next/router';
import { useForm } from 'react-hook-form';
import Image from 'next/image';
import Link from 'next/link';

import Toastify from 'toastify-js';
import message from '@/assets/message.json';
import toastifyCSS from '@/assets/toastify.json';
import Skeleton from 'react-loading-skeleton';

import { deleteFollow, updateFollow } from '@/core/follow/followAPI';
import { getProfile } from '@/core/user/userAPI';
import AppLoading from './common/AppLoading';

import styles from './UserFeedProfile.module.scss';
import AppButton from './button/AppButton';
import UserProfileUpdateModal from '@/components/modal/UserProfileUpdateModal';
import { createAlert } from '@/core/alert/alertAPI';
import { getTodayDate } from '@/lib/utils';

type ProfileType = {
	followerCount: number;
	followingCount: number;
	introduction: string;
	isFollowed: boolean;
	nickname: string;
	profileImagePath: string;
};

type StateType = {
	uploadProfileImage: File;
};

const initialState: StateType = {
	uploadProfileImage: null
};

export default function UserFeedProfile({ nickname }) {
	const dispatch = useAppDispatch();
	const router = useRouter();
	const storage = getStorage();

	const myNickname = useAppSelector((state) => state.common.userInfo?.nickname);
	const isSameUser = useAppSelector((state) => state.user.isSameUser);

	const { register, getValues, watch } = useForm<StateType>({ defaultValues: initialState });
	const [uploadProfileImage] = getValues(['uploadProfileImage']);

	const [isOpenUserProfileUpdateModal, setIsOpenUserProfileUpdateModal] = useState<boolean>(false);
	const [userProfile, setUserProfile] = useState<ProfileType>(null);
	const [userProfileImagePath, setUserProfileImagePath] = useState<string>(null);

	useEffect(() => {
		watch();
	}, []);

	useEffect(() => {
		if (!router.isReady) return;
		if (!router.query.nickname) return;

		fetchUserProfile();
	}, [nickname, uploadProfileImage]);

	useEffect(() => {
		handleProfileImageUpdate();
	}, [uploadProfileImage]);

	/** storage 에서 유저 프로필 이미지 가져오는 함수 */
	const fetchUserProfile = useCallback(async () => {
		try {
			const { data } = await getProfile(nickname);
			setUserProfile(data);

			if (nickname) {
				const profileRef = ref(storage, `${nickname}/profileImage`);

				getDownloadURL(profileRef)
					.then((downloadURL) => {
						setUserProfileImagePath(downloadURL);
					})
					.catch((error) => {
						switch (error.code) {
							case 'storage/object-not-found':
								setUserProfileImagePath(null);
								break;
							case 'storage/unauthorized':
								break;
							case 'storage/canceled':
								break;
							case 'storage/unknown':
								break;
						}
					});
			}
		} catch (error) {
			alert('프로필 에러가 납니다');
		}
	}, [nickname]);

	/** 이미지 수정 누르면 파일 선택 창 뜨는 함수 */
	function handleImageExploerOpen() {
		const profileImageInput: HTMLElement = document.querySelector(`.profileImageInput`);
		profileImageInput.click();
	}

	/** 프로필 이미지 수정하는 함수 */
	function handleProfileImageUpdate() {
		if (!uploadProfileImage) return;

		const profileRef = ref(storage, `${myNickname}/profileImage`);
		const uploadTask = uploadBytesResumable(profileRef, uploadProfileImage[0]);

		uploadTask.on(
			'state_changed',
			(snapshot) => {
				const progress = (snapshot.bytesTransferred / snapshot.totalBytes) * 100;

				switch (snapshot.state) {
					case 'paused':
						console.log('Upload is paused');
						break;
					case 'running':
						console.log('Upload is running');
						break;
				}
			},
			(error) => {
				Toastify({
					text: message.UpdateProfileImageFail,
					duration: message.MessageDuration,
					position: 'center',
					stopOnFocus: true,
					style: toastifyCSS.fail
				}).showToast();
				console.error(error);
			},
			() => {
				getDownloadURL(uploadTask.snapshot.ref).then((downloadURL) => {
					setUserProfileImagePath(downloadURL);
					router.reload();
				});
			}
		);
	}

	/** 팔로우하기 함수 */
	async function handleFollowUpdate() {
		const { data } = await updateFollow(nickname);

		if (data) {
			const payload = {
				nickname,
				mentionNickname: myNickname,
				type: 'ALERT_FOLLOW',
				urlPath: `/user/feed/${myNickname}`,
				createdAt: getTodayDate(),
				isRead: false
			};
			dispatch(createAlert(payload));
		}

		await fetchUserProfile();
	}

	/** 언팔로우 함수 */
	async function handleFollowDelete() {
		const { data } = await deleteFollow(nickname);
		await fetchUserProfile();
	}

	return (
		<>
			<UserProfileUpdateModal
				isOpen={isOpenUserProfileUpdateModal}
				userProfile={userProfile}
				handleModalClose={() => setIsOpenUserProfileUpdateModal(false)}
			/>

			<div className={`mx-5 ${styles.container}`}>
				<div className={`${styles.profile} mx-3 pb-3`}>
					<div className="flex items-center">
						{/* 프로필 이미지 라인 */}
						<div>
							<input type="file" accept="image/*" hidden className="profileImageInput " {...register('uploadProfileImage')} />
							{userProfile ? (
								<div onClick={handleImageExploerOpen} className="rounded-full cursor-pointer" style={{ width: '105px', height: '100px' }}>
									{userProfileImagePath ? (
										<Image
											src={userProfileImagePath}
											alt="사용자 프로필 이미지"
											className={styles.image}
											width={100}
											height={100}
											onClick={handleProfileImageUpdate}
											priority
										/>
									) : (
										<Skeleton width={100} height={100} circle />
									)}
								</div>
							) : (
								<Skeleton width={100} height={100} circle />
							)}
						</div>

						<div className="flex flex-col">
							<div className="flex w-full justify-between items-center">
								{/* 닉네임 & 한 줄 자기소개 */}
								<div className={`mx-3`}>
									{userProfile ? (
										<>
											<div className="flex items-center space-x-1 ">
												<div className={`${styles.nickname} `}>{userProfile?.nickname}</div>
												{isSameUser ? (
													<span
														className="material-symbols-outlined titleLight cursor-pointer"
														style={{ fontSize: '1.2rem' }}
														onClick={() => setIsOpenUserProfileUpdateModal(true)}>
														edit
													</span>
												) : null}
											</div>
										</>
									) : (
										<>
											<div className="flex items-center space-x-1">
												<Skeleton width={100} />
											</div>
										</>
									)}
								</div>
							</div>

							{userProfile ? (
								<div className={`mx-3 my-1 ${styles.introduction}`}>{userProfile?.introduction}</div>
							) : (
								<div className="mx-3">
									<Skeleton width={200} />
								</div>
							)}
						</div>
					</div>
				</div>

				<div className="flex items-center justify-around">
					{userProfile ? (
						isSameUser ? (
							<>
								<Link href={`/user/following/${nickname}`} className={`${styles.follow} ${styles.left} w-full text-center`}>
									팔로우 ({userProfile?.followingCount})
								</Link>
								<Link href={`/user/follower/${nickname}`} className={`${styles.follow} w-full text-center`}>
									팔로워 ({userProfile?.followerCount})
								</Link>
							</>
						) : (
							<>
								{userProfile?.isFollowed ? (
									<div className={`${styles.follow} ${styles.left} w-full text-center`} onClick={handleFollowDelete}>
										팔로우 중.. ({userProfile?.followingCount})
									</div>
								) : (
									<div className={`${styles.follow} ${styles.left} w-full text-center`} onClick={handleFollowUpdate}>
										팔로우 하기 ({userProfile?.followingCount})
									</div>
								)}
								<div className={`${styles.follow} w-full text-center`}>팔로워 ({userProfile?.followerCount})</div>
							</>
						)
					) : null}
				</div>
			</div>
		</>
	);
}
