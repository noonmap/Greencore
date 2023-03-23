import { useAppDispatch } from '@/core/hooks';
import { CancelToDo, CompleteToDo } from '@/core/schedule/scheduleAPI';
import { faCheck } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import React, { useState } from 'react';
import ScheduleCode from './ScheduleCode';

export default function ScheduleListItem({ item }) {
  const dispatch = useAppDispatch();
  const [isCompleted, setIsCompleted] = useState(item.isCompleted);

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
    <div style={{ display: 'flex', border: '1px solid', marginBlock: '8px' }}>
      <div style={{ borderRadius: '50%' }}>
        <ScheduleCode scheduleCode={item.scheduleCode} size='lg' />
      </div>
      {isCompleted ? (
        <>
          <div style={{ textDecoration: 'line-through' }}>{item.content}</div>
          <FontAwesomeIcon icon={faCheck} color='green' style={{ cursor: 'pointer' }} onClick={() => cancelToDo(item.scheduleId)} />
        </>
      ) : (
        <>
          <div>{item.content}</div>
          <FontAwesomeIcon icon={faCheck} color='gray' style={{ cursor: 'pointer' }} onClick={() => completeToDo(item.scheduleId)} />
        </>
      )}
    </div>
  );
}
