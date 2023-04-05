import React, { useState, useEffect } from 'react';
import AppLayout from '@/layout/AppLayout';
import { useAppDispatch, useAppSelector } from '@/core/hooks';
import { getFeedList, getFollowFeedList } from '@/core/feed/feedAPI';
import { initFeedList } from '@/core/feed/feedSlice';
import { SET_IS_SEARCH_STATE } from '@/core/common/commonSlice';
import FeedListItem from '@/components/FeedListItem';
import styles from '@/styles/Home.module.scss';
import Link from 'next/link';

export default function feed() {
  const dispatch = useAppDispatch();
  // 피드 조회
  const isLoading = useAppSelector((state) => state.feed.isLoading);
  const feedList = useAppSelector((state) => state.feed.feedList);
  const isStoped = useAppSelector((state) => state.feed.isStoped);
  const page = useAppSelector((state) => state.feed.page);
  const size = useAppSelector((state) => state.feed.size);

  const [target, setTarget] = useState(null); // 관찰 대상 target
  const [isLoaded, setIsLoaded] = useState(false); // 데이터 로딩 상태

  const [isSelectRecomment, setIsSelectRecomment] = useState(true);

  // searchState 변경
  useEffect(() => {
    dispatch(SET_IS_SEARCH_STATE('default'));
  }, []);

  // 초기 웹 훅
  useEffect(() => {
    // feedList 초기화 하기
    dispatch(initFeedList());
    setIsLoaded(true);
  }, [isSelectRecomment]);

  // isLoaded 가 변할 때 실행
  useEffect(() => {
    fetchFeedList();
    return () => {};
  }, [isLoaded]);

  // 데이터 불러오기
  async function fetchFeedList() {
    if (!isStoped && isLoaded) {
      const params = {
        page: page,
        size: size,
      };
      // 전역 상태관리
      if (isSelectRecomment) {
        await dispatch(getFeedList(params));
      } else {
        console.log(params);
        await dispatch(getFollowFeedList(params));
      }
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
          threshold: 1, // 배열의 요소가 100% 보여질때마다 콜백을 실행
        });
        observer.observe(target);
      }, 100);
    }
    return () => observer && observer.disconnect();
  }, [target, isLoaded, isSelectRecomment]);

  // 피드 카테고리 선택
  function handleClickRecommend() {
    setIsSelectRecomment(true);
  }

  function handleClickFollow() {
    setIsSelectRecomment(false);
  }

  return (
    <AppLayout>
      <div className={`py-5 relative w-full`}>
        <div className={`${styles.title} mb-10 px-3 `}>Home</div>
        <div className={`rounded w-full mb-2 ml-auto flex justify-end items-center`}>
          <Link href='/post/create' className={` ${styles.addBtn}`}>
            <span className={`material-symbols-outlined`}>edit_square</span>
          </Link>
        </div>
        <div className='flex'>
          <div className={`w-6/12 text-xl flex justify-center ${isSelectRecomment ? styles.select : ''} border-b border-black`}>
            <button onClick={handleClickRecommend}>추천</button>
          </div>
          <div className={`w-6/12 text-xl flex justify-center ${isSelectRecomment ? '' : styles.select} border-b border-black`}>
            <button onClick={handleClickFollow}>팔로우</button>
          </div>
        </div>
        <div className={`border-b border-inherit pt-5`}></div>

        {isLoading ? (
          <>로딩중</>
        ) : feedList.length == 0 ? (
          <div>
            <span>조회된 피드가 없습니다.</span>
          </div>
        ) : (
          <>
            <div className={`overflow-auto`}>
              {feedList.map((feed) => (
                <FeedListItem key={feed.feedId} feed={feed}></FeedListItem>
              ))}
              <div ref={setTarget} />
              <div className={`p-5`}></div>
            </div>
          </>
        )}
      </div>
    </AppLayout>
  );
}
