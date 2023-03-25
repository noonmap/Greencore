import React from 'react';
import AppHeader2 from './AppHeader2';
import styles from './AppSearch.module.scss';

export default function AppSearch() {
  return (
    <div className={`${styles.container} lg:block hidden overflow-auto lg:w-1/3 px-7 py-5`}>
      <AppHeader2></AppHeader2>
      AppSearch
    </div>
  );
}
