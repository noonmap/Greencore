import React, { useEffect, useState } from 'react';
import FeedLayout from '@/layout/FeedLayout';
import { useAppDispatch, useAppSelector } from '@/core/hooks';
import { SET_IS_SEARCH_STATE } from '@/core/common/commonSlice';
import { getFollowFeedList } from '@/core/feed/feedAPI';
import FeedListItem from '@/components/FeedListItem';
import Image from 'next/image';
import Link from 'next/link';
import styles from '@/styles/home/home.module.scss';

import AppLoading from '@/components/common/AppLoading';
import Skeleton from 'react-loading-skeleton';

export default function index() {
	const dispatch = useAppDispatch();

	const isLoading = useAppSelector((state) => state.feed.isLoading);
	const feedList = useAppSelector((state) => state.feed.followingFeedList);
	const isStoped = useAppSelector((state) => state.feed.isStoped);
	const page = useAppSelector((state) => state.feed.page);
	const size = useAppSelector((state) => state.feed.size);

	const [target, setTarget] = useState(null); // 관찰 대상 target
	const [isLoaded, setIsLoaded] = useState(false); // 데이터 로딩 상태

	// searchState 변경
	useEffect(() => {
		dispatch(SET_IS_SEARCH_STATE('default'));
	}, []);

	// 초기 웹 훅
	useEffect(() => {
		setIsLoaded(true);
	}, []);

	// isLoaded 가 변할 때 실행
	useEffect(() => {
		fetchFeedList();
	}, [isLoaded]);

	// 데이터 불러오기
	async function fetchFeedList() {
		if (!isStoped && isLoaded) {
			const params = {
				page: page,
				size: size
			};

			// 전역 상태관리
			await dispatch(getFollowFeedList(params));
			setIsLoaded(false);
		}
	}

	// 추가 데이터 요청
	const getMoreItem = () => {
		setIsLoaded(true);
	};

	// 타겟을 만났을 때 실행하는 로직
	const onIntersect = async ([entry]: any, observer: any) => {
		if (entry.isIntersecting && !isLoaded) {
			observer.unobserve(entry.target); // 관찰 멈춤
			getMoreItem(); // isLoaded를 바꿈
			observer.observe(entry.target); // 관찰 재시작
		}
	};

	// 타겟 설정
	useEffect(() => {
		let observer;
		if (target && !isStoped) {
			setTimeout(() => {
				observer = new IntersectionObserver(onIntersect, {
					threshold: 1 // 배열의 요소가 100% 보여질때마다 콜백을 실행
				});
				observer.observe(target);
			}, 100);
		}
		return () => observer && observer.disconnect();
	}, [target, isLoaded]);

	return (
		<FeedLayout>
			<div className={`relative w-full m-0 p-0`}>
				<div className={`rounded w-full ml-auto flex justify-end items-center`}>
					<Link href="/post/create" className={`${styles.addBtn}`}>
						<span className={`material-symbols-outlined`}>edit_square</span>
					</Link>
				</div>

				{isLoading ? (
					<AppLoading />
				) : feedList.length == 0 ? (
					<div className="text-center flex items-center justify-center space-x-2 pt-40">
						<div className="font-italic">조회된 피드가 없습니다</div>
						<img src="/images/emoji/face_with_rolling_eyes.png" width="24" height="24" />
					</div>
				) : (
					<div className={`overflow-auto`}>
						{feedList.map((feed) => (
							<FeedListItem key={feed.feedId} feed={feed}></FeedListItem>
						))}
						<div ref={setTarget} />
					</div>
				)}
			</div>
		</FeedLayout>
	);
}
