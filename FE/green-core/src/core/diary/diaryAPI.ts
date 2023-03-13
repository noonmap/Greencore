import { createAsyncThunk } from '@reduxjs/toolkit';
import http from '@/lib/http.js';

// 일지 리스트 받기, {diarySetId}
export const getDiaryList = createAsyncThunk('getDiaryList', async (diarySetId: number) => {
  try {
    const { data } = await http.get(`/diaryset/${diarySetId}`);
    return data;
  } catch (err) {
    console.log(err);
    return [];
  }
});
