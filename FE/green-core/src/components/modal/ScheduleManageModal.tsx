import moment from 'moment';
import React, { useRef, useState } from 'react';
import ScheduleListItem from '../ScheduleListItem';

type PropsType = {
  isOpen: boolean;
  weekSchedule: any;
  handleReload: () => void;
  handleModalClose: () => void;
};

export default function ScheduleManage({ isOpen, weekSchedule, handleReload, handleModalClose }: PropsType) {
  const modalRef = useRef<HTMLDivElement>(null);
  const modalTitles = ['스케줄 관리', '정기스케줄 관리'];
  const [title, setTitle] = useState(modalTitles[0]);

  return (
    <>
      {isOpen ? (
        <div className='modalContainer'>
          <div className='modalWrap' ref={modalRef}>
            {/* 모달 내부 */}
            <div onClick={() => handleModalClose()}>X</div>

            {/* 모달 컨텐츠 */}
            <div style={{ display: 'flex', justifyContent: 'space-evenly', borderBottom: '1px solid' }}>
              {modalTitles.map((modalTitle) => (
                <button key={modalTitle} style={title === modalTitle ? { color: '#87D0A0' } : {}} onClick={() => setTitle(modalTitle)}>
                  {modalTitle}
                </button>
              ))}
            </div>
            {title === '스케줄 관리' && (
              <div className='modalContent'>
                {Object.keys(weekSchedule).length > 0 ? (
                  Object.keys(weekSchedule)
                    .sort()
                    .map((day: string) => {
                      return (
                        <div key={day}>
                          {moment(new Date()).format('YYYY-MM-DD') === weekSchedule[day][0].scheduleDate ? (
                            <div>오늘</div>
                          ) : moment(new Date().setDate(new Date().getDate() + 1)).format('YYYY-MM-DD') === weekSchedule[day][0].scheduleDate ? (
                            <div>내일</div>
                          ) : moment(new Date().setDate(new Date().getDate() + 2)).format('YYYY-MM-DD') === weekSchedule[day][0].scheduleDate ? (
                            <div>모레</div>
                          ) : (
                            <div>{moment(weekSchedule[day][0].scheduleDate).format('DD일')}</div>
                          )}
                          {weekSchedule[day].map((toDo: any, index: React.Key) => {
                            return (
                              <div key={index}>
                                <ScheduleListItem item={toDo} handleReload={handleReload} />
                              </div>
                            );
                          })}
                        </div>
                      );
                    })
                ) : (
                  <div>해당 일로부터 3일간 스케줄이 없습니다</div>
                )}
              </div>
            )}
            {title === '정기스케줄 관리' && (
              <div className='modalContent'>
                <div>정기스케줄 목록 받아와서 채워넣어야됨</div>
              </div>
            )}
          </div>
        </div>
      ) : null}
    </>
  );
}
