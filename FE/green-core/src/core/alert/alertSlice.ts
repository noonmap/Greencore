import { createSlice } from '@reduxjs/toolkit';
import { AlertType } from './alertType';
import * as alertAPI from './alertAPI';

interface AlertState {
  isLoading: boolean;
  alertList: Array<AlertType>;
}

const initialState: AlertState = {
  isLoading: true,
  alertList: [],
};

const alertSlice = createSlice({
  name: 'alret',
  initialState,

  reducers: {},

  // pending, fulfiiled, rejected, (state, action)
  extraReducers(builder) {
    builder
      .addCase(alertAPI.getAlertList.pending, (state) => {
        state.isLoading = true;
        // state.alertList = [];
      })
      .addCase(alertAPI.getAlertList.fulfilled, (state, action) => {
        state.isLoading = false;
        state.alertList = [...state.alertList, ...action.payload];
        // state.alertList = action.payload;
      });
  },
});

export default alertSlice.reducer;
