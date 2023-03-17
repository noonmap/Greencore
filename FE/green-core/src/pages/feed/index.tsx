import React, { useState, useEffect } from 'react';
import AppLayout from '@/layout/AppLayout';
import { useAppDispatch, useAppSelector } from '@/core/hooks';
import { getFeedList, getFollowFeedList, getTagFeedList, getTagFeedListMore } from '@/core/feed/feedAPI';
import { initFeedList } from '@/core/feed/feedSlice';
import styles from '@/styles/feed.module.scss';
import FeedListItem from '@/components/FeedListItem';
import TagFeedListItem from '@/components/TagFeedListItem';
import SearchComponent from '@/components/SearchComponent';

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

  // -------------------------- 태그 -------------------------------

  // 태그 검색
  function handleKeyUp(event) {
    if (event.key === 'Enter') {
      setInputData(event.target.value);
      searchInputValue(event.target.value);
    }
  }

  function searchInputValue(search: string) {
    const params = {
      search: search,
      page: 0,
      size: sizeAtTag,
    };
    dispatch(getTagFeedList(params));
    setIsLoadedAtTag(false);
  }

  // 타겟 설정
  useEffect(() => {
    let observer2;
    if (targetAtTag && !isStopedAtTag && inputData) {
      setTimeout(() => {
        observer2 = new IntersectionObserver(onIntersect2, {
          threshold: 1, // 배열의 요소가 100% 보여질때마다 콜백을 실행
        });
        observer2.observe(targetAtTag);
      }, 100);
    }
    return () => observer2 && observer2.disconnect();
  }, [targetAtTag, isLoadedAtTag]);

  // 타겟을 만났을 때 실행하는 로직
  const onIntersect2 = async ([entry2]: any, observer2: any) => {
    if (entry2.isIntersecting && !isLoadedAtTag) {
      observer2.unobserve(entry2.target); // 관찰 멈춤
      getMoreItem2(); // isLoaded를 바꿈
      observer2.observe(entry2.target); // 관찰 재시작
    }
  };

  // 추가 데이터 요청
  const getMoreItem2 = () => {
    setIsLoadedAtTag(true);
  };

  // isLoadedAtTag 가 변할 때 실행
  useEffect(() => {
    if (inputData !== '' && isLoadedAtTag) {
      fetchTagFeedList();
    }
    return () => {};
  }, [isLoadedAtTag]);

  // 추가 데이터 요청하기
  async function fetchTagFeedList() {
    const params = {
      search: inputData,
      page: pageAtTag,
      size: sizeAtTag,
    };
    await dispatch(getTagFeedListMore(params));
    setIsLoadedAtTag(false);
  }

  // ----------------------------------------------------------------

  return (
    <AppLayout>
      {isLoading ? (
        <>로딩중</>
      ) : feedList.length == 0 ? (
        <div>
          <span>조회된 피드가 없습니다.</span>
        </div>
      ) : (
        <>
          <div className={`grid grid-cols-2 gap-2`}>
            <div>
              <div className='flex '>
                <button onClick={handleClickRecommend}>추천</button>
                <button onClick={handleClickFollow}>팔로우</button>
              </div>
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
      )}
    </AppLayout>
  );
}
