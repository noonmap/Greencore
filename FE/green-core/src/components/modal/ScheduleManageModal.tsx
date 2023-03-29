import { getRegularSchedule } from '@/core/schedule/scheduleAPI';
import moment from 'moment';
import React, { useEffect, useRef, useState } from 'react';
import RegularScheduleListItem from '../RegularScheduleListItem';
import ScheduleListItem from '../ScheduleListItem';
import styles from './ScheduleManageModal.module.scss';

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
  const [regularScheduleList, setRegularScheduleList] = useState([]);

  // 모달 바깥 클릭 시
  function handleModalOutsideClick(e: any) {
    if (modalRef.current && !modalRef.current.contains(e.target)) handleModalClose();
  }

  // 정기스케줄 목록 가져오는 함수
  const getRegularScheduleList = async () => {
    const data = await getRegularSchedule();
    setRegularScheduleList(data.data);
  };

  // 정기스케줄 목록 가져오기
  useEffect(() => {
    getRegularScheduleList();

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
            <div className='relative'>
              <span className='modalClose material-symbols-outlined' onClick={() => handleModalClose()}>
                close
              </span>
            </div>

            {/* 모달 컨텐츠 */}
            <div className='modalContent flex justify-between'>
              <div className={`${styles.modalTitleList}`}>
                {modalTitles.map((modalTitle) => (
                  <button key={modalTitle} style={title === modalTitle ? { color: '#87D0A0' } : {}} onClick={() => setTitle(modalTitle)}>
                    {modalTitle}
                  </button>
                ))}
              </div>
              {title === '스케줄 관리' && (
                <div className={`modalContent ${styles.modalContentSub}`} style={{ width: '10px' }}>
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
                <div className={`modalContent ${styles.modalContentSub}`}>
                  {regularScheduleList.length > 0 ? (
                    regularScheduleList.map((regularSchedule) => {
                      return (
                        <div key={regularSchedule.regularScheduleId}>
                          <RegularScheduleListItem item={regularSchedule} handleReload={handleReload} />
                        </div>
                      );
                    })
                  ) : (
                    <div>정기스케줄이 없습니다</div>
                  )}
                </div>
              )}
            </div>
          </div>
        </div>
      ) : null}
    </>
  );
}
