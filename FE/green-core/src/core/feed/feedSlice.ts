import { createSlice } from '@reduxjs/toolkit';
import { FeedType } from './feedType';
import { getFeedList, getFollowFeedList } from './feedAPI';

interface FeedState {
  isLoading: boolean;
  feedList: Array<FeedType>;
  isStop: boolean;
  page: number;
}

const initialState: FeedState = {
  isLoading: true,
  feedList: [],
  isStop: false,
  page: 0,
};

const feedSlice = createSlice({
  name: 'feed',
  initialState,

  reducers: {
    initFeedList: (state) => {
      state.feedList = [];
      state.page = 0;
      state.isStop = false;
    },
  },

  extraReducers(builder) {
    builder
      .addCase(getFeedList.pending, (state) => {})
      .addCase(getFeedList.fulfilled, (state, action) => {
        if (action.payload.length === 0) {
          state.isStop = true;
        }
        state.page = state.page + 1;
        state.isLoading = false;
        state.feedList = [...state.feedList, ...action.payload];
      })
      .addCase(getFollowFeedList.pending, (state) => {})
      .addCase(getFollowFeedList.fulfilled, (state, action) => {
        if (action.payload.length === 0) {
          state.isStop = true;
        }
        state.page = state.page + 1;
        state.isLoading = false;
        state.feedList = [...state.feedList, ...action.payload];
      });
  },
});
export const { initFeedList } = feedSlice.actions;
export default feedSlice.reducer;
