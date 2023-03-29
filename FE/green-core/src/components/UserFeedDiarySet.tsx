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

export default function UserFeedDiarySet() {
  const dispatch = useAppDispatch();
  const router = useRouter();

  const { nickname } = router.query;

  const [isOpenDiarySetCreateModal, setIsOpenDiarySetCreateModal] = useState(false);
  const [isOpenDiarySetUpdateModal, setIsOpenDiarySetUpdateModal] = useState(false);
  const [isOpenDiarySetDeleteModal, setIsOpenDiarySetDeleteModal] = useState(false);

  const [diarySetId, setDiarySetId] = useState(null);
  const [diarySetList, setDiarySetList] = useState([]);

  const [diarySetPage, setDiarySetPage] = useState(0);
  const [diarySetSize, setDiarySetSize] = useState(2);
  const [diarySetListTotalCount, setDiarySetListTotalCount] = useState(3);

  const [diarySetListAll, setDiarySetListAll] = useState([]);
  const [userPlantListTotalCount, setUserPlantListTotalCount] = useState(8);
  const [userPlantListAll, setUserPlantListAll] = useState<Array<UserPlantType>>();

  const [isEditPopUp, setIsEditPopUp] = useState(false);

  useEffect(() => {
    fetchDiarySetList();
    fetchDiarySetListAll();
    return () => {};
  }, [userPlantListTotalCount, diarySetSize]); // 해당 변수가 업데이트 되면 한번 더 불러짐

  async function fetchUserPlantListAll() {
    try {
      const params = { page: 0, size: userPlantListTotalCount };
      const { data } = await getUserPlantList(nickname, params);
      setUserPlantListAll(data);
    } catch (error) {
      console.error(error);
    }
  }

  const fetchDiarySetList = useCallback(async () => {
    try {
      const params = { page: diarySetPage, size: diarySetSize };
      // const { data } = await getDiarySetList(nickname, params);

      const data = [
        {
          diarySetId: 1,
          imagePath: 'image1/jpg',
          bookmarkCount: 32,
          isBookmarked: false,
          diaryCount: 10,
          title: '제목1',
        },
        {
          diarySetId: 2,
          imagePath: 'image1/jpg',
          bookmarkCount: 32,
          isBookmarked: false,
          diaryCount: 10,
          title: '제목2',
        },
        {
          diarySetId: 3,
          imagePath: 'image1/jpg',
          bookmarkCount: 32,
          isBookmarked: false,
          diaryCount: 10,
          title: '제목3',
        },
      ];

      // FIXME: 확인
      let temp = data.slice(diarySetPage, diarySetPage + diarySetSize);
      setDiarySetList(temp);
    } catch (error) {
      console.error(error);
    }
  }, [nickname, diarySetPage, diarySetSize]);

  async function fetchDiarySetListAll() {
    try {
      const params = { page: 0, size: diarySetListTotalCount };
      // const { data } = await getDiarySetList(nickname, params);

      const data = [
        {
          diarySetId: 1,
          imagePath: 'image1/jpg',
          bookmarkCount: 32,
          isBookmarked: false,
          diaryCount: 10,
          title: '제목1',
        },
        {
          diarySetId: 2,
          imagePath: 'image1/jpg',
          bookmarkCount: 32,
          isBookmarked: false,
          diaryCount: 10,
          title: '제목2',
        },
        {
          diarySetId: 3,
          imagePath: 'image1/jpg',
          bookmarkCount: 32,
          isBookmarked: false,
          diaryCount: 10,
          title: '제목3',
        },
      ];

      setDiarySetListAll(data);
    } catch (error) {
      console.error(error);
    }
  }

  function handleIsOpenDiarySetUpdate(diarySetId: number) {
    setDiarySetId(diarySetId);
    setIsOpenDiarySetUpdateModal(true);
  }

  function handleIsOpenDiarySetDelete(diarySetId: number) {
    setDiarySetId(diarySetId);
    setIsOpenDiarySetDeleteModal(true);
  }

  async function handleDiarySetDelete(diarySetId: number) {
    try {
      const { data } = await deleteDiarySet(diarySetId);
      console.log(data);
      setIsOpenDiarySetDeleteModal(false);
    } catch (error) {
      console.error(error);
      setIsOpenDiarySetDeleteModal(false);
    }
  }

  async function prevDiarySetListPage() {
    let page = diarySetPage - diarySetSize;
    if (page < 0) return;

    setDiarySetPage(page);
    await fetchDiarySetList();
  }

  async function nextDiarySetListPage() {
    let page = diarySetPage + diarySetSize;
    if (page >= userPlantListTotalCount) return;

    setDiarySetPage(page);
    await fetchDiarySetList();
  }

  /** 수정/삭제 팝업 띄우는 함수 */
  function handleisEditToggle() {
    setIsEditPopUp(!isEditPopUp);
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
      />
      <DiarySetModal
        isOpen={isOpenDiarySetUpdateModal}
        update
        modalTitle='관찰일지 수정'
        diarySetId={diarySetId}
        handleModalClose={() => setIsOpenDiarySetUpdateModal(false)}
      />
      <AppModal
        isOpen={isOpenDiarySetDeleteModal}
        title='관찰일지 삭제'
        handleModalClose={() => setIsOpenDiarySetDeleteModal(false)}
        handleModalConfirm={handleDiarySetDelete}
      />

      <div className='space-y-2 px-10 py-5'>
        <div className='flex justify-between space-y-2 mb-5'>
          <div className='text-xl font-semibold'>관찰일지</div>
          <div className='flex main cursor-pointer'>
            <span className='material-symbols-outlined'>add</span>
            <div className='hover:underline' onClick={() => setIsOpenDiarySetCreateModal(true)}>
              추가하기
            </div>
          </div>
        </div>

        {/* <button className="bg-blue-500 rounded" onClick={prevDiarySetListPage}>
						이전
					</button> */}

        {/* <button className="bg-blue-500 rounded" onClick={nextDiarySetListPage}>
						다음
					</button> */}

        {/*  */}
        <div className='flex space-x-10 mx-10'>
          {diarySetList.map((diarySet) => (
            <UserFeedDiarySetListItem key={diarySet.diarySetId} diarySet={diarySet} />
          ))}
        </div>
      </div>
    </>
  );
}
