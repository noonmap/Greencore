import React from 'react';
import Link from 'next/link';
import Skeleton from 'react-loading-skeleton';

export default function DiaryListItem({ diary }: any) {
  return (
    <ul className='mb-5'>
      <li>
        {diary ? (
          <Link href={`/diary/${diary.diaryId}`} className='hover:underline'>
            <img src={diary.imagePath} alt='image' style={{ width: '150px', height: '150px', objectFit: 'cover' }} />
          </Link>
        ) : (
          <Skeleton width={150} height={150} />
        )}
      </li>
      <li>
        {diary ? (
          <div>
            {diary.tags.map((tag: string, i: number) => {
              return (
                <span key={i} style={{ marginInline: '1px' }}>
                  #{tag}
                </span>
              );
            })}
          </div>
        ) : (
          <Skeleton />
        )}
      </li>
      <li>{diary ? diary.opservationDate : <Skeleton />}</li>
      <li>{diary ? diary.content : <Skeleton />}</li>
      <li>{diary ? diary.commentCount : <Skeleton />}</li>
    </ul>
  );
}
