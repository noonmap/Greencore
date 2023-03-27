import React from 'react';
import styles from './AppMain.module.scss';

export default function AppMain({ children }) {
  return <div className={`${styles.container} overflow-auto flex-1 mx-auto xl:ml-56 ml-20`}>{children}</div>;
}
