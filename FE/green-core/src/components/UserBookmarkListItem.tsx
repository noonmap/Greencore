import React from 'react';
import Image from 'next/image';
import { createBookmark, deleteBookmark } from '@/core/diarySet/diarySetAPI';

export default function UserBookmarkListItem({ bookmark }) {
  async function handleBookmarkCreate() {
    try {
      console.log('handleBookmarkCreate');
      const { data } = await createBookmark(bookmark.diarysetId);
      console.log(data);
    } catch (error) {}
  }

  async function handleBookmarkDelete() {
    try {
      console.log('handleBookmarkDelete');
      const { data } = await deleteBookmark(bookmark.diarysetId);
      console.log(data);
    } catch (error) {}
  }

  return (
    <>
      {/* {JSON.stringify(bookmark)} */}
      <div className='flex'>
        <Image src={bookmark.imagePath} width={100} height={100} alt='' />
        <div>{bookmark.title}</div>
        <div className='flex items-center cursor-pointer'>
          {bookmark.isBookmarked ? (
            <span className='material-symbols-outlined md-main fill-main mr-0.5' onClick={handleBookmarkDelete}>
              bookmark
            </span>
          ) : (
            <span className='material-symbols-outlined md-main mr-0.5' onClick={handleBookmarkCreate}>
              bookmark
            </span>
          )}
          {bookmark.bookmarkCount}
          {bookmark.diaryCount}
        </div>
      </div>
    </>
  );
}
