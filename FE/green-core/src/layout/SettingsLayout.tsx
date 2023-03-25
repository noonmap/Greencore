import Link from 'next/link';
import { useRouter } from 'next/router';
import React, { useEffect, useState } from 'react';
import AppLayout from './AppLayout';

export default function FllowLayout({ children }) {
  const router = useRouter();

  const [isDelete, setIsDelete] = useState(false);

  useEffect(() => {
    if (!router.isReady) return;
    if (router.pathname.includes('delete')) setIsDelete(true);
    return () => {};
  }, []);

  return (
    <AppLayout>
      <div className='text-sm font-medium text-center text-gray-500 border-b border-gray-200 dark:text-gray-400 dark:border-gray-700'>
        <ul className='flex flex-wrap -mb-px'>
          <li className='mr-2'>
            {!isDelete ? (
              <Link
                href={`/user/settings/password`}
                className='inline-block p-4 text-blue-600 border-b-2 border-blue-600 rounded-t-lg active dark:text-blue-500 dark:border-blue-500'
                aria-current='page'>
                회원정보 수정
              </Link>
            ) : (
              <Link
                href={`/user/settings/delete`}
                className='inline-block p-4 border-b-2 border-transparent rounded-t-lg hover:text-gray-600 hover:border-gray-300 dark:hover:text-gray-300'>
                회원탈퇴
              </Link>
            )}
          </li>
          <li className='mr-2'>
            {!isDelete ? (
              <Link
                href={`/user/settings/password`}
                className='inline-block p-4 border-b-2 border-transparent rounded-t-lg hover:text-gray-600 hover:border-gray-300 dark:hover:text-gray-300'>
                회원정보 수정
              </Link>
            ) : (
              <Link
                href={`/user/settings/delete`}
                className='inline-block p-4 text-blue-600 border-b-2 border-blue-600 rounded-t-lg active dark:text-blue-500 dark:border-blue-500'
                aria-current='page'>
                회원탈퇴
              </Link>
            )}
          </li>
        </ul>
      </div>

      {children}
    </AppLayout>
  );
}
