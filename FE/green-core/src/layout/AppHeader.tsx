import React from 'react';
import Link from 'next/link';
import styles from './AppHeader.module.scss';

export default function AppHeader() {
  return (
    <div className={`flex space-x-4 items-center ${styles.headerWrap}`}>
      <Link href='/'>Home</Link>
      <Link href='/temp/post'>Post</Link>
      <Link href='/temp/temp'>Temp</Link>

      {/* 정아 */}
      <Link href='/user/signup'>회원가입</Link>
      <Link href='/user/login'>로그인</Link>

      {/* <button className='bg-white rounded-lg shadow-sm '>로그인</button> */}
      {/* <button className='bg-white rounded-lg shadow-sm'>회원가입</button> */}
    </div>
  );
}
