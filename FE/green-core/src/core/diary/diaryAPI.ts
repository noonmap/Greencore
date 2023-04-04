import { createAsyncThunk } from '@reduxjs/toolkit';
import http from '@/lib/http.js';
import Toastify from 'toastify-js';
import toastifyCSS from '@/assets/toastify.json';
import message from '@/assets/message.json';
import { CreateDiaryType, DeleteDiaryType, UpdateDiaryType } from './diaryType';

// 일지 리스트 받기, {diarySetId}
export const getDiaryList = createAsyncThunk('getDiaryList', async (diarySetId: number) => {
  try {
    console.log(diarySetId);
    const { data } = await http.get(`/diaryset/list/${diarySetId}`);
    return data;
  } catch (err) {
    console.log(err);
    return [];
  }
});

// 일지 상세 받기, {diaryId}
export const getDiaryDetail = async (diaryId: number) => {
  try {
    const { data } = await http.get(`/diary/${diaryId}`);
    return data;
  } catch (err) {
    console.log(err);
    return {};
  }
};

// 일지 생성, {diaryId, content, opservationDate, image, tags}
export const createDiary = createAsyncThunk('createDiary', async (requestData: CreateDiaryType) => {
  try {
    const router = requestData.router;
    const payload = requestData.payload;
    const headers = { 'Content-Type': 'multipart/form-data' };
    const { data } = await http.post(`/diaryset/${requestData.diarySetId}`, payload, { headers });
    if (data.result === 'SUCCESS') {
      Toastify({
        text: message.CreateDiarySuccess,
        duration: 1000,
        position: 'center',
        stopOnFocus: true,
        style: toastifyCSS.success,
      }).showToast();
      console.log(data);
      router.push(`/diaryset/list/${requestData.diarySetId}`);
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
  } catch (err) {
    console.log(err);
  }
});

// 일지 삭제, {diaryId}
export const deleteDiary = createAsyncThunk('deleteDiary', async (requestData: DeleteDiaryType) => {
  const router = requestData.router;
  try {
    const { data } = await http.delete(`/diary/${requestData.payload.diaryId}`);
    if (data.result === 'SUCCESS') {
      router.push(`/diaryset/list/${requestData.payload.diarySetId}`);
      Toastify({
        text: message.DeleteDiarySuccess,
        duration: 1000,
        position: 'center',
        stopOnFocus: true,
        style: toastifyCSS.success,
      }).showToast();
    } else {
      Toastify({
        text: message.DeleteDiaryFail,
        duration: 1000,
        position: 'center',
        stopOnFocus: true,
        style: toastifyCSS.fail,
      }).showToast();
    }
    return data;
  } catch (err) {
    console.log(err);
    return [];
  }
});

// 일지 수정, {diarysetId, content, opservationDate, image, tags}
export const updateDiary = createAsyncThunk('updateDiary', async (requestData: UpdateDiaryType) => {
  const router = requestData.router;
  try {
    const payload = requestData.payload;
    const headers = { 'Content-Type': 'multipart/form-data' };
    const { data } = await http.put(`/diary/${requestData.diaryId}`, payload, { headers });
    if (data.result === 'SUCCESS') {
      router.push(`/diary/${requestData.diaryId}`);
      Toastify({
        text: message.UpdateDiarySuccess,
        duration: 1000,
        position: 'center',
        stopOnFocus: true,
        style: toastifyCSS.success,
      }).showToast();
    } else {
      Toastify({
        text: message.UpdateDiaryFail,
        duration: 1000,
        position: 'center',
        stopOnFocus: true,
        style: toastifyCSS.fail,
      }).showToast();
    }
  } catch (err) {
    console.log(err);
  }
});
