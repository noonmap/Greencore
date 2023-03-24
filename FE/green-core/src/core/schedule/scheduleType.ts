import { NextRouter } from 'next/router';

// 월간 스케줄 타입
export type MonthScheduleType = {
  year: string;
  month: string;
  day: string;
};

// 스케줄 생성 타입
export type CreateScheduleType = {
  userPlantId: number;
  scheduleDate: string;
  scheduleCode: string;
  content: string;
  regularScheduleCode: string;
};

// 스케줄 수정 타입
export type UpdateScheduleType = {
  payload: {
    userPlantId: number;
    scheduleDate: string;
    scheduleCode: string;
    content: string;
    regularScheduleCode: string;
  };
  scheduleId: number;
};
