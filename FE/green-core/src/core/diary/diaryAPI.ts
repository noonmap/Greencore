import { createAsyncThunk } from '@reduxjs/toolkit';
import http from '@/lib/http.js';

// type, parameter
export const getDiaryList = createAsyncThunk('getDiaryList', async () => {
  const { data } = await http.get('/photos');
  // console.log(data);
  data.splice(100);
  return data;
});
