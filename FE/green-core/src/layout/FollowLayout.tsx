import Link from 'next/link';
import { useRouter } from 'next/router';
import React, { useEffect, useState } from 'react';
import AppLayout from './AppLayout';

export default function FllowLayout({ children }) {
  const router = useRouter();
  const { nickname } = router.query;

  const [isFollowing, setIsFollowing] = useState(false);

  useEffect(() => {
    if (!router.isReady) return;
    if (router.pathname.includes('following')) setIsFollowing(true);
    return () => {};
  }, [nickname]);

  return (
    <AppLayout>
      <div className='text-sm font-medium text-center text-gray-500 border-b border-gray-200 dark:text-gray-400 dark:border-gray-700'>
        <ul className='flex flex-wrap -mb-px'>
          <li className='mr-2'>
            {isFollowing ? (
              <Link
                href={`/user/following/${nickname}`}
                className='inline-block p-4 text-blue-600 border-b-2 border-blue-600 rounded-t-lg active dark:text-blue-500 dark:border-blue-500'
                aria-current='page'>
                팔로잉
              </Link>
            ) : (
              <Link
                href={`/user/following/${nickname}`}
                className='inline-block p-4 border-b-2 border-transparent rounded-t-lg hover:text-gray-600 hover:border-gray-300 dark:hover:text-gray-300'>
                팔로잉
              </Link>
            )}
          </li>
          <li className='mr-2'>
            {isFollowing ? (
              <Link
                href={`/user/follower/${nickname}`}
                className='inline-block p-4 border-b-2 border-transparent rounded-t-lg hover:text-gray-600 hover:border-gray-300 dark:hover:text-gray-300'>
                팔로워
              </Link>
            ) : (
              <Link
                href={`/user/follower/${nickname}`}
                className='inline-block p-4 text-blue-600 border-b-2 border-blue-600 rounded-t-lg active dark:text-blue-500 dark:border-blue-500'
                aria-current='page'>
                팔로워
              </Link>
            )}
          </li>
        </ul>
      </div>

      {children}
    </AppLayout>
  );
}
