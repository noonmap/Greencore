import { createSlice } from "@reduxjs/toolkit";
import * as AlertType from "./alertType";
import * as AlertAPI from "./alertAPI";

interface AlertState {
  isLoading: boolean;
  alertList: Array<AlertType.AlertItem>;
}

const initialState: AlertState = {
  isLoading: true,
  alertList: [],
};

const alertSlice = createSlice({
  name: "alret",
  initialState,

  reducers: {},

  // pending, fulfiiled, rejected, (state, action)
  extraReducers(builder) {
    builder
      .addCase(AlertAPI.getAlertList.pending, (state) => {
        state.isLoading = true;
        state.alertList = [];
      })
      .addCase(AlertAPI.getAlertList.fulfilled, (state, action) => {
        state.isLoading = false;
        state.alertList = action.payload;
      });
  },
});

export default alertSlice.reducer;
