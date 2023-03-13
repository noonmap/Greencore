import { createSlice } from '@reduxjs/toolkit';
import { FeedType } from './feedType';
import { getFeedList } from './feedAPI';

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

  reducers: {},

  extraReducers(builder) {
    builder
      .addCase(getFeedList.pending, (state) => {
        // state.isLoading = true;
      })
      .addCase(getFeedList.fulfilled, (state, action) => {
        if (action.payload.length === 0) {
          state.isStop = true;
        }
        state.page = state.page + 1;
        state.isLoading = false;
        state.feedList = [...state.feedList, ...action.payload];
      });
  },
});

export default feedSlice.reducer;
