import React, { useEffect, useRef, useState } from 'react';
import { useForm } from 'react-hook-form';
import { searchByPlantNameAndUser } from '@/core/plant/plantAPI';
import { createUserPlant, updateUserPlant } from '@/core/user/userAPI';
import { checkInputFormToast } from '@/lib/utils';
import AppButton from '../button/AppButton';
import styles from './UserPlantModal.module.scss';

type PropsType = {
  isOpen: boolean;
  title: string;
  userPlantId?: number;
  userPlantNickname?: string;
  create?: boolean;
  update?: boolean;
  handleModalClose: () => void;
  fetchUserPlantList: () => void;
};

type PlantType = {
  plantId: number;
  plantName: string;
};

const initialState = {
  plantNickname: '',
  searchPlantName: '',
};

export default function UserPlantModal({
  isOpen = false,
  create = false,
  update = false,
  userPlantId,
  userPlantNickname,
  title,
  handleModalClose,
  fetchUserPlantList,
}: PropsType) {
  const modalRef = useRef<HTMLDivElement>(null);

  const { register, setValue, getValues, watch } = useForm({ defaultValues: initialState, mode: 'onBlur' });
  const [plantNickname, searchPlantName] = getValues(['plantNickname', 'searchPlantName']);

  const [plantId, setPlantId] = useState<number>(-1);
  const [plantList, setPlantList] = useState<Array<PlantType>>(null);

  useEffect(() => {
    watch();
    return () => {
      setValue('searchPlantName', '');
    };
  }, []);

  useEffect(() => {
    setValue('plantNickname', userPlantNickname);
    return () => {};
  }, [userPlantNickname, plantId]);

  useEffect(() => {
    document.addEventListener('mousedown', handleModalOutsideClick);
    return () => {
      document.removeEventListener('mousedown', handleModalOutsideClick);
    };
  }, []);

  /** 모달 바깥 클릭 시 */
  function handleModalOutsideClick(e) {
    if (modalRef.current && !modalRef.current.contains(e.target)) handleModalClose();
  }

  /** 식물 이름으로 검색하는 함수 */
  async function searchByPlantName(searchPlant) {
    const { data } = await searchByPlantNameAndUser({ search: searchPlant });
    const content = data.content;
    const totalElements = data.totalElements;
    setPlantList(content);

    if (plantList) {
      plantList.forEach((p) => {
        if (p.plantName == searchPlant) {
          setPlantId(p.plantId);
        }
      });
    }
  }

  /** 검색한 식물 선택하는 함수 */
  async function handleUserPlantIdClick(selectPlantId, selectPlantName) {
    setPlantId(selectPlantId);
    setValue('searchPlantName', selectPlantName);
    setPlantList(null);
  }

  /** 키우는 식물 생성하는 함수 */
  async function handleUserPlantCreate() {
    if (plantId == -1 || !plantNickname) {
      checkInputFormToast();
      return;
    }

    try {
      const payload = { plantId, plantNickname };
      console.log('palnt::', payload);
      const { data } = await createUserPlant(payload);
      handleModalClose();
      await fetchUserPlantList();
      setValue('plantNickname', '');
      setValue('searchPlantName', '');
    } catch (error) {
      console.error(error);
    }
  }

  /** 키우는 식물 별명 수정하는 함수 */
  async function handleUserPlantNicknameUpdate() {
    if (plantNickname == '') {
      checkInputFormToast();
      return;
    }

    const payload = { plantNickname };
    const { data } = await updateUserPlant(userPlantId, payload);
    handleModalClose();
    fetchUserPlantList();
  }

  return (
    <div className='absolute top-0 left-0'>
      {isOpen ? (
        <div className='modalContainer'>
          <div className='modalWrap' ref={modalRef}>
            {/* 모달 내부 */}
            <div className='relative'>
              <span className='modalClose material-symbols-outlined' onClick={() => handleModalClose()}>
                close
              </span>
            </div>

            {/* 모달 컨텐츠 */}
            <div className='modalContent flex justify-between'>
              <div className='modalTitle mb-5'>{title}</div>

              {create ? (
                <div className='flex flex-col space-y-2'>
                  <div className='flex flex-col space-y-2'>
                    <label className='label'>식물 검색</label>
                    <input
                      type='text'
                      className='border-2 border-slate-200'
                      placeholder='식물 검색'
                      {...register('searchPlantName')}
                      onChange={(e) => searchByPlantName(e.target.value)}
                    />
                    {plantList ? (
                      plantList.length == 0 ? (
                        <div className={`${styles.searchContainer}`}>
                          <div className={`${styles.searchContent}`}>검색되는 식물이 없습니다</div>
                        </div>
                      ) : (
                        <div className={`${styles.searchContainer}`}>
                          <div className={`${styles.searchContent}`}>
                            {plantList.map((plant) => (
                              <div key={plant.plantId} onClick={() => handleUserPlantIdClick(plant.plantId, plant.plantName)}>
                                {plant.plantName}
                              </div>
                            ))}
                          </div>
                        </div>
                      )
                    ) : null}
                  </div>

                  <div className='flex flex-col space-y-2'>
                    <label className='label'>식물 별명</label>
                    <input type='text' className='border-2 border-slate-200' placeholder='식물 별명 짓기' {...register('plantNickname')} />
                  </div>
                </div>
              ) : null}

              {update ? (
                <div className='flex flex-col space-y-2'>
                  <label className='label'>식물 별명</label>
                  <input type='text' className='border-2 border-slate-200' placeholder='식물 별명 짓기' {...register('plantNickname')} />
                </div>
              ) : null}

              <div className='flex mt-20 space-x-2'>
                <AppButton text='취소' bgColor='thin' className='w-full' handleClick={handleModalClose} />
                {create ? <AppButton text='확인' className='w-full' handleClick={handleUserPlantCreate} /> : null}
                {update ? <AppButton text='확인' className='w-full' handleClick={handleUserPlantNicknameUpdate} /> : null}
              </div>
            </div>
          </div>
        </div>
      ) : null}
    </div>
  );
}
