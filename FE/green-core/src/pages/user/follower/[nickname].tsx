import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { useRouter } from 'next/router';
import { useAppSelector } from '@/core/hooks';
import { getFollowerList } from '@/core/follow/followAPI';
import { getStorage, ref, getDownloadURL, uploadBytes } from 'firebase/storage';
import { updateFollow, deleteFollow } from '@/core/follow/followAPI';
import Skeleton from 'react-loading-skeleton';

import FollowLayout from '@/layout/FollowLayout';
import AppButton from '@/components/button/AppButton';

export default function follower() {
  const router = useRouter();
  const storage = getStorage();

  const { nickname } = router.query;
  const [followerList, setFollowerList] = useState([]);
  const [userProfileList, setUserProfileList] = useState({});
  const [isLoading, setIsLoading] = useState(false);

  // ------------------------ 인피니티 스크롤 변수 -----------------------
  const [isStoped, setIsStoped] = useState<boolean>(false);
  const [page, setPage] = useState<number>(0);
  const [size, setSize] = useState<number>(10);
  const [target, setTarget] = useState(null); // 관찰 대상 target
  const [isLoaded, setIsLoaded] = useState(true); // 데이터 로딩 상태
  // -------------------------------------------------------------------

  useEffect(() => {
    if (!router.isReady) return;
    fetchFollowerList();
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
      fetchFollowerList();
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
  async function fetchFollowerList() {
    try {
      const params = {
        page: page,
        size: size,
      };
      // console.log(params);
      const { data } = await getFollowerList(nickname, params);

      for (let i = 0; i < data.length; i++) {
        getUserProfile(data[i].nickname);
        if (i == data.length - 1) setIsLoading(true);
      }
      // 종료 시그널
      if (data.length !== size) {
        setIsStoped(true);
      } else {
        setPage(page + 1);
      }
      setIsLoaded(false);
      setFollowerList((prev) => [...prev, ...data]);
    } catch (error) {
      // console.error(error);
    }
  }

  /** 팔로우 하는 함수 */
  async function handleFollowUpdate(e, nickname) {
    try {
      const { data } = await updateFollow(nickname);
      console.log(data);
    } catch (error) {
      console.error(error);
    }
  }

  /** 언팔로우 함수 */
  async function handleFollowDelete(e, nickname) {
    try {
      const { data } = await deleteFollow(nickname);
      console.log(data);
    } catch (error) {
      console.error(error);
    }
  }

  function handleFollowerDelete() {}

  return (
    <FollowLayout>
      <div className='w-full flex justify-center items-center py-10'>
        <div className='space-y-5 divide-y divide-slate-200'>
          {isLoading ? (
            <>
              {followerList.map((f) => (
                <div key={f.nickname} className='flex pt-4 space-x-2 items-center justify-between'>
                  {userProfileList[f.nickname] ? (
                    <Link href={`/user/feed/${f.nickname}`}>
                      <Image
                        src={userProfileList[f.nickname]}
                        alt='사용자 프로필 이미지'
                        width={60}
                        height={60}
                        className='rounded-full bg-cover'
                        priority
                      />
                    </Link>
                  ) : (
                    <Skeleton width={60} height={60} circle />
                  )}

                  <div className='flex flex-col'>
                    {f.nickname ? <Link href={`/user/feed/${f.nickname}`}>{f.nickname}</Link> : <Skeleton width={50} />}
                    {f.introduction ? <div className='w-80 introduction'>{f.introduction}</div> : <Skeleton width={150} />}
                  </div>

                  <div className='flex space-x-2 items-center'>
                    {f.isFollowed ? (
                      <AppButton
                        text='언팔로우'
                        className='hover:bg-red-100'
                        bgColor='thin'
                        size='small'
                        handleClick={(e) => handleFollowDelete(e, f.nickname)}
                      />
                    ) : (
                      <AppButton text='팔로우 하기' size='small' handleClick={(e) => handleFollowUpdate(e, f.nickname)} />
                    )}

                    <span className='material-symbols-outlined cursor-pointer close' onClick={handleFollowerDelete}>
                      close
                    </span>
                  </div>
                </div>
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
