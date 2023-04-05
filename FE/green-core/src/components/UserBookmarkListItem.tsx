import React from 'react';
import Image from 'next/image';
import { createBookmark, deleteBookmark } from '@/core/diarySet/diarySetAPI';

export default function UserBookmarkListItem({ bookmark, fetchBookmarkList }) {
  async function handleBookmarkCreate() {
    try {
      const { data } = await createBookmark(bookmark.diarySetId);
      await fetchBookmarkList();
      console.log(data);
    } catch (error) {}
  }

  async function handleBookmarkDelete() {
    try {
      const { data } = await deleteBookmark(bookmark.diarySetId);
      await fetchBookmarkList();
      console.log(data);
    } catch (error) {}
  }

  return (
    <>
      <div className='flex'>
        <Image priority src={bookmark.imagePath} width={100} height={100} alt='' />
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
