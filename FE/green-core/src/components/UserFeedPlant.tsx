import React, { useCallback, useEffect, useState } from 'react';
import { getUserPlantList } from '@/core/user/userAPI';
import UserPlantModal from '@/components/modal/UserPlantModal';
import UserFeedPlantListItem from './UserFeedPlantListItem';
import Skeleton from 'react-loading-skeleton';
import { useAppSelector } from '@/core/hooks';

type UserPlantType = {
  plantId: number;
  plantImagePath: string;
  plantName: string;
  plantNickname: string;
  userPlantId: number;
};

export default function UserFeedPlant({ nickname }) {
  const isSameUser = useAppSelector((state) => state.user.isSameUser);
  const [userPlantList, setUserPlantList] = useState<Array<UserPlantType>>([]);

  const [userPlantPage, setUserPlantPage] = useState(0);
  const [userPlantSize, setUserPlantSize] = useState(3);
  const [userPlantListTotalCount, setUserPlantListTotalCount] = useState(8);

  const [isOpenUserPlantCreateModal, setIsOpenUserPlantCreateModal] = useState(false);

  useEffect(() => {
    fetchUserPlantList();
  }, [nickname, userPlantPage]);

  /** 키우는 식물 리스트 가져오기 */
  const fetchUserPlantList = useCallback(async () => {
    try {
      const params = { page: userPlantPage, size: userPlantSize };
      const { data } = await getUserPlantList(nickname, params);
      const content = data?.content;
      const totalElements = data?.totalElements;
      setUserPlantList(content);
      setUserPlantListTotalCount(totalElements);
    } catch (error) {
      console.error(error);
    }
  }, [nickname, userPlantPage, userPlantSize]);

  /** 키우는 식물 리스트 이전 페이지 */
  async function prevUserPlantListPage() {
    let page = userPlantPage - 1;
    if (page < 0) return;
    else setUserPlantPage(page);
  }

  /** 키우는 식물 리스트 다음 페이지 */
  async function nextUserPlantListPage() {
    let page = userPlantPage + 1;

    if (page >= Math.ceil(Number(userPlantListTotalCount) / Number(userPlantSize))) return;
    else setUserPlantPage(page);
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

      {/* 내키식 라인 px-3 py-7 */}
      <div className='px-3 py-7'>
        <div className='flex justify-between items-center mb-7 mx-4'>
          <div className='text-md font-semibold'>키우는 식물 🌿</div>

          {isSameUser ? (
            <div
              className='flex items-center cursor-pointer border border-2 bg-black border-black rounded-full p-0.5'
              onClick={() => setIsOpenUserPlantCreateModal(true)}>
              <span className='material-symbols-outlined font-bold text-white' style={{ fontSize: '1.2rem' }}>
                add
              </span>
              <div className='pr-1 font-bold text-white' style={{ fontSize: '0.8rem' }}>
                ADD
              </div>
            </div>
          ) : null}
        </div>

        {userPlantList ? (
          userPlantList.length == 0 ? (
            <div className='mx-4 text-center text-sm py-4'>식물을 생성해주세요 🌱</div>
          ) : (
            <div className='flex flex-row space-x-4 items-center mx-4'>
              {userPlantPage == 0 ? (
                <span className='material-symbols-outlined cursor-default text-gray-200'>arrow_back_ios</span>
              ) : (
                <span className='material-symbols-outlined cursor-pointer' onClick={prevUserPlantListPage}>
                  arrow_back_ios
                </span>
              )}

              <div className='flex justify-around w-full'>
                {userPlantList?.map((userPlant) => (
                  <UserFeedPlantListItem key={userPlant.userPlantId} userPlant={userPlant} fetchUserPlantList={fetchUserPlantList} />
                ))}
              </div>

              {userPlantPage >= Math.ceil(Number(userPlantListTotalCount) / Number(userPlantSize)) - 1 ? (
                <span className='material-symbols-outlined cursor-default text-gray-200'>arrow_forward_ios</span>
              ) : (
                <span className='material-symbols-outlined cursor-pointer' onClick={nextUserPlantListPage}>
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
      </div>
    </>
  );
}
