import React, { useCallback, useEffect, useState } from 'react';
import AppLayout from '@/layout/AppLayout';
import { useRouter } from 'next/router';
import styles from '@/styles/user/feed.module.scss';
import UserFeedProfile from '@/components/UserFeedProfile';
import UserFeedPlant from '@/components/UserFeedPlant';
import UserFeedDiarySet from '@/components/UserFeedDiarySet';
import UserFeedPost from '@/components/UserFeedPost';
import { useAppDispatch, useAppSelector } from '@/core/hooks';
import { SET_IS_SAME_USER_FALSE, SET_IS_SAME_USER_TRUE } from '@/core/user/userSlice';
import { SET_IS_SEARCH_STATE } from '@/core/common/commonSlice';

export default function FeedDetail() {
	const dispatch = useAppDispatch();
	const router = useRouter();

	const myNickname = useAppSelector((state) => state.common.userInfo?.nickname);
	const [nickname, setNickname] = useState<string | string[]>('');

	useEffect(() => {
		if (!router.isReady) return;

		checkSameUser();
		setNickname(router.query?.nickname);
	}, [nickname, router]);

	// searchState 변경
	useEffect(() => {
		changeSearchState();
	}, []);

	/** url path의 유저와 현재 로그인 유저가 같은지 확인하는 함수 */
	const checkSameUser = useCallback(() => {
		if (myNickname == nickname) dispatch(SET_IS_SAME_USER_TRUE());
		else dispatch(SET_IS_SAME_USER_FALSE());
	}, [myNickname, nickname]);

	function changeSearchState() {
		dispatch(SET_IS_SEARCH_STATE('default'));
	}

	return (
		<AppLayout>
			<div className="space-y-2 px-4 py-4">
				{/* 타이틀 */}
				<div className={`${styles.title} main py-1`}>프로필</div>

				<div className={`overflow-x-hidden`}>
					{nickname ? (
						<div className={`space-y-5`}>
							{/* 프로필 라인 */}
							<UserFeedProfile nickname={nickname} />

							{/* 키우는 식물 라인 */}
							<UserFeedPlant nickname={nickname} />

							{/* 관찰일지 라인 */}
							<UserFeedDiarySet nickname={nickname} />

							{/* 포스트 라인 */}
							<UserFeedPost nickname={nickname} />
						</div>
					) : null}
				</div>
			</div>
		</AppLayout>
	);
}
