import { createAsyncThunk } from '@reduxjs/toolkit';
import http from '@/lib/http.js';
import { CreateDiaryType } from './diaryType';

// type, parameter
export const getDiaryList = createAsyncThunk('getDiaryList', async () => {
  try {
    const { data } = await http.get('https://jsonplaceholder.typicode.com/photos/');
    data.splice(100);
    return data;
  } catch (err) {
    console.log(err);
    return [];
  }
});

// 일지 생성, {diarySetId, content, tags, opservationDate, image}
export const createDiary = createAsyncThunk('createDiary', async (formData: FormData) => {
  console.log(formData);
  try {
    const { data } = await http.post(`/diary/${formData.diarySetId}`, formData);
    return data;
  } catch (err) {
    console.log(err);
    return '';
  }
});
