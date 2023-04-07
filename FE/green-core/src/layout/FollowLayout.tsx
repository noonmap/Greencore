import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/router';
import { useAppSelector } from '@/core/hooks';
import Link from 'next/link';
import AppLayout from './AppLayout';

export default function FllowLayout({ children }) {
	const router = useRouter();
	const nickname = useAppSelector((state) => state.common?.userInfo?.nickname);
	const [isFollowing, setIsFollowing] = useState<boolean>(true);

	useEffect(() => {
		if (!router.isReady) return;
		if (router.pathname.includes('following')) setIsFollowing(true);
		else setIsFollowing(false);
	}, [router.isReady]);

	return (
		<AppLayout>
			<div className="text-md font-medium text-center text-gray-500 border-b border-gray-200">
				<ul className="flex -mb-px">
					<li className="w-full">
						{isFollowing ? (
							<Link
								href={`/user/following/${nickname}`}
								className={`layoutActive layoutFunc active w-full inline-block p-4 border-b-2 hover:bg-gray-100`}
								aria-current="page">
								팔로우
							</Link>
						) : (
							<Link
								href={`/user/following/${nickname}`}
								className={`layoutFunc w-full inline-block p-4 border-b-2 border-transparent hover:bg-gray-100 hover:text-gray-600`}>
								팔로우
							</Link>
						)}
					</li>
					<li className="w-full">
						{!isFollowing ? (
							<Link
								href={`/user/follower/${nickname}`}
								className={`layoutActive layoutFunc active w-full inline-block p-4 border-b-2 hover:bg-gray-100`}
								aria-current="page">
								팔로워
							</Link>
						) : (
							<Link
								href={`/user/follower/${nickname}`}
								className={`layoutFunc w-full inline-block p-4 border-b-2 border-transparent hover:bg-gray-100 hover:text-gray-600`}>
								팔로워
							</Link>
						)}
					</li>
				</ul>
			</div>

			{children}
		</AppLayout>
	);
}
