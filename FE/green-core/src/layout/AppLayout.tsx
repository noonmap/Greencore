import React from 'react';
import AppHeader from './AppHeader';
import AppMain from './AppMain';
import AppSearch from './AppSearch';
import { useAppSelector } from '@/core/hooks';
import styles from './AppLayout.module.scss';

type AppLayoutProps = {
  children: React.ReactNode;
  home?: boolean;
};

export default function AppLayout({ children, home }: AppLayoutProps) {
  const isAuthenticated = useAppSelector((state) => state.user.isAuthenticated);

  // 로그인 시
  if (isAuthenticated) {
    return (
      <>
        <AppHeader />
        <main>{home ? <>{children}</> : <>{children}</>}</main>
      </>
    );
  }

  // 비 로그인 시
  return (
    <>
      <div className=' flex md:gap-5'>
        <AppHeader />

        <div className='flex-1 flex h-screen'>
          <AppMain children={children} />
          <AppSearch />
        </div>
      </div>
    </>
  );
}
