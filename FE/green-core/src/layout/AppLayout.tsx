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
  const searchState = useAppSelector((state) => state.common.searchState || 'home');

  // 로그인 시
  if (isAuthenticated) {
    return (
      <>
        <div className=' flex md:gap-5'>
          <AppHeader />
          <div className={`overflow-auto mx-auto xl:ml-56 ml-20 flex flex-1`}>
            <main>{home ? <>{children}</> : <>{children}</>}</main>

            {searchState === 'home' ? <AppSearch /> : <></>}
          </div>
        </div>
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
          {searchState === 'home' ? <AppSearch /> : <></>}
        </div>
      </div>
    </>
  );
}
