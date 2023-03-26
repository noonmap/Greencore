import React from 'react';
import Link from 'next/link';
import styles from './AppHeader.module.scss';

export default function AppHeader() {
  return (
    <div className={`items-center ${styles.headerWrap}`}>
      <div className='flex space-x-4'>
        <Link href='/'>Home</Link>
        <Link href='/temp/post'>Post</Link>
        <Link href='/temp'>Temp</Link>
        <Link href='/user/feed'>redux-persist test</Link>
      </div>

      <div className='flex space-x-4'>
        <h2 className='font-bold'>정아</h2>
        <Link href='/user/following/식집사입니다만'>팔로우 목록</Link>
        <Link href='/user/settings/nickname'>닉네임 수정</Link>
      </div>

      <div className='flex space-x-4'>
        <h2 className='font-bold'>승태</h2>
        <Link href='/alert'>알림</Link>
        <Link href='/feed'>피드</Link>
        <Link href='/plant/docs'>식물 검색(테스트)</Link>
      </div>

      <div className='flex space-x-4'>
        <h2 className='font-bold'>형규</h2>
        <Link href='/diary'>일지</Link>
        <Link href='/post/0'>포스트</Link>
        <Link href='/schedule'>스케줄</Link>
      </div>
    </div>
  );
}
