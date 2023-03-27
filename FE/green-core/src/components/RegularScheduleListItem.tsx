import { faRemove } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import React, { useState } from 'react';
import ScheduleDeleteModal from './modal/ScheduleDeleteModal';
import ScheduleModal from './modal/ScheduleModal';
import ScheduleCode from './ScheduleCode';

type PropsType = {
  item: any;
  handleReload?: () => void;
};

export default function RegularScheduleListItem({ item, handleReload }: PropsType) {
  const [isOpenRegularScheduleUpdateModal, setIsOpenRegularScheduleUpdateModal] = useState(false);
  const [isOpenRegularScheduleDeleteModal, setIsOpenRegularScheduleDeleteModal] = useState(false);

  return (
    <>
      {isOpenRegularScheduleUpdateModal && (
        <ScheduleModal
          isOpen={isOpenRegularScheduleUpdateModal}
          modalTitle='정기스케줄 수정'
          regularId={item.regularScheduleId}
          regular
          handleReload={handleReload}
          handleModalClose={() => setIsOpenRegularScheduleUpdateModal(false)}
        />
      )}
      {isOpenRegularScheduleDeleteModal && (
        <ScheduleDeleteModal
          isOpen={isOpenRegularScheduleDeleteModal}
          modalTitle='정기스케줄 삭제'
          regularId={item.regularScheduleId}
          handleReload={handleReload}
          handleModalClose={() => setIsOpenRegularScheduleDeleteModal(false)}
        />
      )}
      <div style={{ display: 'flex', border: '1px solid', marginBlock: '8px' }}>
        <div style={{ borderRadius: '50%' }}>
          <ScheduleCode scheduleCode={item.scheduleCode} size='lg' />
        </div>
        <div onClick={() => setIsOpenRegularScheduleUpdateModal(true)} style={{ cursor: 'pointer' }}>
          {item.content}
        </div>
        <FontAwesomeIcon icon={faRemove} color='#D9D9D9' style={{ cursor: 'pointer' }} onClick={() => setIsOpenRegularScheduleDeleteModal(true)} />
      </div>
    </>
  );
}
