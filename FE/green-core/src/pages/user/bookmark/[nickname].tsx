import UserBookmarkListItem from '@/components/UserBookmarkListItem';
import { getBookmarkedDiarySet } from '@/core/diarySet/diarySetAPI';
import { useAppDispatch, useAppSelector } from '@/core/hooks';
import { getAccessToken } from '@/core/user/userAPI';
import AppLayout from '@/layout/AppLayout';
import { getCookieToken } from '@/lib/cookies';
import { startOfYesterday } from 'date-fns';
import React, { useCallback, useEffect, useState } from 'react';
import { SET_IS_SEARCH_STATE } from '@/core/common/commonSlice';
import styles from '@/styles/UserFeed.module.scss';

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

  const fetchBookmarkList = useCallback(async () => {
    const payload = { page: 0, size: 5 };
    const { content, totalElements } = await getBookmarkedDiarySet(nickname, payload);

    setBookMarkList(content);
    setTotalCount(totalElements);
    console.log(content, totalElements);
  }, [nickname]);

  useEffect(() => {
    fetchBookmarkList();
    return () => {};
  }, []);

  return (
    <AppLayout>
      <div>
        <h1 className={`title p-5`}>북마크</h1>

        {bookmarkList.length > 0 ? (
          <>
            {bookmarkList.map((bookmark) => (
              <UserBookmarkListItem key={bookmark.diarySetId} bookmark={bookmark} />
            ))}
          </>
        ) : (
          <div>북마크 리스트가 없습니다</div>
        )}
      </div>
    </AppLayout>
  );
}
