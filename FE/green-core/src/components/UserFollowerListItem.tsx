import { createAlert } from '@/core/alert/alertAPI';
import { deleteFollow, deleteFollower, updateFollow } from '@/core/follow/followAPI';
import { useAppDispatch, useAppSelector } from '@/core/hooks';
import { getTodayDate } from '@/lib/utils';
import Image from 'next/image';
import Link from 'next/link';
import { useRouter } from 'next/router';
import React from 'react';
import Skeleton from 'react-loading-skeleton';
import AppButton from './button/AppButton';

export default function UserFollowerListItem({ follower, userProfileList }) {
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
					isRead: false
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

	async function handleFollowerDelete(e, nickname) {
		try {
			const { data } = await deleteFollower(nickname);
			router.reload();
		} catch (error) {}
	}

	return (
		<div>
			<div key={follower.nickname} className="flex pt-4 space-x-2 items-center justify-between">
				{userProfileList[follower.nickname] ? (
					<Link href={`/user/feed/${follower.nickname}`} style={{ width: '60px', height: '60px' }}>
						<Image
							src={userProfileList[follower.nickname]}
							alt="사용자 프로필 이미지"
							width={60}
							height={60}
							className="rounded-full bg-cover "
							priority
							style={{ width: '60px', height: '60px', boxShadow: 'var(--box-shadow-card)' }}
						/>
					</Link>
				) : (
					<Skeleton width={60} height={60} circle />
				)}

				<div className="flex flex-col">
					{follower.nickname ? <Link href={`/user/feed/${follower.nickname}`}>{follower.nickname}</Link> : <Skeleton width={50} />}
					{follower.introduction ? <div className="w-80 introduction">{follower.introduction}</div> : <Skeleton width={150} />}
				</div>

				<div className="flex space-x-2 items-center">
					{follower.isFollowed ? (
						<AppButton text="언팔로우" bgColor="thin" size="small" handleClick={(e) => handleFollowDelete(e, follower.nickname)} />
					) : (
						<AppButton text="팔로우 하기" size="small" bgColor="main" handleClick={(e) => handleFollowUpdate(e, follower.nickname)} />
					)}

					<span className="material-symbols-outlined cursor-pointer close" onClick={(e) => handleFollowerDelete(e, follower.nickname)}>
						close
					</span>
				</div>
			</div>
		</div>
	);
}
