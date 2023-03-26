import { deleteRegularSchedule, deleteSchedule } from '@/core/schedule/scheduleAPI';
import React, { useRef } from 'react';

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

  return (
    <>
      {isOpen ? (
        <div className='modalContainer'>
          <div className='modalWrap' ref={modalRef}>
            {/* 모달 내부 */}
            <div onClick={() => handleModalClose()}>X</div>

            {/* 모달 컨텐츠 */}
            <div className='modalTitle'>{modalTitle}</div>
            <div className='modalContent'>
              <div>삭제하시면 다시 되돌릴 수 없습니다.</div>
              <div>삭제 하시겠습니까?</div>
            </div>
            <button onClick={() => handleModalClose()}>취소</button>
            {scheduleId && <button onClick={() => handleScheduleDelete(scheduleId)}>확인</button>}
            {regularId && <button onClick={() => handleRegularScheduleDelete(regularId)}>확인</button>}
          </div>
        </div>
      ) : null}
    </>
  );
}
