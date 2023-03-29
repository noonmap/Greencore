import { createSlice, PayloadAction } from '@reduxjs/toolkit';

// firebase
import firebaseConfig from '~/config/firebaseConfig.json';
import { initializeApp } from 'firebase/app';

import { UserInfoType } from './commonType';
import { logIn, deleteUser, logOut } from '@/core/user/userAPI';

interface CommonState {
  firebase: any;
  isLoading: boolean;
  userInfo: UserInfoType;
  searchState: string;
}

const firebase = initializeApp(firebaseConfig);

const initialState: CommonState = {
  firebase: firebase,
  isLoading: false,
  userInfo: null,
  searchState: 'home',
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
    SET_IS_SEARCH_STATE: (state, action: PayloadAction<string>) => {
      state.searchState = action.payload;
    },
  },

  extraReducers(builder) {
    builder
      .addCase(logIn.pending, (state) => {
        state.userInfo = null;
      })
      .addCase(logIn.fulfilled, (state, action) => {
        state.userInfo = action.payload?.userInfo;
      })
      .addCase(logOut.fulfilled, (state) => {
        state.userInfo = null;
      })
      .addCase(deleteUser.fulfilled, (state) => {
        state.userInfo = null;
      });
  },
});

export const { SET_IS_LOADING_TRUE, SET_IS_LOADING_FALSE, SET_IS_SEARCH_STATE } = commonSlice.actions;

export default commonSlice.reducer;
