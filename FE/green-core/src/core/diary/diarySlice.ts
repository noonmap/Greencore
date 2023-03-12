import { createSlice } from '@reduxjs/toolkit';
import { DiaryType } from './diaryType';
import * as diaryAPI from './diaryAPI';

interface DiaryState {
  isLoading: boolean;
  diaryList: Array<DiaryType>;
  diarySet: Object;
}

const initialState: DiaryState = {
  isLoading: true,
  diaryList: [],
  diarySet: {},
};

const diarySlice = createSlice({
  name: 'diary',
  initialState,

  reducers: {},

  // pending, fulfilled, rejected, (state, action)
  extraReducers(builder) {
    builder
      .addCase(diaryAPI.getDiaryList.pending, (state) => {
        state.isLoading = true;
        state.diaryList = [];
      })
      .addCase(diaryAPI.getDiaryList.fulfilled, (state, action) => {
        state.isLoading = false;
        state.diaryList = action.payload.data.diaryList;
        state.diarySet = action.payload.data;
      });
  },
});

export default diarySlice.reducer;
