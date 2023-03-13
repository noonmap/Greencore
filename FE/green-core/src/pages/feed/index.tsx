import React, { useState, useEffect } from 'react';
import AppLayout from '@/layout/AppLayout';
import { useAppDispatch, useAppSelector } from '@/core/hooks';
import { getFeedList } from '@/core/feed/feedAPI';
import FeedListItem from '@/components/FeedListItem';

export default function feed() {
  // 전역 상태관리
  const isLoading = useAppSelector((state) => state.feed.isLoading);
  const feedList = useAppSelector((state) => state.feed.feedList);
  const isStop = useAppSelector((state) => state.feed.isStop);
  const page = useAppSelector((state) => state.feed.page);

  const [size, setSize] = useState<number>(10);
  const [target, setTarget] = useState(null); // 관찰 대상 target
  const [isLoaded, setIsLoaded] = useState(true); // 데이터 로딩 상태
  const dispatch = useAppDispatch();

  const [isSelectRecomment, setIsSelectRecomment] = useState(true);

  // 초기 웹 훅
  useEffect(() => {
    fetchFeedList();
    return () => {};
  }, [isLoaded]);

  // 데이터 불러오기
  async function fetchFeedList() {
    if (!isStop && isLoaded) {
      const params = {
        page: page,
        size: size,
      };

      // 전역 상태관리
      await dispatch(getFeedList(params));
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
    if (target && !isStop) {
      setTimeout(() => {
        observer = new IntersectionObserver(onIntersect, {
          threshold: 1, // 배열의 요소가 100% 보여질때마다 콜백을 실행
        });
        observer.observe(target);
      }, 100);
    }
    return () => observer && observer.disconnect();
  }, [target, isLoaded]);

  function handleClickRecommend() {
    setIsSelectRecomment(true);
  }

  function handleClickFollow() {
    setIsSelectRecomment(false);
  }

  return (
    <AppLayout>
      <div className='flex '>
        <button onClick={handleClickRecommend}>추천</button>
        <button onClick={handleClickFollow}>팔로우</button>
      </div>

      {isLoading ? (
        <>로딩중</>
      ) : feedList.length == 0 ? (
        <div>
          <span>조회된 피드가 없습니다.</span>
        </div>
      ) : (
        <>
          {isSelectRecomment ? (
            <div>
              <div>
                {feedList.map((feed) => (
                  <FeedListItem key={feed.feedId} feed={feed}></FeedListItem>
                ))}
                <div ref={setTarget} />
              </div>
            </div>
          ) : (
            <div>팔로우피드</div>
          )}
          <div />
        </>
      )}
    </AppLayout>
  );
}
