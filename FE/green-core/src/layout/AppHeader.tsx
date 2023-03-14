import React from 'react';
import Link from 'next/link';
import styles from './AppHeader.module.scss';

export default function AppHeader() {
  return (
    <div className={`flex space-x-4 items-center ${styles.headerWrap}`}>
      <Link href='/'>Home</Link>
      <Link href='/temp/post'>Post</Link>
      <Link href='/temp'>Temp</Link>

      {/* 정아 */}
      <Link href='/user/signup'>회원가입</Link>
      <Link href='/user/login'>로그인</Link>
      <Link href='/user/password'>새로운 비밀번호</Link>
      <Link href='/myfeed'>내 피드</Link>

      {/* 승태 */}
      <Link href='/alert'>알림</Link>
      <Link href='/feed'>피드</Link>

      {/* 형규 */}
      <Link href='/diary'>일지</Link>
    </div>
  );
}
