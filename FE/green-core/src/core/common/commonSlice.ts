import { createSlice } from '@reduxjs/toolkit';

// firebase
import firebaseConfig from '~/config/firebaseConfig.json';
import { initializeApp } from 'firebase/app';

interface CommonState {
  firebase: any;
  isLoading: boolean;
}

const firebase = initializeApp(firebaseConfig);

const initialState: CommonState = {
  firebase: firebase,
  isLoading: false,
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

  extraReducers(builder) {},
});

export const { SET_IS_LOADING_TRUE, SET_IS_LOADING_FALSE } = commonSlice.actions;
export default commonSlice.reducer;
