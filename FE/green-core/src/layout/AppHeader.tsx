import React from 'react';
import Link from 'next/link';

export default function AppHeader() {
  return (
    <div className='flex space-x-4 items-center'>
      <Link href='/'>Home</Link>
      <Link href='/post'>Post(Redux & React Skeleton 사용하기)</Link>
      <Link href='/temp'>Temp(Next API Route 로 데이터 가져오기)</Link>

      <button className='bg-white p-2 rounded-lg shadow-sm font-medium'>로그인</button>
    </div>
  );
}
