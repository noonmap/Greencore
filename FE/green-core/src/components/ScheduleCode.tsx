import { faDroplet, faSeedling, faCut, faFan, faSyringe, faSprayCanSparkles } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import React from 'react';

export default function ScheduleCode({ scheduleCode, size }) {
  const items = {
    WATER: (
      <>
        <FontAwesomeIcon icon={faDroplet} size={size} style={{ color: '#94b9ff' }} />
      </>
    ),
    REPOT: (
      <>
        <FontAwesomeIcon icon={faSeedling} size={size} />
      </>
    ),
    PRUNING: (
      <>
        <FontAwesomeIcon icon={faCut} size={size} />
      </>
    ),
    NUTRITION: (
      <>
        <FontAwesomeIcon icon={faSyringe} size={size} />
      </>
    ),
    VENTILATION: (
      <>
        <FontAwesomeIcon icon={faFan} size={size} />
      </>
    ),
    SPRAY: (
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
