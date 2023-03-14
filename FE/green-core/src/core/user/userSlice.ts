import { createSlice } from '@reduxjs/toolkit';
import * as userAPI from './userAPI';

interface UserState {
  isAuthenticated: boolean;
  isOAuth: boolean;
  accessToken: string | null;
}

const initialState: UserState = {
  isAuthenticated: false,
  isOAuth: false,
  accessToken: null,
};

const userSlice = createSlice({
  name: 'user',
  initialState,

  reducers: {
    SET_IS_OAUTH_TRUE: (state) => {
      state.isOAuth = true;
    },
    SET_IS_OAUTH_FALSE: (state) => {
      state.isOAuth = false;
    },
    SET_ACCESS_TOKEN: (state, action) => {
      state.accessToken = action.payload;
    },
  },

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

export const { SET_IS_OAUTH_TRUE, SET_IS_OAUTH_FALSE, SET_ACCESS_TOKEN } = userSlice.actions;
export default userSlice.reducer;
