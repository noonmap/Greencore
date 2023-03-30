import UserBookmarkListItem from '@/components/UserBookmarkListItem';
import AppLayout from '@/layout/AppLayout';
import React, { useEffect, useState } from 'react';

type BookmarkType = {};

export default function Bookmark() {
  const [bookmarkList, setBookMarkList] = useState([
    {
      diarySetId: 1,
      imagePath: 'image1/jpg',
      bookmarkCount: 32,
      isBookmarked: true,
      diaryCount: 10,
      title: '제목1',
    },
    {
      diarySetId: 2,
      imagePath: 'image1/jpg',
      bookmarkCount: 32,
      isBookmarked: false,
      diaryCount: 10,
      title: '제목2',
    },
    {
      diarySetId: 3,
      imagePath: 'image1/jpg',
      bookmarkCount: 32,
      isBookmarked: false,
      diaryCount: 10,
      title: '제목3',
    },
  ]);

  useEffect(() => {
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
