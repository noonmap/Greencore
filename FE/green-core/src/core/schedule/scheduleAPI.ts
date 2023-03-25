import { createAsyncThunk } from '@reduxjs/toolkit';
import http from '@/lib/http.js';
import Toastify from 'toastify-js';
import toastifyCSS from '@/assets/toastify.json';
import message from '@/assets/message.json';
import { CreateScheduleType, MonthScheduleType, UpdateScheduleType } from './scheduleType';

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

// 주간 스케줄 받기, {day, month, year}
export const getWeekList = createAsyncThunk('getWeekList', async (requestData: MonthScheduleType) => {
  try {
    const { data } = await http.get(`/schedule?year=${requestData.year}&month=${requestData.month}&day=${requestData.day}`);
    return data;
  } catch (err) {
    console.log(err);
    return {};
  }
});

// ToDo 완료, {scheduleId}
export const CompleteToDo = createAsyncThunk('CompleteToDo', async (requestData: { scheduleId: number }) => {
  try {
    const { data } = await http.post(`/schedule/${requestData.scheduleId}/done`);
    return data;
  } catch (err) {
    console.log(err);
    return {};
  }
});

// ToDo 취소, {scheduleId}
export const CancelToDo = createAsyncThunk('CancelToDo', async (requestData: { scheduleId: number }) => {
  try {
    const { data } = await http.put(`/schedule/${requestData.scheduleId}/done`);
    return data;
  } catch (err) {
    console.log(err);
    return {};
  }
});

// 스케줄 생성, { userPlantId, scheduleDate, scheduleCode, content, periodType }
export const createSchedule = async (payload: CreateScheduleType) => {
  try {
    const { data } = await http.post(`/schedule`, payload);
    if (data.result === 'SUCCESS') {
      Toastify({
        text: message.CreateDiarySuccess,
        duration: 1000,
        position: 'center',
        stopOnFocus: true,
        style: toastifyCSS.success,
      }).showToast();
    } else {
      Toastify({
        text: message.CreateDiaryFail,
        duration: 1000,
        position: 'center',
        stopOnFocus: true,
        style: toastifyCSS.fail,
      }).showToast();
    }
    return data;
  } catch (error) {}
};

// 스케줄 수정, {}
export const updateSchedule = async (requestData: UpdateScheduleType) => {
  try {
    const { data } = await http.post(`/schedule/${requestData.scheduleId}`, requestData.payload);
    if (data.result === 'SUCCESS') {
      Toastify({
        text: message.CreateDiarySuccess,
        duration: 1000,
        position: 'center',
        stopOnFocus: true,
        style: toastifyCSS.success,
      }).showToast();
    } else {
      Toastify({
        text: message.CreateDiaryFail,
        duration: 1000,
        position: 'center',
        stopOnFocus: true,
        style: toastifyCSS.fail,
      }).showToast();
    }
    return data;
  } catch (error) {}
};
