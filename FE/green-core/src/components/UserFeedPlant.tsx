import React, { useCallback, useEffect, useState } from 'react';
import Image from 'next/image';
import { deleteUserPlant, getUserPlantList } from '@/core/user/userAPI';
import UserPlantModal from '@/components/modal/UserPlantModal';
import AppModal from './common/AppModal';
import AppButton from './button/AppButton';

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
  const [isEditPopUp, setIsEditPopUp] = useState(false);
  const [isEditPopUp2, setIsEditPopUp2] = useState(false);

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

      // FIXME: 확인
      let temp = data.slice(userPlantPage, userPlantPage + userPlantSize);
      setUserPlantList(temp);
    } catch (error) {
      console.error(error);
    }
  }, [nickname, userPlantPage, userPlantSize]);

  function handleIsOpenUserPlantNicknameUpdate(userPlantId: number, plantNickname: string) {
    setUserPlantId(userPlantId);
    setUserPlantNickname(plantNickname);
    setIsOpenUserPlantUpdateModal(true);
  }

  function handleIsOpenUserPlantDelete(userPlantId: number) {
    setUserPlantId(userPlantId);
    setIsOpenUserPlantDeleteModal(true);
  }

  async function handleUserPlantDelete() {
    try {
      const { data } = await deleteUserPlant(userPlantId);
      setIsOpenUserPlantDeleteModal(false);
      console.log(data);
    } catch (error) {
      console.error(error);
      setIsOpenUserPlantDeleteModal(false);
    }
  }

  async function prevUserPlantListPage() {
    let page = userPlantPage - userPlantSize;
    if (page < 0) return;

    setUserPlantPage(page);
    await fetchUserPlantList();
  }

  async function nextUserPlantListPage() {
    let page = userPlantPage + userPlantSize;
    if (page >= userPlantListTotalCount) return;

    setUserPlantPage(page);
    await fetchUserPlantList();
  }

  function handleisEditToggle() {
    setIsEditPopUp(!isEditPopUp);
  }

  function handleisEditToggle2() {
    setIsEditPopUp2(!isEditPopUp2);
  }

  return (
    <>
      <UserPlantModal
        isOpen={isOpenUserPlantCreateModal}
        create
        title={'내식물 생성'}
        handleModalClose={() => setIsOpenUserPlantCreateModal(false)}
      />
      <UserPlantModal
        isOpen={isOpenUserPlantUpdateModal}
        update
        userPlantId={userPlantId}
        userPlantNickname={userPlantNickname}
        title={'내식물 정보 수정'}
        handleModalClose={() => setIsOpenUserPlantUpdateModal(false)}
      />
      <AppModal
        isOpen={isOpenUserPlantDeleteModal}
        title='내 식물 삭제'
        handleModalClose={() => setIsOpenUserPlantDeleteModal(false)}
        handleModalConfirm={handleUserPlantDelete}
      />

      {/* 내키식 라인 */}
      <div className='space-y-2 '>
        <button className='rounded bg-blue-500' onClick={() => setIsOpenUserPlantCreateModal(true)}>
          내키식 생성
        </button>

        {userPlantList ? (
          userPlantList.length < 0 ? (
            <div>빈 userPlant</div>
          ) : (
            <div className='flex flex-row space-x-4'>
              <button className='bg-blue-500 rounded' onClick={prevUserPlantListPage}>
                이전
              </button>

              {userPlantList.map((userPlant) => (
                <div key={userPlant.userPlantId}>
                  <Image src='/images/noProfile.png' alt='사용자 식물' width={70} height={70} priority />
                  <div>{userPlant.plantNickname}</div>
                  <span className='material-symbols-outlined' onClick={handleisEditToggle}>
                    more_vert
                  </span>

                  {isEditPopUp ? (
                    <div>
                      <div onClick={() => handleIsOpenUserPlantNicknameUpdate(userPlant.userPlantId, userPlant.plantNickname)}>
                        내키식 닉네임 수정
                      </div>
                      <div onClick={() => handleIsOpenUserPlantDelete(userPlant.userPlantId)}>내키식 삭제</div>
                    </div>
                  ) : null}
                </div>
              ))}

              <button className='bg-blue-500 rounded' onClick={nextUserPlantListPage}>
                다음
              </button>
            </div>
          )
        ) : (
          <div>아직 생성하지않았음</div>
        )}
      </div>
    </>
  );
}
