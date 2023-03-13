import React, { useState, useEffect } from 'react';
import AppLayout from '@/layout/AppLayout';
import { useAppDispatch, useAppSelector } from '@/core/hooks';
import { getFeedList } from '@/core/feed/feedAPI';
import Image from 'next/image';
import styles from '@/styles/feed.module.scss';

export default function feed() {
  // 전역 상태관리
  const isLoading = useAppSelector((state) => state.feed.isLoading);
  const feedList = useAppSelector((state) => state.feed.feedList);
  const isStop = useAppSelector((state) => state.feed.isStop);

  const [page, setPage] = useState<number>(0);
  const [size, setSize] = useState<number>(10);
  const [target, setTarget] = useState(null); // 관찰 대상 target
  const [isLoaded, setIsLoaded] = useState(true); // 데이터 로딩 상태
  const dispatch = useAppDispatch();

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
      setPage((page) => page + 1);
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
          <div>
            {feedList.map((feed) => (
              <div key={feed.feedId} className={`${styles.feedContainer} bg-green-300`}>
                <div className={`${styles.helpTip} flex `}>
                  <div id='userInfo'>
                    <Image className='mb-3' src={feed.user.profileImagePath} alt='로고' width='30' height='30'></Image>
                    <span>{feed.user.nickname}</span>
                    <br />
                    <span>{feed.user.introduction}</span>
                    <br />
                    <span>팔로워 수 : {feed.user.followerCount}</span>
                    <br />
                    <span>팔로잉 수 : {feed.user.followingCount}</span>
                    <br />
                    <span>팔로잉 여부 : {feed.user.isFollowed ? 'true' : 'false'}</span>
                  </div>
                  <Image className='mb-3' src={feed.user.profileImagePath} alt='로고' width='30' height='30'></Image>
                  <span>{feed.user.nickname}</span>
                </div>
                <div>feedCode : {feed.feedCode}</div>
                <div>관찰일자? : {feed.opservationDate}</div>
                <div>feedId : {feed.feedId}</div>
                <div>내용 : {feed.content}</div>
                <div>
                  피드 이미지 : <Image className='inline-block' src={feed.imagePath} alt='로고' width='30' height='30'></Image>
                </div>
                <div>좋아요 수 : {feed.likeCount}</div>
                <div>댓글 수 : {feed.commentCount}</div>
                <div>작성일자 : {feed.craetedAt}</div>
              </div>
            ))}
            <div ref={setTarget} />
          </div>
          <div />
        </>
      )}
    </AppLayout>
  );
}
