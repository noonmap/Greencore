import { createSlice } from '@reduxjs/toolkit';
import { DiaryType } from './diaryType';
import * as diaryAPI from './diaryAPI';

interface DiaryState {
  isLoading: boolean;
  diaryList: Array<DiaryType>;
}

const initialState: DiaryState = {
  isLoading: true,
  diaryList: [],
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
        state.diaryList = action.payload;
      });
  },
});

export default diarySlice.reducer;
