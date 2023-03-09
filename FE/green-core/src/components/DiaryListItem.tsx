import React from 'react';
import Link from 'next/link';
import Skeleton from 'react-loading-skeleton';

export default function DiaryListItem({ id, title, url, thumbnailUrl }: any) {
  return (
    <ul className='mb-5'>
      <Link href={`/diary/${id}`} className='hover:underline'>
        {/* <li>{<img src={url} alt="img" /> || <Skeleton />}</li> */}
        <li>{<img src={thumbnailUrl} alt='thumbnail' /> || <Skeleton />}</li>
      </Link>
      <li>{id || <Skeleton />}</li>
      <li>{title || <Skeleton />}</li>
    </ul>
  );
}
