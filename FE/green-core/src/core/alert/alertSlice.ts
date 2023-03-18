import { createSlice } from '@reduxjs/toolkit';
import { AlertType } from './alertType';
import * as alertAPI from './alertAPI';

interface AlertState {
  isLoading: boolean;

  // 검색용
  alertList: Array<AlertType>;
  isStoped: boolean;
  page: number;
}

const initialState: AlertState = {
  isLoading: true,
  alertList: [],
  isStoped: false,
  page: 0,
};

const alertSlice = createSlice({
  name: 'alret',
  initialState,

  reducers: {},

  // pending, fulfiiled, rejected, (state, action)
  extraReducers(builder) {
    builder
      .addCase(alertAPI.getAlertList.pending, (state) => {})
      .addCase(alertAPI.getAlertList.fulfilled, (state, action) => {
        state.isLoading = false;
        if (action.payload.length === 0) {
          state.isStoped = true;
        }
        state.page = 1;
        state.alertList = action.payload;
      })
      .addCase(alertAPI.getAlertListMore.pending, (state) => {})
      .addCase(alertAPI.getAlertListMore.fulfilled, (state, action) => {
        if (action.payload.length === 0) {
          state.isStoped = true;
        }
        state.page = state.page + 1;
        state.alertList = [...state.alertList, ...action.payload];
      });
  },
});

export default alertSlice.reducer;
