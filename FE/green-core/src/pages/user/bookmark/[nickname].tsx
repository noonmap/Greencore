import UserBookmarkListItem from '@/components/UserBookmarkListItem';
import { getBookmarkedDiarySet } from '@/core/diarySet/diarySetAPI';
import { useAppDispatch, useAppSelector } from '@/core/hooks';
import AppLayout from '@/layout/AppLayout';
import React, { useCallback, useEffect, useState } from 'react';
import { SET_IS_SEARCH_STATE } from '@/core/common/commonSlice';
import styles from '@/styles/user/bookmark.module.scss';

type BookmarkType = {
	bookmarkCount: number;
	diaryCount: number;
	diarySetId: number;
	imagePath: string;
	isBookmarked: boolean;
	title: string;
};

export default function Bookmark() {
	const dispatch = useAppDispatch();
	const [bookmarkList, setBookMarkList] = useState<Array<BookmarkType>>([]);
	const [totalCount, setTotalCount] = useState<number>(0);
	const nickname = useAppSelector((state) => state.common.userInfo?.nickname);

	// searchState 변경
	useEffect(() => {
		dispatch(SET_IS_SEARCH_STATE('default'));
	});

	useEffect(() => {
		fetchBookmarkList();
		return () => {};
	}, []);

	const fetchBookmarkList = useCallback(async () => {
		try {
			const payload = { page: 0, size: 5 };
			const { data } = await getBookmarkedDiarySet(nickname, payload);
			const content = data.content;
			const totalElements = data.totalElements;
			console.log(content);

			setBookMarkList(content);
			setTotalCount(totalElements);
		} catch (error) {}
	}, [nickname]);

	return (
		<AppLayout>
			<div className="space-y-2 px-4 py-4">
				<h1 className={`${styles.title} main py-1 mb-10`}>북마크</h1>

				{bookmarkList.length > 0 ? (
					<div className="flex flex-wrap mx-7">
						{bookmarkList.map((bookmark) => (
							<UserBookmarkListItem key={bookmark.diarySetId} bookmark={bookmark} fetchBookmarkList={fetchBookmarkList} />
						))}
					</div>
				) : (
					<div className="text-center flex items-center justify-center space-x-2 pt-40">
						<div className="font-italic">현재 조회되는 북마크가 없습니다</div>
						<img src="/images/emoji/face_with_rolling_eyes.png" width="24" height="24" />
					</div>
				)}
			</div>
		</AppLayout>
	);
}
