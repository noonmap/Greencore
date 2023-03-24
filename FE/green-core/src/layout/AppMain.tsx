import React from 'react';
import styles from './AppMain.module.scss';

export default function AppMain({ children }) {
  return <div className={`${styles.container} overflow-auto flex-1 xl:ml-52 ml-20 px-7 py-5 `}>{children}</div>;
}
