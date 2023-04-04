import React, { useRef, useEffect, useState } from 'react';
import Link from 'next/link';
import AppLayout from '@/layout/AppLayout';
import DiaryListItem from '@/components/DiaryListItem';
import styles from '@/styles/DiarySetDetail.module.scss';
import { useRouter } from 'next/router';
import { useAppDispatch, useAppSelector } from '@/core/hooks';
import { getDiaryList } from '~/src/core/diary/diaryAPI';
import { createBookmark, deleteBookmark } from '~/src/core/diarySet/diarySetAPI';
import Image from 'next/image';
import { SET_IS_SEARCH_STATE } from '@/core/common/commonSlice';
import { getStorage, ref, getDownloadURL } from 'firebase/storage';
import Skeleton from 'react-loading-skeleton';

export default function diarySet() {
  const dispatch = useAppDispatch();
  const isLoading = useAppSelector<boolean>((state) => state.diary.isLoading);
  const diaryList = useAppSelector<Array<any>>((state) => state.diary.diaryList);
  const diarySet = useAppSelector<any>((state) => state.diary.diarySet);
  const [isBookmarked, setIsBookmarked] = useState<boolean | null>(diarySet.isBookmarked);
  const [isEditOpen, setIsEditOpen] = useState<boolean>(false);
  const { nickname: myNickname } = useAppSelector((state) => state.common?.userInfo);
  const divRef = useRef<HTMLDivElement>(null);
  const router = useRouter();
  const { diarySetId } = router.query;
  const storage = getStorage();
  const [userProfileImagePath, setUserProfileImagePath] = useState<string>('');

  /** 사용자 프로필 이미지 가져오는 함수 */
  function getUserProfile(nickname: string) {
    const profileRef = ref(storage, `${nickname}/profileImage`);

    getDownloadURL(profileRef)
      .then((downloadURL) => {
        setUserProfileImagePath(downloadURL);
      })
      .catch((error) => {
        console.error(error);
      });
  }

  // searchState 변경
  function changeSearchState() {
    dispatch(SET_IS_SEARCH_STATE('default'));
  }

  // 바깥 클릭시
  const handleClickOutside = (event) => {
    if (event.target.innerText != 'more_vert') {
      setIsEditOpen(false);
    }
  };

  useEffect(() => {
    changeSearchState();
    getUserProfile(myNickname);

    if (diarySetId) {
      dispatch(getDiaryList(Number(diarySetId)));
    }

    document.addEventListener('click', handleClickOutside);
    return () => {};
  }, [diarySetId, myNickname]);

  // 뒤로가기
  function goBack() {
    router.back();
  }

  // 북마크
  function postBookmark() {
    if (isBookmarked) {
      // 북마크 취소
      deleteBookmark(Number(diarySetId)).then((res) => {
        if (res.result === 'SUCCESS') {
          setIsBookmarked(false);
        }
      });
    } else {
      // 북마크 설정
      createBookmark(Number(diarySetId)).then((res) => {
        if (res.result === 'SUCCESS') {
          setIsBookmarked(true);
        }
      });
    }
  }

  function openEditPopUp(event) {
    event.stopPropagation();
    setIsEditOpen(true);
  }

  return (
    <AppLayout>
      <div className=''>
        {isLoading ? (
          new Array(10).fill(1).map((_, i) => {
            return <DiaryListItem key={i} />;
          })
        ) : (
          <div className={`flex flex-col`}>
            {/* 헤더 */}
            <div className='p-5 '>
              <div className='flex items-center text-2xl font-bold'>
                <span className='material-symbols-outlined' style={{ cursor: 'pointer' }} onClick={goBack}>
                  arrow_back_ios
                </span>
                <span>관찰 일지</span>
              </div>
            </div>
            {/* 바디 */}
            <div className='flex'>
              {/* 세로1 */}
              <div className='flex flex-col items-center p-5'>
                {/* 프로필 */}
                <div>
                  <Link href={`/user/feed/${diarySet?.user?.nickname}`}>
                    {userProfileImagePath ? (
                      <Image src={userProfileImagePath} width={80} height={80} style={{ borderRadius: '50%' }} alt='프로필 사진' />
                    ) : (
                      <Skeleton width={80} height={80} style={{ borderRadius: '50%' }} />
                    )}
                  </Link>
                </div>
                {/* 일지생성 */}
                <div className='py-3'>
                  <Link href={'/diary/create'}>
                    <div className={`bg-blue-500 rounded px-3 py-1 flex justify-center ${styles.diaryAddBtn}`} style={{ borderRadius: '30px' }}>
                      <span className='material-symbols-outlined'>add</span>
                      <span className='underline underline-offset-4 pr-2'>추가하기</span>
                    </div>
                  </Link>
                </div>
              </div>
              {/* 세로2 */}
              <div className='flex flex-col grow'>
                {/* 닉네임, 아이콘 */}
                <div className='text-lg flex justify-between pr-5 pt-5 '>
                  <div className='font-bold text-xl'>{diarySet?.user?.nickname}</div>

                  <div className='relative'>
                    <span
                      className={`material-symbols-outlined cursor-pointer ${
                        isBookmarked ? `${styles.materialSymbolsOutlined} text-yellow-400` : ''
                      }`}
                      onClick={postBookmark}>
                      bookmark
                    </span>

                    {myNickname === diarySet?.user?.nickname && (
                      <>
                        <span className='material-symbols-outlined px-2' onClick={openEditPopUp} style={{ cursor: 'pointer' }}>
                          more_vert
                        </span>
                        <div ref={divRef} className={`${isEditOpen ? styles.editPopUp : 'hidden'} rounded-xl overflow-hidden`}>
                          {/* TODO : 수정 페이지 모달 */}
                          <div className='border-b border-slate-300 bg-white flex justify-center items-center'>
                            <span className='text-lg p-2'>수정</span>
                            <span className='material-symbols-outlined'>edit</span>
                          </div>

                          {/* TODO : 삭제 하기, 삭제 경고 모달 */}
                          <div className='bg-white flex justify-center items-center text-red-400'>
                            <span className='text-lg p-2'>삭제</span>
                            <span className='material-symbols-outlined'>delete</span>
                          </div>
                        </div>
                      </>
                    )}
                  </div>
                </div>
                {/* 일지리스트 */}
                <div className={`pr-5 pt-5 ${styles.diaryList}`}>
                  {diaryList.map((diary, index) => (
                    <DiaryListItem key={diary?.diaryId} diary={diary} title={diarySet.title} isLast={diaryList.length - 1 === index ? true : false} />
                  ))}
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </AppLayout>
  );
}
