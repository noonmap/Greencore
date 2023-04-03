import React, { useEffect, useRef } from 'react';
import { UserPlantType } from '@/core/user/userType';
import { useForm } from 'react-hook-form';
import { createDiarySet, updateDiarySet } from '@/core/diarySet/diarySetAPI';
import AppButton from '../button/AppButton';

type PropsType = {
  isOpen: boolean;
  modalTitle: string;
  diarySetId?: number;
  userPlantList?: Array<UserPlantType>;
  create?: boolean;
  update?: boolean;
  handleModalClose: () => void;
};

const initialState = {
  userPlantId: '1',
  image: null,
  title: '',
  startDate: '',
};

export default function DiaryModal({ isOpen, modalTitle, diarySetId, userPlantList, create, update, handleModalClose }: PropsType) {
  const modalRef = useRef<HTMLDivElement>(null);
  const { register, getValues, watch } = useForm({ defaultValues: initialState, mode: 'onChange' });
  const [userPlantId, title, startDate, image] = getValues(['userPlantId', 'title', 'startDate', 'image']);

  useEffect(() => {
    watch();
    document.addEventListener('mousedown', handleModalOutsideClick);
    return () => {
      document.removeEventListener('mousedown', handleModalOutsideClick);
    };
  }, []);

  function handleModalOutsideClick(e) {
    // 모달 바깥 클릭 시
    if (modalRef.current && !modalRef.current.contains(e.target)) handleModalClose();
  }

  /** 관찰일지 생성 함수 */
  async function handleDiarySetCreate() {
    try {
      const formData = new FormData();
      formData.append('userPlantId', userPlantId);
      formData.append('image', image[0]);
      formData.append('title', title);
      formData.append('startDate', startDate);
      const { data } = await createDiarySet(formData);
    } catch (error) {
      console.error(error);
    }
  }

  async function handleDiarySetUpdate() {
    try {
      const formData = new FormData();
      formData.append('userPlantId', String(userPlantId));
      formData.append('image', image[0]);
      formData.append('title', title);
      formData.append('startDate', startDate);
      const { data } = await updateDiarySet(diarySetId, formData);
    } catch (error) {
      console.error(error);
    }
  }

  return (
    <>
      {isOpen ? (
        <div className='modalContainer'>
          <div className='modalWrap' ref={modalRef}>
            {/* 모달 내부 */}
            <div className='relative'>
              <span className='modSSSalClose material-symbols-outlined' onClick={() => handleModalClose()}>
                close
              </span>
            </div>

            {/* 모달 컨텐츠 */}
            <div className='modalContent'>
              <div className='modalTitle mb-5'>{modalTitle}</div>

              <div className='flex flex-col space-y-2'>
                {create ? (
                  <div>
                    {userPlantList ? (
                      <select {...register('userPlantId')} className='w-full'>
                        {userPlantList.map((p) => (
                          <option key={p.userPlantId} value={p.userPlantId}>
                            {p.plantNickname}
                          </option>
                        ))}
                        S
                      </select>
                    ) : (
                      <>내가 키우는 식물을 생성하세요</>
                    )}
                  </div>
                ) : null}

                <input type='file' {...register('image')} />
                <input type='date' {...register('startDate')} />
                <input type='text' {...register('title')} placeholder='관찰일지명' />
              </div>

              <div className='flex mt-20 space-x-2'>
                <AppButton text='취소' bgColor='thin' className='w-full' handleClick={handleModalClose} />
                {create ? <AppButton text='확인' className='w-full' handleClick={handleDiarySetCreate} /> : null}
                {update ? <AppButton text='확인' className='w-full' handleClick={handleDiarySetUpdate} /> : null}
              </div>
            </div>
          </div>
        </div>
      ) : null}
    </>
  );
}
