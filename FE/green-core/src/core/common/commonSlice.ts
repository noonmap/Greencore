import { createSlice } from '@reduxjs/toolkit';
// firebase
import firebaseConfig from '~/config/firebaseConfig.json';
import { initializeApp } from 'firebase/app';

import { UserInfoType } from './commonType';
import { logIn, deleteUser } from '@/core/user/userAPI';

interface CommonState {
  firebase: any;
  isLoading: boolean;
  userInfo: UserInfoType;
}

const firebase = initializeApp(firebaseConfig);

const initialState: CommonState = {
  firebase: firebase,
  isLoading: false,
  userInfo: null,
};

const commonSlice = createSlice({
  name: 'common',
  initialState,

  reducers: {
    SET_IS_LOADING_TRUE: (state) => {
      state.isLoading = true;
    },
    SET_IS_LOADING_FALSE: (state) => {
      state.isLoading = false;
    },
  },

  extraReducers(builder) {
    builder
      .addCase(logIn.pending, (state) => {
        state.userInfo = null;
      })
      .addCase(logIn.fulfilled, (state, action) => {
        state.userInfo = action.payload.userInfo;
      })
      .addCase(deleteUser.fulfilled, (state) => {
        state.userInfo = null;
      });
  },
});

export const { SET_IS_LOADING_TRUE, SET_IS_LOADING_FALSE } = commonSlice.actions;

export default commonSlice.reducer;
