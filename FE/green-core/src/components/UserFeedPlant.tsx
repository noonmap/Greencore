import React, { useCallback, useEffect, useState } from 'react';
import Image from 'next/image';
import { deleteUserPlant, getUserPlantList } from '@/core/user/userAPI';
import UserPlantModal from '@/components/modal/UserPlantModal';
import AppModal from './common/AppModal';
import AppButton from './button/AppButton';
import UserFeedPlantListItem from './UserFeedPlantListItem';

type UserPlantType = {
  plantId: number;
  plantImagePath: string;
  plantName: string;
  plantNickname: string;
  userPlantId: number;
};

export default function UserFeedPlant({ nickname }) {
  const [userPlantId, setUserPlantId] = useState(null);
  const [userPlantNickname, setUserPlantNickname] = useState('');
  const [userPlantList, setUserPlantList] = useState<Array<UserPlantType>>();

  const [userPlantPage, setUserPlantPage] = useState(0);
  const [userPlantSize, setUserPlantSize] = useState(2);
  const [userPlantListTotalCount, setUserPlantListTotalCount] = useState(8);

  const [isOpenUserPlantCreateModal, setIsOpenUserPlantCreateModal] = useState(false);
  const [isOpenUserPlantUpdateModal, setIsOpenUserPlantUpdateModal] = useState(false);
  const [isOpenUserPlantDeleteModal, setIsOpenUserPlantDeleteModal] = useState(false);

  useEffect(() => {
    fetchUserPlantList();
  }, []);

  /** 키우는 식물 리스트 가져오기 */
  const fetchUserPlantList = useCallback(async () => {
    try {
      const params = { page: userPlantPage, size: userPlantSize };
      const { data } = await getUserPlantList(nickname, params);
      // const content = data.content;
      // console.log(data);
      setUserPlantList(data);
    } catch (error) {
      console.error(error);
    }
  }, [nickname, userPlantPage, userPlantSize]);

  /** 키우는 식물 리스트 이전 페이지 */
  async function prevUserPlantListPage() {
    let page = userPlantPage - userPlantSize;
    if (page < 0) return;
    setUserPlantPage(page);
    await fetchUserPlantList();
  }

  /** 키우는 식물 리스트 다음 페이지 */
  async function nextUserPlantListPage() {
    let page = userPlantPage + userPlantSize;
    if (page >= userPlantListTotalCount) return;

    setUserPlantPage(page);
    await fetchUserPlantList();
  }

  return (
    <>
      {/* 키우는 식물 생성 모달  */}
      <UserPlantModal
        isOpen={isOpenUserPlantCreateModal}
        create
        title={'키우는 식물 생성'}
        handleModalClose={() => setIsOpenUserPlantCreateModal(false)}
        fetchUserPlantList={fetchUserPlantList}
      />

      {/* 내키식 라인 */}
      <div className='space-y-2 px-10 py-5'>
        <div className='flex justify-between space-y-2 mb-5'>
          <div className='text-xl font-semibold'>키우는 식물</div>
          <div className='flex main cursor-pointer' onClick={() => setIsOpenUserPlantCreateModal(true)}>
            <span className='material-symbols-outlined'>add</span>
            <div className='hover:underline'>추가하기</div>
          </div>
        </div>

        {userPlantList ? (
          userPlantList.length < 0 ? (
            <div>식물을 생성해주세요 🌱</div>
          ) : (
            <div className='flex flex-row space-x-4 items-center'>
              <span className='material-symbols-outlined cursor-pointer' onClick={prevUserPlantListPage}>
                arrow_back_ios
              </span>

              <div className='flex mx-7'>
                {userPlantList.map((userPlant) => (
                  <UserFeedPlantListItem key={userPlant.userPlantId} userPlant={userPlant} fetchUserPlantList={fetchUserPlantList} />
                ))}
              </div>

              <span className='material-symbols-outlined cursor-pointer' onClick={nextUserPlantListPage}>
                arrow_forward_ios
              </span>
            </div>
          )
        ) : (
          <div>식물을 생성해주세요 🌱</div>
        )}
      </div>
    </>
  );
}
