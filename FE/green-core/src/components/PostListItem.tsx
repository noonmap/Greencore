import React from 'react';
import Link from 'next/link';
import Skeleton from 'react-loading-skeleton';

export default function PostListItem({ id, userId, title }: any) {
  return (
    <ul className='mb-5'>
      <li>{id || <Skeleton />}</li>
      <li>{userId || <Skeleton />}</li>
      <Link href={`/temp/post/${id}`} className='hover:underline'>
        {title || <Skeleton />}
      </Link>
    </ul>
  );
}
