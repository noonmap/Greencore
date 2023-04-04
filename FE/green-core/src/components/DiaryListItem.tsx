import React, { useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import Skeleton from 'react-loading-skeleton';
import styles from './DiaryListItem.module.scss';

export default function DiaryListItem({ diary, title, isLast }: any) {
  const [isLoadingErrorAtimagePath, setIsLoadingErrorAtimagePath] = useState<boolean>(false);

  const handleImageLoadAtimagePath = () => {
    setIsLoadingErrorAtimagePath(false);
  };

  const handleImageErrorAtimagePath = () => {
    setIsLoadingErrorAtimagePath(true);
  };
  console.log(diary?.imagePath);
  return (
    <ul className=''>
      <li>
        {diary ? (
          <Link href={`/diary/${diary.diaryId}`} className='hover:underline'>
            <div className='relative'>
              {/* 바디 */}
              <div className='w-full overflow-hidden' style={{ borderRadius: '30px' }}>
                {isLoadingErrorAtimagePath && <Skeleton height={300} />}
                <Image
                  className='mb-3 w-full h-full'
                  src={diary.imagePath}
                  alt='로고'
                  width={100}
                  height={100}
                  onLoad={() => handleImageLoadAtimagePath()}
                  onError={() => handleImageErrorAtimagePath()}
                  style={{ display: isLoadingErrorAtimagePath ? 'none' : 'block' }}
                />
                {/* {diary.imagePath ? (
                  <img src={diary.imagePath} alt='image' style={{ width: '100%', height: 'auto', objectFit: 'cover' }} />
                ) : (
                  <Skeleton width={300} height={300} />
                )} */}
              </div>

              {/* 그라데이션 */}
              <div className={`${styles.gradation}`} style={{ display: isLoadingErrorAtimagePath ? 'none' : 'block' }}>
                <div className={`p-5 flex justify-between h-full`}>
                  <div className={`p-3 flex flex-col text-3xl text-white font-bold justify-end h-full `}>
                    <p>{title || <Skeleton />}</p>
                    <p>day {diary.growingDay}</p>
                  </div>
                  <div className={`p-3 flex text-lg text-white font-bold justify-end items-end h-full `}>
                    <span className={`px-1 material-symbols-outlined ${styles.materialSymbolsOutlined}`} style={{ color: 'crimson' }}>
                      favorite
                    </span>
                    <span className='pr-3 '>{diary.likeCount}</span>
                    <span className={`px-1 material-symbols-outlined `}>chat</span>
                    <span className=''>{diary.commentCount}</span>
                  </div>
                </div>
              </div>
            </div>
          </Link>
        ) : (
          <Skeleton width={150} height={150} />
        )}
      </li>
      <li>
        <div className='h-24 flex justify-center'>
          {isLast ? <></> : <Image src='/images/diaryLine.png' alt='사용자 식물' width={54} height={96} />}
        </div>
      </li>
    </ul>
  );
}
