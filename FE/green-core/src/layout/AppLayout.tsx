import React, { useEffect } from 'react';
import AppHeader from './AppHeader';
import AppMain from './AppMain';
import AppSearch from './AppSearch';
import { useAppSelector } from '@/core/hooks';
import styles from './AppLayout.module.scss';
import Head from 'next/head';
import { getCookieToken } from '@/lib/cookies';

type AppLayoutProps = {
	children: React.ReactNode;
	home?: boolean;
};

export default function AppLayout({ children, home }: AppLayoutProps) {
	const searchState = useAppSelector((state) => state.common.searchState || 'home');

	// 로그인 시
	if (getCookieToken()) {
		return (
			<>
				<Head>
					<title>GreenCore - 식집사를 위한 힐링 SNS 플랫폼</title>
					<meta name="description" content="부울경 E101 일해라일조" />
					<meta name="viewport" content="width=device-width, initial-scale=1" />
					<link rel="icon" href="/favicon.ico" />
				</Head>

				<div className="flex md:gap-5 mx-auto 2xl:mx-72 md:mx-40">
					<AppHeader />
					<div className={`flex-1 flex h-screen`}>
						<AppMain children={children} />
						{searchState === 'default' ? <AppSearch /> : <></>}
					</div>
				</div>
			</>
		);
	}

	// 비 로그인 시
	return (
		<>
			<Head>
				<title>GreenCore - 식집사를 위한 힐링 SNS 플랫폼</title>
				<meta name="description" content="부울경 E101 일해라일조" />
				<meta name="viewport" content="width=device-width, initial-scale=1" />
				<link rel="icon" href="/favicon.ico" />
			</Head>

			<div className="flex md:gap-5 mx-auto 2xl:mx-72 md:mx-40">
				<AppHeader />

				<div className="flex-1 flex h-screen">
					<AppMain children={children} />
					{searchState === 'default' ? <AppSearch /> : <></>}
				</div>
			</div>
		</>
	);
}
