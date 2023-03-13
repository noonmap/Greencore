import { createSlice } from '@reduxjs/toolkit';
import { FeedType } from './feedType';
import { getFeedList } from './feedAPI';

interface FeedState {
  isLoading: boolean;
  feedList: Array<FeedType>;
  isStop: boolean;
}

const initialState: FeedState = {
  isLoading: true,
  feedList: [],
  isStop: false,
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
        state.isLoading = false;
        state.feedList = [...state.feedList, ...action.payload];
      });
  },
});

export default feedSlice.reducer;
