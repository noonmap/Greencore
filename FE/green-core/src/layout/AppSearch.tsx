import React, { useEffect } from 'react';
// import AppHeader2 from './AppHeader2';
import HomeSearch from '../components/HomeSearch';
import styles from './AppSearch.module.scss';
import { useAppSelector } from '@/core/hooks';

export default function AppSearch() {
  const searchState = useAppSelector((state) => state.common.searchState || 'home');

  return (
    <div className={`${styles.container} lg:block hidden overflow-auto lg:w-1/3 px-7 py-5`}>
      <>
        <HomeSearch></HomeSearch>
      </>
    </div>
  );
}
