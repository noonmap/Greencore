import { createSlice } from '@reduxjs/toolkit';
import { AlertType } from './alertType';
import * as alertAPI from './alertAPI';

interface AlertState {
  isLoading: boolean;
  alertList: Array<AlertType>;
  size: number;
  page: number;
  lastPage: any;
}

const initialState: AlertState = {
  isLoading: true,
  alertList: [],
  size: 10,
  page: 0,
  lastPage: null,
};

const alertSlice = createSlice({
  name: 'alret',
  initialState,

  reducers: {},

  extraReducers(builder) {
    builder
      .addCase(alertAPI.getAlertList.pending, (state) => {
        state.isLoading = true;
        state.alertList = [];
      })
      .addCase(alertAPI.getAlertList.fulfilled, (state, action) => {
        state.isLoading = false;
        state.alertList = action.payload.alertList;
        state.lastPage = action.payload.lastPage;
      });
  },
});

export default alertSlice.reducer;
