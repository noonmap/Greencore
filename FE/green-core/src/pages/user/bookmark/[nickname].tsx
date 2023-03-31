import UserBookmarkListItem from '@/components/UserBookmarkListItem';
import { getBookmarkedDiarySet } from '@/core/diarySet/diarySetAPI';
import { useAppDispatch, useAppSelector } from '@/core/hooks';
import { getAccessToken } from '@/core/user/userAPI';
import AppLayout from '@/layout/AppLayout';
import { getCookieToken } from '@/lib/cookies';
import { startOfYesterday } from 'date-fns';
import React, { useCallback, useEffect, useState } from 'react';
import { SET_IS_SEARCH_STATE } from '@/core/common/commonSlice';

type BookmarkType = {};

export default function Bookmark() {
  const dispatch = useAppDispatch();
  const [bookmarkList, setBookMarkList] = useState([]);

  // searchState 변경
  useEffect(() => {
    dispatch(SET_IS_SEARCH_STATE('default'));
  });

  const fetchBookmarkList = useCallback(async () => {
    const { data } = await getBookmarkedDiarySet('김씨', { page: 0, size: 2 });
    console.log(data);
  }, []);

  useEffect(() => {
    // if (getCookieToken()) dispatch(getAccessToken('DB'));
    // console.log(isAuthLoading);
    // if (isAuthLoading) {

    fetchBookmarkList();
    // }

    return () => {};
  }, []);

  return (
    <AppLayout>
      <div>
        <h1 className='main'>북마크</h1>

        {bookmarkList.length > 0 ? (
          <>
            {bookmarkList.map((bookmark) => (
              <UserBookmarkListItem key={bookmark.diarySetId} bookmark={bookmark} />
            ))}
          </>
        ) : null}
      </div>
    </AppLayout>
  );
}
