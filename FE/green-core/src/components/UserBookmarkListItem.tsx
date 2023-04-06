import React from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { createBookmark, deleteBookmark } from '@/core/diarySet/diarySetAPI';
import styles from '@/styles/user/bookmark.module.scss';

export default function UserBookmarkListItem({ bookmark, fetchBookmarkList }) {
  async function handleBookmarkCreate() {
    try {
      const { data } = await createBookmark(bookmark.diarySetId);
      await fetchBookmarkList();
    } catch (error) {}
  }

  async function handleBookmarkDelete() {
    try {
      const { data } = await deleteBookmark(bookmark.diarySetId);
      await fetchBookmarkList();
    } catch (error) {}
  }

  return (
    <>
      <Link className='flex flex-col mb-5' href={`/diaryset/list/${bookmark.diarySetId}`}>
        <Image priority src={bookmark.imagePath} width={150} height={150} alt='' className={`${styles.image}`} />
        <div className='relative'>
          <div className={`${styles.bookmarkTitle} absolute bottom-0`}>{bookmark.title}</div>
        </div>

        <div className='relative'>
          <div className={`${styles.bookmarkCount} absolute left-2 flex items-center cursor-pointer`}>
            {bookmark.isBookmarked ? (
              <span className={`material-symbols-outlined md-main fill-main mr-0.5 ${styles.bookmarkIcon}`} onClick={handleBookmarkDelete}>
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
      </Link>
    </>
  );
}
