import React from 'react';
import styles from './AppLoading.module.scss';

export default function AppLoading() {
	return (
		<div className="flex justify-center items-center h-full">
			<div className={`${styles.lds_ripple}`}>
				<div></div>
				<div></div>
			</div>
		</div>
	);
}
