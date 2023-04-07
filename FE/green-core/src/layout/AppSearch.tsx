import React, { useEffect } from 'react';
// import AppHeader2 from './AppHeader2';
import DefaultSearch from '../components/DefaultSearch';
import styles from './AppSearch.module.scss';
import { useAppSelector } from '@/core/hooks';

export default function AppSearch() {
	const searchState = useAppSelector((state) => state.common.searchState || 'home');

	return (
		<div className={`border border-l-1 border-r-1 border-t-0 border-b-0 border-gray-100 lg:block hidden overflow-auto lg:w-1/3 px-7 py-5`}>
			<>
				<DefaultSearch></DefaultSearch>
			</>
		</div>
	);
}
