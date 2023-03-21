import { createAsyncThunk } from '@reduxjs/toolkit';
import http from '@/lib/http.js';
import Toastify from 'toastify-js';
import toastifyCSS from '@/assets/toastify.json';
import message from '@/assets/message.json';
import { MonthScheduleType } from './scheduleType';

// 월간 스케줄 받기, {day, month, year}
export const getMonthList = createAsyncThunk('getMonthList', async (requestData: MonthScheduleType) => {
  try {
    const { data } = await http.get(`/schedule?year=${requestData.year}&month=${requestData.month}`);
    return data;
  } catch (err) {
    console.log(err);
    return {};
  }
});
