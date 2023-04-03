import React, { useEffect, useState } from 'react';
import FollowLayout from '@/layout/FollowLayout';
import { useRouter } from 'next/router';
import { useAppSelector, useAppDispatch } from '@/core/hooks';
import Link from 'next/link';
import Image from 'next/image';
import { SET_IS_SEARCH_STATE } from '@/core/common/commonSlice';
import { getFollowingList } from '@/core/follow/followAPI';
import { getStorage, ref, getDownloadURL, uploadBytes } from 'firebase/storage';
import { updateFollow, deleteFollow } from '@/core/follow/followAPI';
import Skeleton from 'react-loading-skeleton';
import AppButton from '@/components/button/AppButton';
import { UserFollowingListItem } from '@/components/UserFollowingListItem';

export default function following() {
  const dispatch = useAppDispatch();
  const router = useRouter();
  const storage = getStorage();

  const { nickname } = router.query;
  const [followingList, setFollowingList] = useState([]);
  const [userProfileList, setUserProfileList] = useState({});
  const [isLoading, setIsLoading] = useState(false);

  // ------------------------ 인피니티 스크롤 변수 -----------------------
  const [isStoped, setIsStoped] = useState<boolean>(false);
  const [page, setPage] = useState<number>(0);
  const [size, setSize] = useState<number>(10);
  const [target, setTarget] = useState(null); // 관찰 대상 target
  const [isLoaded, setIsLoaded] = useState(true); // 데이터 로딩 상태
  // -------------------------------------------------------------------

  // searchState 변경
  useEffect(() => {
    dispatch(SET_IS_SEARCH_STATE('default'));
  });

  useEffect(() => {
    if (!router.isReady) return;
    fetchFollowingList();
    return () => {};
  }, [nickname]);

  // 무한 스크롤 타켓 설정
  useEffect(() => {
    let observer;

    if (target && !isStoped) {
      setTimeout(() => {
        // 배열의 요소가 100% 보여질때마다 콜백을 실행
        observer = new IntersectionObserver(onIntersect, { threshold: 1 });
        observer.observe(target);
      }, 100);
    }
    return () => observer && observer.disconnect();
  }, [target, isLoaded]);

  /** 타겟을 만났을 때 실행하는 로직 */
  const onIntersect = async ([entry]: any, observer: any) => {
    if (entry.isIntersecting && !isLoaded) {
      observer.unobserve(entry.target); // 관찰 멈춤
      setIsLoaded(true); // isLoaded를 바꿈
      observer.observe(entry.target); // 관찰 재시작
    }
  };

  /** isLoaded 가 변할 때 실행 */
  useEffect(() => {
    if (isLoaded && page !== 0) {
      fetchFollowingList();
    }
    return () => {};
  }, [isLoaded]);

  /** 사용자 프로필 이미지 가져오는 함수 */
  function getUserProfile(nickname) {
    const profileRef = ref(storage, `${nickname}/profileImage`);

    getDownloadURL(profileRef)
      .then((downloadURL) => {
        userProfileList[nickname] = downloadURL;
        const newUserProfile = { ...userProfileList };
        setUserProfileList(newUserProfile);
      })
      .catch((error) => {
        console.error(error);
      });
  }

  /** 팔로잉 목록 가져오는 함수 */
  async function fetchFollowingList() {
    try {
      const params = { page: page, size: size };
      const { data } = await getFollowingList(nickname, params);
      const content = data?.content;
      // console.log(data, totalElements);

      for (let i = 0; i < content.length; i++) {
        getUserProfile(content[i].nickname);
        if (i == content.length - 1) setIsLoading(true);
      }

      // 종료 시그널
      if (content.length !== size) setIsStoped(true);
      else setPage(page + 1);

      setIsLoaded(false);
      setFollowingList((prev) => [...prev, ...content]);
    } catch (error) {
      console.error(error);
    }
  }

  return (
    <FollowLayout>
      <div className='w-full flex justify-center items-center py-10 '>
        <div className='space-y-5 divide-y divide-slate-200'>
          {isLoading ? (
            <>
              {followingList.map((following) => (
                <UserFollowingListItem key={following.nickname} following={following} userProfileList={userProfileList} />
              ))}
              <div ref={setTarget} />
            </>
          ) : (
            <>로딩중..</>
          )}
        </div>
      </div>
    </FollowLayout>
  );
}
