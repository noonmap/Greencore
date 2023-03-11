import { createAsyncThunk } from '@reduxjs/toolkit';
import http from '@/lib/http.js';

// 일지 리스트 받기, {diarySetId}
export const getDiaryList = createAsyncThunk('getDiaryList', async (diarySetId: number) => {
  try {
    const { data } = await http.get(`/diary/${diarySetId}`);
    return data;
  } catch (err) {
    console.log(err);
    return [];
  }
});

// 일지 상세 조회, {diaryId}
export const getDiary = createAsyncThunk('getDiary', async (diaryId: number) => {
  try {
    const { data } = await http.get(`/diary/diaryDetail/${diaryId}`);
    return data;
  } catch (err) {
    console.log(err);
    return {};
  }
});

// 일지 생성, {diarySetId, content, tags, opservationDate, image}
export const createDiary = createAsyncThunk('createDiary', async (formData: FormData) => {
  try {
    const { data } = await http.post(`/diary/${formData.get('diarySetId')}`, formData);
    return data;
  } catch (err) {
    console.log(err);
    return '';
  }
});
