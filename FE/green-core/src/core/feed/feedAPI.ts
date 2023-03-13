import { createAsyncThunk } from '@reduxjs/toolkit';
import http from '@/lib/http';
import Toastify from 'toastify-js';
import message from '@/assets/message.json';
import toastifyCSS from '@/assets/toastify.json';

import { SearchType } from '@/core/common/commonType';
import { FeedDataType } from './feedType';

// 추천 피드 리스트 조회
export const getFeedList = createAsyncThunk('getFeedList', async (params: FeedDataType) => {
  try {
    const { data } = await http.get('/feed', { params });

    return data.data;
  } catch (error) {
    Toastify({
      text: message.GetFeedListFail,
      duration: 1500,
      position: 'center',
      stopOnFocus: true,
      style: toastifyCSS.fail,
    }).showToast();
  }
});

// 팔로우 피드 리스트 조회
export const getFollowFeedList = createAsyncThunk('getFollowFeedList', async (params: FeedDataType) => {
  try {
    const { data } = await http.get('/feed/follow', { params });

    return data.data;
  } catch (error) {
    Toastify({
      text: message.GetFeedListFail,
      duration: 1500,
      position: 'center',
      stopOnFocus: true,
      style: toastifyCSS.fail,
    }).showToast();
  }
});

// 태그검색 피드 리스트 조회
export const getTagFeedList = createAsyncThunk('getTagFeedList', async (params: FeedDataType) => {
  try {
    const { data } = await http.get('/feed/tag', { params });
    return data.data;
  } catch (error) {
    Toastify({
      text: message.GetTagFeedListFail,
      duration: 1500,
      position: 'center',
      stopOnFocus: true,
      style: toastifyCSS.fail,
    }).showToast();
  }
});

// 태그검색 피드 리스트 조회
export const getTagFeedListMore = createAsyncThunk('getTagFeedListMore', async (params: FeedDataType) => {
  try {
    const { data } = await http.get('/feed/tag', { params });

    return data.data;
  } catch (error) {
    Toastify({
      text: message.GetTagFeedListFail,
      duration: 1500,
      position: 'center',
      stopOnFocus: true,
      style: toastifyCSS.fail,
    }).showToast();
  }
});
