import React, { useEffect, useState } from 'react';
import AppLayout from '@/layout/AppLayout';
import Calendar from 'react-calendar';
import 'react-calendar/dist/Calendar.css';
import { useAppDispatch, useAppSelector } from '@/core/hooks';
import { getMonthList } from '@/core/schedule/scheduleAPI';
import moment from 'moment';
import ScheduleCode from '@/components/ScheduleCode';

export default function schedule() {
  const dispatch = useAppDispatch();
  const [value, setValue] = useState(new Date());
  const [monthSchedule, setMonthSchedule] = useState([]);
  const [marks, setMarks] = useState([]);

  const requestData = { day: moment(value).format('DD'), month: moment(value).format('MM'), year: moment(value).format('YYYY') };
  console.log(monthSchedule);

  // 월간 스케줄
  const getMonthSchedule = async () => {
    const data = await dispatch(getMonthList(requestData));
    setMonthSchedule(data.payload.data);
    data.payload.data.map((mark: { scheduleDate: string }) => {
      setMarks((prev) => [...prev, moment(mark.scheduleDate).format('YYYY-MM-DD')]);
    });
  };

  useEffect(() => {
    getMonthSchedule();
  }, []);

  return (
    <AppLayout>
      <Calendar
        calendarType='US' // 요일을 일요일부터 시작하도록 설정
        onChange={setValue}
        value={value}
        minDetail='month' // 상단 네비게이션에서 '월' 단위만 보이게 설정
        maxDetail='month' // 상단 네비게이션에서 '월' 단위만 보이게 설정
        navigationLabel={null}
        showNeighboringMonth={false} //  이전, 이후 달의 날짜는 보이지 않도록 설정
        className='mx-auto w-full text-sm border-b'
        formatDay={(locale: any, date: moment.MomentInput) => moment(date).format('DD')}
        tileContent={({ date }) => {
          // 추가할 html 태그를 변수 초기화
          let html = [];

          // 현재 날짜가 post 작성한 날짜 배열(mark)에 있다면, dot div 추가
          if (marks.find((x) => x === moment(date).format('YYYY-MM-DD'))) {
            const filteredSchedule = monthSchedule.filter((mark) => mark.scheduleDate.slice(0, 10) === moment(date).format('YYYY-MM-DD'));

            // 스케줄 추가
            filteredSchedule.map((mark, index) => {
              html.push(
                <div key={index}>
                  {mark.scheduleDate.slice(11, 16)} <ScheduleCode scheduleCode={mark.scheduleCode} />
                </div>
              );
            });

            return (
              <>
                <div className=''>{html}</div>
              </>
            );
          }
        }}
      />
    </AppLayout>
  );
}
