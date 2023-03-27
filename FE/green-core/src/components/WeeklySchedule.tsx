import moment from 'moment';
import React from 'react';
import ScheduleListItem from './ScheduleListItem';
import styles from './WeeklySchedule.module.scss';

type PropsType = {
  weekSchedule: any;
  setIsOpenScheduleManageModal: (arg: boolean) => void;
};

export default function WeeklySchedule({ weekSchedule, setIsOpenScheduleManageModal }: PropsType) {
  return (
    <div className={`${styles.container}`}>
      <div style={{ display: 'flex' }}>
        <div className={`${styles.title}`}>
          주간 스케줄
          <span className={`material-symbols-outlined ${styles.icon}`} onClick={() => setIsOpenScheduleManageModal(true)}>
            settings
          </span>
        </div>
      </div>
      {Object.keys(weekSchedule).length > 0 ? (
        Object.keys(weekSchedule)
          .sort()
          .map((day: string) => {
            return (
              <div key={day}>
                {moment(new Date()).format('YYYY-MM-DD') === weekSchedule[day][0].scheduleDate ? (
                  <div className={`${styles.day}`}>오늘</div>
                ) : moment(new Date().setDate(new Date().getDate() + 1)).format('YYYY-MM-DD') === weekSchedule[day][0].scheduleDate ? (
                  <div className={`${styles.day}`}>내일</div>
                ) : moment(new Date().setDate(new Date().getDate() + 2)).format('YYYY-MM-DD') === weekSchedule[day][0].scheduleDate ? (
                  <div className={`${styles.day}`}>모레</div>
                ) : (
                  <div className={`${styles.day}`}>{moment(weekSchedule[day][0].scheduleDate).format('DD일')}</div>
                )}
                {weekSchedule[day].map((toDo: any, index: React.Key) => {
                  return (
                    <div key={index}>
                      <ScheduleListItem item={toDo} check />
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
  );
}
