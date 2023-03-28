import React, { useEffect, useRef, useState } from 'react';
import { useForm } from 'react-hook-form';
import { searchByPlantNameAndUser } from '@/core/plant/plantAPI';
import { createUserPlant, updateUserPlant } from '@/core/user/userAPI';
import { checkInputFormToast } from '@/lib/utils';
import AppButton from '../button/AppButton';

type PropsType = {
  isOpen: boolean;
  title: string;
  userPlantId?: number;
  userPlantNickname?: string;
  create?: boolean;
  update?: boolean;
  handleModalClose: () => void;
};

type PlantType = {
  plantId: number;
  plantName: string;
};

const initialState = {
  plantNickname: '',
};

export default function UserPlantModal({
  isOpen = false,
  create = false,
  update = false,
  userPlantId,
  userPlantNickname,
  title,
  handleModalClose,
}: PropsType) {
  const modalRef = useRef<HTMLDivElement>(null);
  const { register, setValue, getValues, watch } = useForm({ defaultValues: initialState, mode: 'onBlur' });
  const [plantNickname] = getValues(['plantNickname']);
  const [plantId, setPlantId] = useState<number>(-1);
  const [plantList, setPlantList] = useState<Array<PlantType>>([]);

  async function searchByPlantName(searchPlant) {
    const { data } = await searchByPlantNameAndUser({ search: searchPlant });
    setPlantList(data);

    plantList.forEach((p) => {
      if (p.plantName == searchPlant) {
        setPlantId(p.plantId);
      }
    });

    console.log(data);
  }

  function handleModalOutsideClick(e) {
    // 모달 바깥 클릭 시
    if (modalRef.current && !modalRef.current.contains(e.target)) handleModalClose();
  }

  async function handleUserPlantCreate() {
    if (plantId == -1 || !plantNickname) {
      checkInputFormToast();
      return;
    }

    try {
      const payload = { plantId, plantNickname };
      const { data } = await createUserPlant(payload);
      console.log('payload:', payload);
      console.log(data);
    } catch (error) {
      console.error(error);
    }
  }

  async function handleUserPlantNicknameUpdate() {
    if (plantNickname == '') {
      checkInputFormToast();
      return;
    }

    const payload = { plantNickname };
    const { data } = await updateUserPlant(userPlantId, payload);
    console.log(data);
  }

  useEffect(() => {
    watch();
    setValue('plantNickname', userPlantNickname);
    document.addEventListener('mousedown', handleModalOutsideClick);
    return () => {
      document.removeEventListener('mousedown', handleModalOutsideClick);
    };
  }, [userPlantNickname, plantId]);

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
                      onChange={(e) => searchByPlantName(e.target.value)}
                    />
                    <div>
                      {plantList.map((plant) => (
                        <div key={plant.plantId}>
                          {plantId}
                          {JSON.stringify(plant)}
                        </div>
                      ))}
                    </div>
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
