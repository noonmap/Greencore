import React, { useState, useEffect } from 'react';
import AppLayout from '@/layout/AppLayout';
import { useAppDispatch, useAppSelector } from '@/core/hooks';
import { getFeedList, getFollowFeedList, getTagFeedList, getTagFeedListMore } from '@/core/feed/feedAPI';
import { initFeedList } from '@/core/feed/feedSlice';
import FeedListItem from '@/components/FeedListItem';
import SearchComponent from '@/components/SearchComponent';
import styles from '@/styles/Home.module.scss';

export default function feed() {
  const dispatch = useAppDispatch();
  // 피드 조회
  const isLoading = useAppSelector((state) => state.feed.isLoading);
  const feedList = useAppSelector((state) => state.feed.feedList);
  const isStoped = useAppSelector((state) => state.feed.isStoped);
  const page = useAppSelector((state) => state.feed.page);

  const [size, setSize] = useState<number>(10);
  const [target, setTarget] = useState(null); // 관찰 대상 target
  const [isLoaded, setIsLoaded] = useState(true); // 데이터 로딩 상태

  const [isSelectRecomment, setIsSelectRecomment] = useState(true);

  // 태그 검색 조회
  const tagFeedList = useAppSelector((state) => state.feed.tagFeedList);
  const isStopedAtTag = useAppSelector((state) => state.feed.isStopedAtTag);
  const pageAtTag = useAppSelector((state) => state.feed.pageAtTag);

  const [sizeAtTag, setSizeAtTag] = useState<number>(10);
  const [targetAtTag, setTargetAtTag] = useState(null); // 관찰 대상 target
  const [isLoadedAtTag, setIsLoadedAtTag] = useState(true); // 데이터 로딩 상태
  const [inputData, setInputData] = useState<string>(''); // 데이터 로딩 상태
  // let inputData: string = '';

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
      <div className={`py-5`}>
        <div className={`${styles.title} mb-10 px-3 `}>Home</div>
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
        {/* <div className={`w-4/12`}>
          <div>
            <SearchComponent></SearchComponent>
          </div>
        </div> */}
        {/* {isLoading ? (
          <>로딩중</>
        ) : feedList.length == 0 ? (
          <div>
            <span>조회된 피드가 없습니다.</span>
          </div>
        ) : (
          <>
            <div className={`grid grid-cols-2 gap-2`}>
              <div>
                <div className={`overflow-auto`} style={{ height: '700px' }}>
                  {feedList.map((feed) => (
                    <FeedListItem key={feed.feedId} feed={feed}></FeedListItem>
                  ))}
                  <div ref={setTarget} />
                  <div className={`p-5`}></div>
                </div>
              </div>
              <div>
                <SearchComponent></SearchComponent>
              </div>
            </div>
          </>
        )} */}
      </div>
    </AppLayout>
  );
}
