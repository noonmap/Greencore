import React, { useEffect, useState } from 'react';
import AppLayout from './AppLayout';
import Link from 'next/link';
import { useRouter } from 'next/router';

export default function FeedLayout({ children }) {
	const router = useRouter();

	const [isRecommend, setIsRecommend] = useState(false);

	useEffect(() => {
		if (!router.isReady) return;

		if (router.pathname.includes('recommend')) setIsRecommend(true);
		else setIsRecommend(false);

		return () => {};
	}, []);

	return (
		<AppLayout>
			<div className="text-md font-medium text-center text-gray-500 border-b border-gray-200">
				<ul className="flex -mb-px">
					<li className="w-full">
						{isRecommend ? (
							<Link
								href={`/home/recommend`}
								className={`layoutActive layoutFunc w-full inline-block p-4 border-b-2 hover:bg-gray-100`}
								aria-current="page">
								추천 피드
							</Link>
						) : (
							<Link
								href={`/home/recommend`}
								className={`layoutFunc w-full inline-block p-4 border-b-2 border-transparent hover:bg-gray-100 hover:text-gray-600`}>
								추천 피드
							</Link>
						)}
					</li>
					<li className="w-full">
						{!isRecommend ? (
							<Link
								href={`/home/following`}
								className={`layoutActive layoutFunc w-full inline-block active p-4 border-b-2 hover:bg-gray-100`}
								aria-current="page">
								팔로잉 피드
							</Link>
						) : (
							<Link
								href={`/home/following`}
								className={`layoutFunc w-full inline-block p-4 border-b-2 border-transparent hover:bg-gray-100 hover:text-gray-600`}>
								팔로잉 피드
							</Link>
						)}
					</li>
				</ul>
			</div>

			{children}
		</AppLayout>
	);
}
