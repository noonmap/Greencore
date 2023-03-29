import React, { useState } from 'react';
import Image from 'next/image';
import { deleteUserPlant } from '@/core/user/userAPI';
import UserPlantModal from '@/components/modal/UserPlantModal';
import AppModal from './common/AppModal';
import styles from './UserFeedProfile.module.scss';

export default function UserFeedPlantListItem({ userPlant }) {
  const [userPlantId, setUserPlantId] = useState(null);
  const [userPlantNickname, setUserPlantNickname] = useState('');
  const [isEditPopUp, setIsEditPopUp] = useState(false);

  const [isOpenUserPlantUpdateModal, setIsOpenUserPlantUpdateModal] = useState(false);
  const [isOpenUserPlantDeleteModal, setIsOpenUserPlantDeleteModal] = useState(false);

  /** 키우는 식물 수정 모달 열기 함수 */
  function handleIsOpenUserPlantNicknameUpdate(userPlantId: number, plantNickname: string) {
    setUserPlantId(userPlantId);
    setUserPlantNickname(plantNickname);
    setIsOpenUserPlantUpdateModal(true);
  }

  /** 키우는 식물 삭제 모달 열기 함수 */
  function handleIsOpenUserPlantDelete(userPlantId: number) {
    setUserPlantId(userPlantId);
    setIsOpenUserPlantDeleteModal(true);
  }

  /** 키우는 식물 삭제 함수 */
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

  /** 수정/삭제 팝업 띄우는 함수 */
  function handleisEditToggle() {
    setIsEditPopUp(!isEditPopUp);
  }

  return (
    <>
      {/* 키우는 식물 수정 모달 */}
      <UserPlantModal
        isOpen={isOpenUserPlantUpdateModal}
        update
        userPlantId={userPlantId}
        userPlantNickname={userPlantNickname}
        title={'키우는 식물 정보 수정'}
        handleModalClose={() => setIsOpenUserPlantUpdateModal(false)}
      />

      {/* 키우는 식물 삭제 모달 */}
      <AppModal
        isOpen={isOpenUserPlantDeleteModal}
        title='삭제'
        handleModalClose={() => setIsOpenUserPlantDeleteModal(false)}
        handleModalConfirm={handleUserPlantDelete}
      />

      <div key={userPlant.userPlantId} className='mx-10 mt-2'>
        <div className='relative'>
          <div className='flex flex-col items-center'>
            <Image src='/images/noProfile.png' alt='사용자 식물' width={100} height={100} priority />
            <div className='mt-2 text-sm '>{userPlant.plantNickname}</div>
          </div>
          <span className='material-symbols-outlined md cursor-pointer absolute top-0 -right-5' onClick={handleisEditToggle}>
            more_vert
          </span>
        </div>

        {isEditPopUp ? (
          <div className='relative'>
            <div className={`popUp`}>
              <div onClick={() => handleIsOpenUserPlantNicknameUpdate(userPlant.userPlantId, userPlant.plantNickname)}>수정</div>
              <div onClick={() => handleIsOpenUserPlantDelete(userPlant.userPlantId)}>삭제</div>
            </div>
          </div>
        ) : null}
      </div>
    </>
  );
}
