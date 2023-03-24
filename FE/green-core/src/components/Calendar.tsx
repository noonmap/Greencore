import React, { useState } from 'react';
import { format, addMonths, subMonths } from 'date-fns';
import { startOfMonth, endOfMonth, startOfWeek, endOfWeek } from 'date-fns';
import { isSameMonth, isSameDay, addDays, parse } from 'date-fns';
import styles from './Calendar.module.scss';
import ScheduleCode from './ScheduleCode';
import moment from 'moment';

const RenderHeader = ({ currentMonth, prevMonth, nextMonth }) => {
  return (
    <div className={`${styles.header} ${styles.row}`}>
      <div className={`${styles.col} ${styles.colStart}`}>
        <span className={`${styles.text}`}>
          <span className={`${styles.text} ${styles.month}`}>{format(currentMonth, 'M')}월</span>
          {format(currentMonth, 'yyyy')}
        </span>
      </div>
      <div className={`${styles.col} ${styles.colEnd}`}>
        <div onClick={prevMonth} style={{ cursor: 'pointer' }}>
          {'<'}
        </div>
        <div onClick={nextMonth} style={{ cursor: 'pointer' }}>
          {'>'}
        </div>
      </div>
    </div>
  );
};

const RenderDays = () => {
  const days = [];
  const date = ['Sun', 'Mon', 'Thu', 'Wed', 'Thrs', 'Fri', 'Sat'];

  for (let i = 0; i < 7; i++) {
    days.push(
      <div className={`${styles.col}`} key={i}>
        {date[i]}
      </div>
    );
  }

  return <div className={`${styles.days} ${styles.row}`}>{days}</div>;
};

const RenderCells = ({ currentMonth, selectedDate, onDateClick, marks, monthSchedule }) => {
  const monthStart = startOfMonth(currentMonth);
  const monthEnd = endOfMonth(monthStart);
  const startDate = startOfWeek(monthStart);
  const endDate = endOfWeek(monthEnd);

  const rows = [];
  let days = [];
  let day = startDate;
  let formattedDate = '';

  while (day <= endDate) {
    for (let i = 0; i < 7; i++) {
      formattedDate = format(day, 'd');
      const cloneDay = day;
      days.push(
        <div
          className={`${styles.col} ${styles.cell} ${
            !isSameMonth(day, monthStart)
              ? `${styles.disabled}`
              : isSameDay(day, selectedDate)
              ? `${styles.selected}`
              : format(currentMonth, 'M') !== format(day, 'M')
              ? `${styles.notValid}`
              : `${styles.valid}`
          }`}
          key={day.toISOString()}
          onClick={() => onDateClick(cloneDay)}>
          <span className={format(currentMonth, 'M') !== format(day, 'M') ? `${styles.text} ${styles.notValid}` : ''}>{formattedDate}</span>
          {marks.find((x: string) => x === moment(day).format('YYYY-MM-DD')) && (
            <div style={{ display: 'flex', flexWrap: 'wrap', margin: '4px' }}>
              {monthSchedule
                .filter((mark: { scheduleDate: string }) => mark.scheduleDate.slice(0, 10) === moment(day).format('YYYY-MM-DD'))
                .map((mark: { scheduleCode: any }, index: React.Key) => (
                  <div key={index} style={{ display: 'flex' }}>
                    <ScheduleCode scheduleCode={mark.scheduleCode} size='xs' />
                  </div>
                ))}
            </div>
          )}
        </div>
      );
      day = addDays(day, 1);
    }
    rows.push(
      <div className={`${styles.row}`} key={day.toISOString()}>
        {days}
      </div>
    );
    days = [];
  }
  return <div className={`${styles.body}`}>{rows}</div>;
};

export const Calender = ({ marks, monthSchedule, date, setDate, setReload }) => {
  const [currentMonth, setCurrentMonth] = useState(new Date());

  const prevMonth = () => {
    setReload((prev: boolean) => !prev);
    setCurrentMonth(subMonths(currentMonth, 1));
    const prevMonthFirstDate = new Date(date.getFullYear(), date.getMonth() - 1, 1);
    setDate(new Date(prevMonthFirstDate.getFullYear(), prevMonthFirstDate.getMonth() + 1, 0));
  };
  const nextMonth = () => {
    setReload((prev: boolean) => !prev);
    setCurrentMonth(addMonths(currentMonth, 1));
    setDate(new Date(date.getFullYear(), date.getMonth() + 1, 1));
  };
  const onDateClick = (day: any) => {
    if (moment(day).format('yyyyMMDD') !== moment(date).format('yyyyMMDD')) {
      setDate(day);
    }
  };
  return (
    <div className={`${styles.calendar}`}>
      <RenderHeader currentMonth={currentMonth} prevMonth={prevMonth} nextMonth={nextMonth} />
      <RenderDays />
      <RenderCells currentMonth={currentMonth} selectedDate={date} onDateClick={onDateClick} marks={marks} monthSchedule={monthSchedule} />
    </div>
  );
};
