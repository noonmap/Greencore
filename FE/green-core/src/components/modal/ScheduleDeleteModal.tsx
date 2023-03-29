import { deleteRegularSchedule, deleteSchedule } from '@/core/schedule/scheduleAPI';
import React, { useEffect, useRef } from 'react';
import AppButton from '../button/AppButton';
import styles from './ScheduleDeleteModal.module.scss';

type PropsType = {
  isOpen: boolean;
  modalTitle: string;
  scheduleId?: number;
  regularId?: number;
  handleModalClose: () => void;
  handleReload: () => void;
};

export default function ScheduleDeleteModal({ isOpen, modalTitle, scheduleId, regularId, handleModalClose, handleReload }: PropsType) {
  const modalRef = useRef<HTMLDivElement>(null);

  // 모달 바깥 클릭 시
  function handleModalOutsideClick(e: any) {
    if (modalRef.current && !modalRef.current.contains(e.target)) handleModalClose();
  }

  // 스케줄 삭제
  const handleScheduleDelete = async (scheduleId: number) => {
    const data = await deleteSchedule(scheduleId);
    console.log(scheduleId, data);
    if (data.result === 'SUCCESS') {
      handleReload();
      handleModalClose();
    }
  };

  // 정기스케줄 삭제
  const handleRegularScheduleDelete = async (regularId: number) => {
    const data = await deleteRegularSchedule(regularId);
    if (data.result === 'SUCCESS') {
      handleReload();
      handleModalClose();
    }
  };

  useEffect(() => {
    document.addEventListener('mousedown', handleModalOutsideClick);

    return () => {
      document.removeEventListener('mousedown', handleModalOutsideClick);
    };
  }, []);

  return (
    <>
      {isOpen ? (
        <div className='modalContainer'>
          <div className={`modalWrap`} ref={modalRef}>
            {/* 모달 내부 */}
            <div className='relative'>
              <span className='modalClose material-symbols-outlined' onClick={() => handleModalClose()}>
                close
              </span>
            </div>

            {/* 모달 컨텐츠 */}
            <div className={`modalContent flex justify-between ${styles.modalContentSub}`}>
              <div className='modalTitle'>{modalTitle}</div>

              <div>
                <div>삭제하시면 다시 되돌릴 수 없습니다.</div>
                <div>삭제 하시겠습니까?</div>
              </div>

              <div className={`flex justify-between`}>
                <AppButton text='취소' bgColor='thin' handleClick={() => handleModalClose()} />

                {scheduleId >= 0 && <AppButton text='확인' handleClick={() => handleScheduleDelete(scheduleId)} />}
                {regularId >= 0 && <AppButton text='확인' handleClick={() => handleRegularScheduleDelete(regularId)} />}
              </div>
            </div>
          </div>
        </div>
      ) : null}
    </>
  );
}
