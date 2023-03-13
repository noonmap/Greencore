import { createSlice } from '@reduxjs/toolkit';
import * as userAPI from './userAPI';

export const TOKEN_TIME_OUT = 600 * 1000;

interface UserState {
  isAuthenticated: boolean;
  accessToken: string;
}

const initialState: UserState = {
  isAuthenticated: false,
  accessToken: null,
};

const userSlice = createSlice({
  name: 'user',
  initialState,

  reducers: {},

  extraReducers(builder) {
    builder
      .addCase(userAPI.logIn.pending, (state) => {
        state.isAuthenticated = false;
        state.accessToken = null;
      })
      .addCase(userAPI.logIn.fulfilled, (state, action) => {
        state.isAuthenticated = true;
        state.accessToken = action.payload?.accessToken;
      })
      .addCase(userAPI.logIn.rejected, (state) => {
        state.isAuthenticated = false;
        state.accessToken = null;
      })
      .addCase(userAPI.logOut.fulfilled, (state) => {
        state.isAuthenticated = false;
        state.accessToken = null;
      })
      .addCase(userAPI.getAccessToken.pending, (state) => {
        state.isAuthenticated = false;
        state.accessToken = null;
      })
      .addCase(userAPI.getAccessToken.fulfilled, (state, action) => {
        if (action.payload == false) state.isAuthenticated = false;
        else {
          state.isAuthenticated = true;
          state.accessToken = action.payload?.accessToken;
        }
      });
  },
});

export default userSlice.reducer;
