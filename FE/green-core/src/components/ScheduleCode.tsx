import { faDroplet } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import React from 'react';

export default function ScheduleCode({ scheduleCode }) {
  const items = {
    WATER: (
      <>
        <FontAwesomeIcon icon={faDroplet} />
      </>
    ),
    REPOT: <div>분갈이</div>,
    PRUNING: <div>가지치기</div>,
    NUTRITION: <div>영양관리</div>,
    VENTILATION: <div>환기하기</div>,
    SPRAY: <div>분무하기</div>,
  };
  return (
    <div>
      <div>{items[scheduleCode]}</div>
    </div>
  );
}
