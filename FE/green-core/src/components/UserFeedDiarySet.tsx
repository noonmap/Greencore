import React, { useCallback, useEffect, useState } from 'react';
import DiarySetModal from '@/components/modal/DiarySetModal';
import { getDiarySetList, deleteDiarySet } from '@/core/diarySet/diarySetAPI';
import { useAppDispatch, useAppSelector } from '@/core/hooks';
import { useRouter } from 'next/router';
import { getUserPlantList } from '@/core/user/userAPI';
import Link from 'next/link';
import Image from 'next/image';
import AppModal from './common/AppModal';
import UserFeedDiarySetListItem from './UserFeedDiarySetListItem';
import Skeleton from 'react-loading-skeleton';

type UserPlantType = {
  plantId: number;
  plantImagePath: string;
  plantName: string;
  plantNickname: string;
  userPlantId: number;
};

export default function UserFeedDiarySet({ nickname }) {
  const isSameUser = useAppSelector((state) => state.user.isSameUser);

  const [isOpenDiarySetCreateModal, setIsOpenDiarySetCreateModal] = useState(false);
  const [diarySetList, setDiarySetList] = useState([]);
  const [diarySetPage, setDiarySetPage] = useState(0);
  const [diarySetSize, setDiarySetSize] = useState(3);

  const [diarySetListTotalCount, setDiarySetListTotalCount] = useState(5);
  const [userPlantListTotalCount, setUserPlantListTotalCount] = useState(5);
  const [userPlantListAll, setUserPlantListAll] = useState<Array<UserPlantType>>();

  useEffect(() => {
    fetchUserPlantListAll();
    return () => {};
  }, [userPlantListTotalCount, isOpenDiarySetCreateModal]);

  useEffect(() => {
    fetchDiarySetList();
    return () => {};
  }, [nickname, diarySetPage]);

  /** 키우는 식물 리스트 모두 가져오기 함수 */
  async function fetchUserPlantListAll() {
    try {
      const params = { page: 0, size: 1 };
      const { data } = await getUserPlantList(nickname, params);
      const totalElements = data?.totalElements;

      const params2 = { page: 0, size: totalElements };
      const { data: data2 } = await getUserPlantList(nickname, params2);
      const content = data2?.content;

      setUserPlantListTotalCount(totalElements);
      setUserPlantListAll(content);
    } catch (error) {
      console.error(error);
    }
  }

  /** 사용자 관찰일지 가져오는 함수 */
  const fetchDiarySetList = useCallback(async () => {
    try {
      const params = { page: diarySetPage, size: diarySetSize };
      const { data } = await getDiarySetList(nickname, params);
      const content = data.content;
      const totalElements = data.totalElements;
      console.log(totalElements);
      setDiarySetList(content);
      setDiarySetListTotalCount(totalElements);
    } catch (error) {
      console.error(error);
    }
  }, [nickname, diarySetPage, diarySetSize]);

  /** 관찰일지 이전 페이지 */
  async function prevDiarySetListPage() {
    let page = diarySetPage - 1;
    if (page < 0) return;
    setDiarySetPage(page);
  }

  /** 관찰일지 다음 페이지 */
  async function nextDiarySetListPage() {
    let page = diarySetPage + 1;
    if (page >= userPlantListTotalCount / diarySetSize) return;
    setDiarySetPage(page);
  }

  return (
    <>
      {/* FIXME: 만약 내키식을 생성하지 않았다면 해당 모달이 뜨지않고 다른 알람 모달이 뜨도록 */}
      <DiarySetModal
        isOpen={isOpenDiarySetCreateModal}
        modalTitle='관찰일지 생성'
        create
        userPlantList={userPlantListAll}
        handleModalClose={() => setIsOpenDiarySetCreateModal(false)}
        fetchDiarySetList={fetchDiarySetList}
      />

      <div className='px-3 py-7 pt-9'>
        <div className='flex justify-between items-center mb-7 mx-4'>
          <div className='text-md font-semibold'>관찰일지 🔍</div>

          {isSameUser ? (
            <div
              className='flex items-center cursor-pointer rounded-full p-0.5'
              onClick={() => setIsOpenDiarySetCreateModal(true)}
              style={{ backgroundColor: 'var(--main-color)' }}>
              <span className='material-symbols-outlined font-bold text-white' style={{ fontSize: '1.2rem' }}>
                add
              </span>
              <div className='pr-1 font-bold text-white' style={{ fontSize: '0.8rem' }}>
                ADD
              </div>
            </div>
          ) : null}
        </div>

        {diarySetList ? (
          diarySetList.length == 0 ? (
            <div className='mx-4 text-center text-sm py-4'>관찰일지를 생성해주세요 📑</div>
          ) : (
            <div className='flex flex-row space-x-4 items-center mx-4'>
              {diarySetPage == 0 ? (
                <span className='material-symbols-outlined cursor-default text-gray-200' style={{ fontSize: '1rem' }}>
                  arrow_back_ios
                </span>
              ) : (
                <span className='material-symbols-outlined cursor-pointer' onClick={prevDiarySetListPage} style={{ fontSize: '1rem' }}>
                  arrow_back_ios
                </span>
              )}

              <div className='flex justify-around w-full'>
                {diarySetList.map((diarySet) => (
                  <UserFeedDiarySetListItem key={diarySet.diarySetId} nickname={nickname} diarySet={diarySet} fetchDiarySetList={fetchDiarySetList} />
                ))}
              </div>

              {diarySetPage >= Math.ceil(Number(diarySetListTotalCount) / Number(diarySetSize)) - 1 ? (
                <span className='material-symbols-outlined cursor-default text-gray-200' style={{ fontSize: '1rem' }}>
                  arrow_forward_ios
                </span>
              ) : (
                <span className='material-symbols-outlined cursor-pointer' onClick={nextDiarySetListPage} style={{ fontSize: '1rem' }}>
                  arrow_forward_ios
                </span>
              )}
            </div>
          )
        ) : (
          <div className='mx-4 text-center text-sm py-4'>
            <Skeleton width={150} height={150} circle />
          </div>
        )}

        {/* <div className='flex items-center'>
          <span className='material-symbols-outlined cursor-pointer' onClick={prevDiarySetListPage}>
            arrow_back_ios
          </span>

          <div className='flex space-x-10 mx-10'>
            {diarySetList.map((diarySet) => (
              <UserFeedDiarySetListItem key={diarySet.diarySetId} nickname={nickname} diarySet={diarySet} fetchDiarySetList={fetchDiarySetList} />
            ))}
          </div>

          <span className='material-symbols-outlined cursor-pointer' onClick={nextDiarySetListPage}>
            arrow_forward_ios
          </span>
        </div> */}
      </div>
    </>
  );
}
