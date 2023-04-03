import { createSlice } from '@reduxjs/toolkit';
import { FeedType, TagFeedType } from './feedType';
import { getFeedList, getFollowFeedList, getTagFeedList, getTagFeedListMore } from './feedAPI';

interface FeedState {
  isLoading: boolean;
  feedList: Array<FeedType>;
  isStoped: boolean;
  page: number;
  size: number;

  // 검색용
  tagFeedList: Array<TagFeedType>;
  isStopedAtTag: boolean;
  pageAtTag: number;
}

const initialState: FeedState = {
  isLoading: true,
  feedList: [],
  isStoped: false,
  page: 0,
  size: 10,

  // 검색용
  tagFeedList: [],
  isStopedAtTag: false,
  pageAtTag: 0,
};

const feedSlice = createSlice({
  name: 'feed',
  initialState,

  reducers: {
    initFeedList: (state) => {
      state.feedList = [];
      state.page = 0;
      state.isStoped = false;
    },
  },

  extraReducers(builder) {
    builder
      // 추천 피드 조회
      .addCase(getFeedList.pending, (state) => {})
      .addCase(getFeedList.fulfilled, (state, action) => {
        if (action.payload?.content.length < state.size) {
          state.isStoped = true;
        }
        state.page = state.page + 1;
        state.isLoading = false;
        state.feedList = [...state.feedList, ...action.payload?.content];
      })
      // 팔로우 피드 조회
      .addCase(getFollowFeedList.pending, (state) => {})
      .addCase(getFollowFeedList.fulfilled, (state, action) => {
        if (action.payload?.content.length < state.size) {
          state.isStoped = true;
        }
        state.page = state.page + 1;
        state.feedList = [...state.feedList, ...action.payload?.content];
      })
      // 태그 검색 초기 요청
      .addCase(getTagFeedList.pending, (state) => {})
      .addCase(getTagFeedList.fulfilled, (state, action) => {
        if (action.payload?.content.length < state.size) {
          state.isStopedAtTag = true;
        } else {
          state.pageAtTag = 1;
          state.tagFeedList = action.payload?.content;
        }
      })
      // 태그 검색 아이템 더 불러오기
      .addCase(getTagFeedListMore.pending, (state) => {})
      .addCase(getTagFeedListMore.fulfilled, (state, action) => {
        if (action.payload?.content.length < state.size) {
          state.isStopedAtTag = true;
        } else {
          state.pageAtTag = state.pageAtTag + 1;
          state.tagFeedList = [...state.tagFeedList, ...action.payload?.content];
        }
      });
  },
});
export const { initFeedList } = feedSlice.actions;
export default feedSlice.reducer;
