import React, { useCallback, useEffect, useState } from 'react';
import DiarySetModal from '@/components/modal/DiarySetModal';
import { getDiarySetList, deleteDiarySet } from '@/core/diarySet/diarySetAPI';
import { useAppDispatch } from '@/core/hooks';
import { useRouter } from 'next/router';
import { getUserPlantList } from '@/core/user/userAPI';
import Link from 'next/link';
import Image from 'next/image';
import AppModal from './common/AppModal';
import UserFeedDiarySetListItem from './UserFeedDiarySetListItem';

type UserPlantType = {
  plantId: number;
  plantImagePath: string;
  plantName: string;
  plantNickname: string;
  userPlantId: number;
};

export default function UserFeedDiarySet({ nickname }) {
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
  }, [userPlantListTotalCount]);

  useEffect(() => {
    fetchDiarySetList();
    return () => {};
  }, [diarySetPage]);

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

      <div className='space-y-2 px-10 py-5'>
        <div className='flex justify-between space-y-2 mb-5'>
          <div className='text-xl font-semibold'>관찰일지</div>
          <div className='flex main cursor-pointer' onClick={() => setIsOpenDiarySetCreateModal(true)}>
            <span className='material-symbols-outlined'>add</span>
            <div className='hover:underline'>추가하기</div>
          </div>
        </div>

        <div className='flex items-center'>
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
        </div>
      </div>
    </>
  );
}
