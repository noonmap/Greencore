import React, { useCallback, useEffect, useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import styles from './UserFeedDiary.module.scss';
import { useRouter } from 'next/router';
import { useAppSelector } from '@/core/hooks';
import { createBookmark, deleteBookmark } from '@/core/diarySet/diarySetAPI';

export default function UserFeedDiarySetListItem({ diarySet }) {
  const router = useRouter();
  const { nickname } = router.query;
  const { nickname: myNickname } = useAppSelector((state) => state.common?.userInfo);

  const [isSameUser, setIsSameUser] = useState<boolean>(false);
  const [isEditPopUp, setIsEditPopUp] = useState<boolean>(false);

  const [diarySetId, setDiarySetId] = useState(null);
  const [diarySetList, setDiarySetList] = useState([]);

  const [isOpenDiarySetUpdateModal, setIsOpenDiarySetUpdateModal] = useState(false);
  const [isOpenDiarySetDeleteModal, setIsOpenDiarySetDeleteModal] = useState(false);

  useEffect(() => {
    if (!router.isReady) return;
    if (!router.query.nickname) return;
    checkSameUser();
  }, [nickname]);

  /** url path의 유저와 현재 로그인 유저가 같은지 확인하는 함수 */
  const checkSameUser = useCallback(() => {
    if (myNickname == nickname) setIsSameUser(true);
  }, [myNickname, nickname]);

  function handleIsOpenDiarySetUpdate(diarySetId: number) {
    setDiarySetId(diarySetId);
    setIsOpenDiarySetUpdateModal(true);
  }

  function handleIsOpenDiarySetDelete(diarySetId: number) {
    setDiarySetId(diarySetId);
    setIsOpenDiarySetDeleteModal(true);
  }

  async function handleBookmarkCreate() {
    console.log('handleBookmarkCreate', diarySet.diarySetId);
    const { data } = await createBookmark(diarySet.diarySetId);
    // console.log(data);
  }

  async function handleBookmardDelete() {
    console.log('handleBookmardDelete', diarySet.diarySetId);
    const { data } = await deleteBookmark(diarySet.diarySetId);
    // console.log(data);
  }

  /** 수정/삭제 팝업 띄우는 함수 */
  function handleisEditToggle() {
    setIsEditPopUp(!isEditPopUp);
  }

  return (
    <>
      <div className={`${styles.wrap}`}>
        <div className={`${styles.content} rounded space-y-2`}>
          <Link href={`/diary/${diarySet.diarySetId}`} className='relative'>
            <Image src={'/images/otter2.png'} className={`${styles.img} w-full`} priority width={100} height={100} alt='관찰일지 썸네일' />
            <div className={`${styles.card} absolute bottom-0`}>{diarySet.title}</div>
          </Link>

          <div>
            <div className='relative '>
              <span className='material-symbols-outlined md cursor-pointer absolute top-0 -right-1' onClick={handleisEditToggle}>
                more_vert
              </span>

              <div className='flex items-center cursor-pointer'>
                {diarySet.isBookmarked ? (
                  <span className='material-symbols-outlined md-main fill-main mr-0.5' onClick={handleBookmardDelete}>
                    bookmark
                  </span>
                ) : (
                  <span className='material-symbols-outlined md-main mr-0.5' onClick={handleBookmarkCreate}>
                    bookmark
                  </span>
                )}
                {diarySet.bookmarkCount}
              </div>
            </div>

            {isEditPopUp ? (
              <div className='relative'>
                <div className={`popUp ${styles.popUp}`}>
                  <div onClick={() => handleIsOpenDiarySetUpdate(diarySet.diarySetId)}>수정</div>
                  <div onClick={() => handleIsOpenDiarySetDelete(diarySet.diarySetId)}>삭제</div>
                </div>
              </div>
            ) : null}
          </div>
        </div>
      </div>
    </>
  );
}
