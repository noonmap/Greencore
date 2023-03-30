import { createBookmark, deleteBookmark } from '@/core/diarySet/diarySetAPI';
import Image from 'next/image';
import React from 'react';

export default function UserBookmarkListItem({ bookmark }) {
  async function handleBookmarkCreate() {
    try {
      const { data } = await createBookmark(bookmark.diarysetId);
    } catch (error) {}
  }

  async function handleBookmarkDelete() {
    try {
      const { data } = await deleteBookmark(bookmark.diarysetId);
    } catch (error) {}
  }

  return (
    <>
      {/* {JSON.stringify(bookmark)} */}
      <div className='flex'>
        <Image src={'/images/noProfile.png'} width={100} height={100} alt='' />
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
