import Link from 'next/link';
import { useRouter } from 'next/router';
import React, { useEffect, useState } from 'react';
import AppLayout from './AppLayout';

export default function FllowLayout({ children }) {
	const router = useRouter();

	const [isPassword, setIsPassword] = useState(false);

	useEffect(() => {
		if (!router.isReady) return;

		if (router.pathname.includes('password')) setIsPassword(true);
		else setIsPassword(false);

		return () => {};
	}, []);

	return (
		<AppLayout>
			<div className="text-md font-medium text-center text-gray-500 border-b border-gray-200">
				<ul className="flex -mb-px">
					<li className="w-full">
						{isPassword ? (
							<Link
								href={`/user/settings/password`}
								className={`layoutActive layoutFunc w-full inline-block p-4 border-b-2 hover:bg-gray-100`}
								aria-current="page">
								회원정보 수정
							</Link>
						) : (
							<Link
								href={`/user/settings/password`}
								className={`layoutFunc w-full inline-block p-4 border-b-2 border-transparent hover:bg-gray-100 hover:text-gray-600`}>
								회원정보 수정
							</Link>
						)}
					</li>
					<li className="w-full">
						{!isPassword ? (
							<Link
								href={`/user/settings/delete`}
								className={`layoutActive layoutFunc w-full inline-block active p-4 border-b-2 hover:bg-gray-100`}
								aria-current="page">
								회원탈퇴
							</Link>
						) : (
							<Link
								href={`/user/settings/delete`}
								className={`layoutFunc w-full inline-block p-4 border-b-2 border-transparent hover:bg-gray-100 hover:text-gray-600`}>
								회원탈퇴
							</Link>
						)}
					</li>
				</ul>
			</div>

			{children}
		</AppLayout>
	);
}
