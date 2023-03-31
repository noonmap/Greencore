import { createSlice } from '@reduxjs/toolkit';
import { SearchUserType } from './userType';
import * as userAPI from './userAPI';

interface UserState {
  // 검색용
  searchUserList: Array<SearchUserType>;
  isStopedAtUser: boolean;
  pageAtUser: number;
}

const initialState: UserState = {
  // 검색용
  searchUserList: [],
  isStopedAtUser: false,
  pageAtUser: 0,
};

const userSlice = createSlice({
  name: 'user',
  initialState,

  reducers: {},

  extraReducers(builder) {
    builder
      .addCase(userAPI.searchByUser.fulfilled, (state, action) => {
        if (action.payload.length === 0) {
          state.isStopedAtUser = true;
        }
        state.pageAtUser = 1;
        state.searchUserList = action.payload;
      })
      .addCase(userAPI.searchByUserMore.fulfilled, (state, action) => {
        if (action.payload.length === 0) {
          state.isStopedAtUser = true;
        }
        state.pageAtUser = state.pageAtUser + 1;
        state.searchUserList = [...state.searchUserList, ...action.payload];
      });
  },
});

export default userSlice.reducer;
