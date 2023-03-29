import React, { useEffect, useState } from 'react';
import AppLayout from '@/layout/AppLayout';
import 'react-calendar/dist/Calendar.css';
import { useAppDispatch } from '@/core/hooks';
import { getMonthList, getWeekList } from '@/core/schedule/scheduleAPI';
import moment from 'moment';
import 'moment/locale/ko';
import ScheduleModal from '@/components/modal/ScheduleModal';
import ScheduleManageModal from '@/components/modal/ScheduleManageModal';
import { Calender } from '@/components/Calendar';
import WeeklySchedule from '@/components/WeeklySchedule';
import styles from '@/styles/Schedule.module.scss';
import { SET_IS_SEARCH_STATE } from '@/core/common/commonSlice';

export default function schedule() {
  const dispatch = useAppDispatch();
  const [date, setDate] = useState(new Date());
  const [monthSchedule, setMonthSchedule] = useState([]);
  const [weekSchedule, setWeekSchedule] = useState({});
  const [marks, setMarks] = useState([]);
  const [reload, setReload] = useState(false);
  const [isOpenScheduleCreateModal, setIsOpenScheduleCreateModal] = useState(false);
  const [isOpenScheduleManageModal, setIsOpenScheduleManageModal] = useState(false);

  const requestData = { day: moment(date).format('DD'), month: moment(date).format('MM'), year: moment(date).format('YYYY') };

  // searchState 변경
  function changeSearchState() {
    dispatch(SET_IS_SEARCH_STATE('null'));
  }

  // 월간 스케줄
  const getMonthSchedule = async () => {
    const data = await dispatch(getMonthList(requestData));
    setMonthSchedule(data.payload.data);
    data.payload.data.map((mark: { scheduleDate: string }) => {
      setMarks((prev) => [...prev, moment(mark.scheduleDate).format('YYYY-MM-DD')]);
    });
  };

  // 월간 스케줄 GET
  useEffect(() => {
    getMonthSchedule();
    console.log('월간 GET');
    changeSearchState();
  }, [reload]);

  // 주간 스케줄
  const getWeekSchedule = async () => {
    const data = await dispatch(getWeekList(requestData));
    let sortedMap = {};
    for (let i = 0; i < data.payload.data.length; i++) {
      const schedule = data.payload.data[i];
      if (!Object.keys(sortedMap).includes(moment(schedule.scheduleDate).format('MD'))) {
        sortedMap[moment(schedule.scheduleDate).format('MD')] = [];
      }
      sortedMap[moment(schedule.scheduleDate).format('MD')] = [...sortedMap[moment(schedule.scheduleDate).format('MD')], schedule];
    }
    setWeekSchedule(sortedMap);
  };

  // 주간 스케줄 GET
  useEffect(() => {
    getWeekSchedule();
    console.log('주간 GET');
  }, [reload, date]);

  return (
    <AppLayout>
      {isOpenScheduleCreateModal && (
        <ScheduleModal
          isOpen={isOpenScheduleCreateModal}
          modalTitle='스케줄 생성'
          create
          handleReload={() => setReload((prev) => !prev)}
          handleModalClose={() => setIsOpenScheduleCreateModal(false)}
        />
      )}
      {isOpenScheduleManageModal && (
        <ScheduleManageModal
          isOpen={isOpenScheduleManageModal}
          weekSchedule={weekSchedule}
          handleReload={() => setReload((prev) => !prev)}
          handleModalClose={() => setIsOpenScheduleManageModal(false)}
        />
      )}
      <div className={`overflow-auto mx-auto flex flex-1 h-full`}>
        <div className={`${styles.container} overflow-auto flex-1 mx-auto pt-2 px-3`}>
          {/* 월간 스케줄 달력 */}
          <Calender
            marks={marks}
            monthSchedule={monthSchedule}
            date={date}
            setDate={setDate}
            setReload={setReload}
            setIsOpenScheduleCreateModal={setIsOpenScheduleCreateModal}
          />
        </div>
        <div className={`${styles.container2} lg:block hidden overflow-auto lg:w-1/3 pt-2`}>
          {/* 주간 스케줄 */}
          <WeeklySchedule weekSchedule={weekSchedule} setIsOpenScheduleManageModal={setIsOpenScheduleManageModal} />
        </div>
      </div>
    </AppLayout>
  );
}
