import React, { useEffect, useState } from 'react';
import AppLayout from '@/layout/AppLayout';
import Calendar from 'react-calendar';
import 'react-calendar/dist/Calendar.css';
import { useAppDispatch } from '@/core/hooks';
import { getMonthList, getWeekList } from '@/core/schedule/scheduleAPI';
import moment from 'moment';
import 'moment/locale/ko';
import ScheduleCode from '@/components/ScheduleCode';
import ScheduleListItem from '@/components/ScheduleListItem';

export default function schedule() {
  const dispatch = useAppDispatch();
  const [value, setValue] = useState(new Date());
  const [monthSchedule, setMonthSchedule] = useState([]);
  const [weekSchedule, setWeekSchedule] = useState({});
  const [marks, setMarks] = useState([]);
  const [isOpen, setIsOpen] = useState(false);

  const requestData = { day: moment(value).format('DD'), month: moment(value).format('MM'), year: moment(value).format('YYYY') };

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
  }, []);

  // 주간 스케줄
  const getWeekSchedule = async () => {
    const data = await dispatch(getWeekList(requestData));
    let sortedMap = {};
    for (let i = 0; i < data.payload.data.length; i++) {
      const schedule = data.payload.data[i];
      if (!Object.keys(sortedMap).includes(moment(schedule.scheduleDate).format('d'))) {
        sortedMap[moment(schedule.scheduleDate).format('d')] = [];
      }
      sortedMap[moment(schedule.scheduleDate).format('d')] = [...sortedMap[moment(schedule.scheduleDate).format('d')], schedule];
    }
    setWeekSchedule(sortedMap);
  };

  // 주간 스케줄 GET
  useEffect(() => {
    getWeekSchedule();
  }, []);

  return (
    <AppLayout>
      <div style={{ display: 'flex' }}>
        <div>
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

                // 스케줄 요소 추가
                filteredSchedule.map((mark, index) => {
                  html.push(
                    <div key={index} style={{ display: 'flex' }}>
                      <ScheduleCode scheduleCode={mark.scheduleCode} size='xs' />
                    </div>
                  );
                });

                return (
                  <>
                    <div style={{ display: 'flex', flexWrap: 'wrap', margin: '4px' }}>{html}</div>
                  </>
                );
              }
            }}
          />
        </div>
        <div>
          <div style={{ display: 'flex' }}>
            <div>주간 스케줄</div>
          </div>
          {Object.keys(weekSchedule)
            .sort()
            .map((day: string) => {
              return (
                <div key={day}>
                  <div>{moment(weekSchedule[day][0].scheduleDate).format('dddd')}</div>
                  {weekSchedule[day].map((toDo: any, index: React.Key) => {
                    return (
                      <div key={index}>
                        <ScheduleListItem item={toDo} />
                      </div>
                    );
                  })}
                </div>
              );
            })}
        </div>
      </div>
    </AppLayout>
  );
}
