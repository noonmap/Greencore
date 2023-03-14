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
        <Link href='/user/signup'>회원가입</Link>
        <Link href='/user/login'>로그인</Link>
        <Link href='/user/password'>새로운 비밀번호</Link>

        <Link href='/user/feed/식집사입니다만'>내 피드</Link>
        <Link href='/user/settings'>비밀번호 확인</Link>
        <Link href='/user/settings/password'>비밀번호 수정</Link>
        <Link href='/user/settings/nickname'>닉네임 수정</Link>
        <Link href='/user/settings/delete'>회원탈퇴</Link>
      </div>

      <div className='flex space-x-4'>
        <h2 className='font-bold'>승태</h2>
        <Link href='/alert'>알림</Link>
        <Link href='/feed'>피드</Link>
      </div>

      <div className='flex space-x-4'>
        <h2 className='font-bold'>형규</h2>
        <Link href='/diary'>일지</Link>
      </div>
    </div>
  );
}
