import { createSlice } from '@reduxjs/toolkit';

interface DiarySetState {}

const initialState: DiarySetState = {};

const diarySetSlice = createSlice({
  name: 'diarySet',
  initialState,

  reducers: {},

  extraReducers(builder) {},
});

export default diarySetSlice.reducer;
