import React from 'react';
import AppLayout from '@/layout/AppLayout';
import { useRouter } from 'next/router';
import useSWR from 'swr';
import http from '@/lib/http';
import axios from 'axios';
import Skeleton from 'react-loading-skeleton';

const fetcher = (url: string) => fetch(url).then((res) => res.json());
// const fetcher = (url: string) => http.get(url).then((res) => res.data);

export default function DiaryDetail() {
	const router = useRouter();
	const diaryId = router.query.id; // string
	const {
		data: diary,
		error,
		isLoading: hasDiary
	} = useSWR(`https://jsonplaceholder.typicode.com/photos/${diaryId}`, fetcher);

	return (
		<AppLayout>
			{hasDiary ? (
				<ul>
					<Skeleton />
					<Skeleton />
					<Skeleton />
				</ul>
			) : (
				<ul>
					<li>
						<img src={diary.thumbnailUrl} alt="img" />
					</li>
					<li>{diary.albumId}</li>
					<li>{diary.title}</li>
				</ul>
			)}
		</AppLayout>
	);
}
