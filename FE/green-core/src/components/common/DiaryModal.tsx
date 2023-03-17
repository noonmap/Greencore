import React, { useEffect, useRef } from 'react';
import { UserPlantType } from '@/core/user/userType';
import { useForm } from 'react-hook-form';
import { createDiarySet } from '@/core/diarySet/diarySetAPI';

type PropsType = {
  isOpen: boolean;
  userPlantList: Array<UserPlantType>;
  handleModalClose: () => void;
};

const initialState = {
  userPlantId: '1',
  image: null,
  title: '',
  startDate: '',
};

export default function DiaryModal({ isOpen, userPlantList, handleModalClose }: PropsType) {
  const modalRef = useRef<HTMLDivElement>(null);
  const { register, getValues, watch } = useForm({ defaultValues: initialState, mode: 'onChange' });
  const [userPlantId, title, startDate, image] = getValues(['userPlantId', 'title', 'startDate', 'image']);

  function handleModalOutsideClick(e) {
    // 모달 바깥 클릭 시
    if (modalRef.current && !modalRef.current.contains(e.target)) handleModalClose();
  }

  async function handleDiaryCreate() {
    try {
      const formData = new FormData();
      formData.append('userPlantId', userPlantId);
      formData.append('image', image[0]);
      formData.append('title', title);
      formData.append('startDate', startDate);
      formData.forEach((e) => console.log(e));

      const payload = { userPlantId, image: image[0], startDate, title };
      const { data } = await createDiarySet(payload);
      console.log(payload);
      console.log(data);
    } catch (error) {
      console.error(error);
    }
  }

  useEffect(() => {
    watch();
    document.addEventListener('mousedown', handleModalOutsideClick);

    return () => {
      document.removeEventListener('mousedown', handleModalOutsideClick);
    };
  }, []);

  return (
    <>
      {isOpen ? (
        <div className='modalContainer'>
          <div className='modalWrap' ref={modalRef}>
            {/* 모달 내부 */}
            <div onClick={() => handleModalClose()}>X</div>

            {/* 모달 컨텐츠 */}
            <div className='modalContent'>
              <div>관찰일지 생성</div>
              <input type='file' {...register('image')} />
              <input type='date' {...register('startDate')} />
              <div>
                {userPlantList ? (
                  <>
                    <select {...register('userPlantId')}>
                      {userPlantList.map((p) => (
                        <option key={p.userPlantId} value={p.userPlantId}>
                          {p.plantNickname}
                        </option>
                      ))}
                    </select>
                  </>
                ) : (
                  <>내가 키우는 식물을 생성하세요</>
                )}
              </div>

              <div className='flex'>
                <button onClick={() => handleModalClose()}>취소</button>
                <button onClick={handleDiaryCreate}>확인</button>
              </div>
            </div>
          </div>
        </div>
      ) : null}
    </>
  );
}
