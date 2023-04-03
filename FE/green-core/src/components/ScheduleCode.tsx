import { faDroplet, faSeedling, faCut, faFan, faSyringe, faSprayCanSparkles } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import React from 'react';

export default function ScheduleCode({ scheduleCode, size }) {
  const items = {
    SCHEDULE_WATER: (
      <>
        <FontAwesomeIcon icon={faDroplet} size={size} style={{ color: '#94b9ff' }} />
      </>
    ),
    SCHEDULE_REPOT: (
      <>
        <FontAwesomeIcon icon={faSeedling} size={size} />
      </>
    ),
    SCHEDULE_PRUNING: (
      <>
        <FontAwesomeIcon icon={faCut} size={size} />
      </>
    ),
    SCHEDULE_NUTRITION: (
      <>
        <FontAwesomeIcon icon={faSyringe} size={size} />
      </>
    ),
    SCHEDULE_VENTILATION: (
      <>
        <FontAwesomeIcon icon={faFan} size={size} />
      </>
    ),
    SCHEDULE_SPRAY: (
      <>
        <FontAwesomeIcon icon={faSprayCanSparkles} size={size} />
      </>
    ),
  };
  return (
    <div>
      <div>{items[scheduleCode]}</div>
    </div>
  );
}
