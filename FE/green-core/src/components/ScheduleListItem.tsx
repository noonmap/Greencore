import { useAppDispatch } from '@/core/hooks';
import { CancelToDo, CompleteToDo } from '@/core/schedule/scheduleAPI';
import { faCheck, faRemove } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import React, { useState } from 'react';
import ScheduleDeleteModal from './modal/ScheduleDeleteModal';
import ScheduleModal from './modal/ScheduleModal';
import ScheduleCode from './ScheduleCode';
import styles from './ScheduleListItem.module.scss';

type PropsType = {
  item: any;
  check?: boolean;
  handleReload?: () => void;
};

export default function ScheduleListItem({ item, check, handleReload }: PropsType) {
  const dispatch = useAppDispatch();
  const [isCompleted, setIsCompleted] = useState(item.isCompleted);
  const [isOpenCheckDeleteModal, setIsOpenCheckDeleteModal] = useState(false);
  const [isOpenScheduleUpdateModal, setIsOpenScheduleUpdateModal] = useState(false);

  // ToDo 완료
  const completeToDo = async (scheduleId: number) => {
    const data = await dispatch(CompleteToDo({ scheduleId }));
    if (data.payload.result === 'SUCCESS') {
      setIsCompleted(true);
    }
  };

  // Todo 취소
  const cancelToDo = async (scheduleId: number) => {
    const data = await dispatch(CancelToDo({ scheduleId }));
    if (data.payload.result === 'SUCCESS') {
      setIsCompleted(false);
    }
  };

  return (
    <>
      {isOpenScheduleUpdateModal && (
        <ScheduleModal
          isOpen={isOpenScheduleUpdateModal}
          modalTitle='스케줄 수정'
          scheduleId={item.scheduleId}
          schedule={item}
          update
          handleReload={handleReload}
          handleModalClose={() => setIsOpenScheduleUpdateModal(false)}
        />
      )}
      {isOpenCheckDeleteModal && (
        <ScheduleDeleteModal
          isOpen={isOpenCheckDeleteModal}
          modalTitle='스케줄 삭제'
          scheduleId={item.scheduleId}
          handleModalClose={() => setIsOpenCheckDeleteModal(false)}
          handleReload={handleReload}
        />
      )}
      <div className={`${styles.container}`}>
        <div className={`${styles.icon}`}>
          <ScheduleCode scheduleCode={item.scheduleCode} size='lg' />
        </div>
        {check ? (
          isCompleted ? (
            <>
              <div className={`${styles.text}`}>{item.content}</div>
              <FontAwesomeIcon icon={faCheck} color='#4FC577' className={`${styles.check}`} onClick={() => cancelToDo(item.scheduleId)} />
            </>
          ) : (
            <>
              <div className={`${styles.text}`}>{item.content}</div>
              <FontAwesomeIcon icon={faCheck} color='#D9D9D9' className={`${styles.check}`} onClick={() => completeToDo(item.scheduleId)} />
            </>
          )
        ) : (
          <>
            <div onClick={() => setIsOpenScheduleUpdateModal(true)} style={{ cursor: 'pointer' }} className={`${styles.text}`}>
              {item.content}
            </div>
            <FontAwesomeIcon icon={faRemove} color='#D9D9D9' className={`${styles.check}`} onClick={() => setIsOpenCheckDeleteModal(true)} />
          </>
        )}
      </div>
    </>
  );
}
