import { createAsyncThunk } from '@reduxjs/toolkit';
import http from '@/lib/http';
import Toastify from 'toastify-js';
import message from '@/assets/message.json';
import toastifyCSS from '@/assets/toastify.json';

import { SearchType } from '@/core/common/commonType';
import { createCommentType, deleteCommentType, FeedDataType, getCommentListType, updateCommentType } from './feedType';

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

// 피드 좋아요
export const createLike = async (feedId: number) => {
  try {
    const { data } = await http.post(`/feed/${feedId}/like`);

    return data.data;
  } catch (error) {}
};

// 피드 좋아요 취소
export const deleteLike = async (feedId: number) => {
  try {
    const { data } = await http.delete(`/feed/${feedId}/like`);

    return data.data;
  } catch (error) {}
};

// 댓글 리스트 조회
export const getCommentList = createAsyncThunk('getCommentList', async (requestData: getCommentListType) => {
  try {
    const feedId = requestData.feedId;
    const page = requestData.page;
    const size = requestData.size;
    const { data } = await http.get(`/feed/${feedId}/comment`, { params: { page, size } });
    return data;
  } catch (err) {
    console.log(err);
  }
});

// 댓글 생성
export const createComment = createAsyncThunk('createComment', async (requestData: createCommentType) => {
  try {
    const feedId = requestData.feedId;
    const payload = requestData.payload;
    const { data } = await http.post(`/feed/${feedId}/comment`, payload);
    if (data.result === 'SUCCESS') {
      Toastify({
        text: message.CreateCommentSuccess,
        duration: 1000,
        position: 'center',
        stopOnFocus: true,
        style: toastifyCSS.success,
      }).showToast();
    } else {
      Toastify({
        text: message.CreateCommentFail,
        duration: 1000,
        position: 'center',
        stopOnFocus: true,
        style: toastifyCSS.fail,
      }).showToast();
    }
    return data;
  } catch (err) {
    console.log(err);
  }
});

// 댓글 수정
export const updateComment = createAsyncThunk('updateComment', async (requestData: updateCommentType) => {
  try {
    const feedId = requestData.feedId;
    const commentId = requestData.commentId;
    const payload = requestData.payload;
    const { data } = await http.put(`/feed/${feedId}/comment/${commentId}`, payload);
    if (data.result === 'SUCCESS') {
      Toastify({
        text: message.CreateCommentSuccess,
        duration: 1000,
        position: 'center',
        stopOnFocus: true,
        style: toastifyCSS.success,
      }).showToast();
    } else {
      Toastify({
        text: message.CreateCommentFail,
        duration: 1000,
        position: 'center',
        stopOnFocus: true,
        style: toastifyCSS.fail,
      }).showToast();
    }
    return data;
  } catch (err) {
    console.log(err);
  }
});

// 댓글 삭제
export const deleteComment = createAsyncThunk('deleteComment', async (requestData: deleteCommentType) => {
  try {
    const feedId = requestData.feedId;
    const commentId = requestData.commentId;
    const { data } = await http.delete(`/feed/${feedId}/comment/${commentId}`);
    if (data.result === 'SUCCESS') {
      Toastify({
        text: message.DeleteCommentSuccess,
        duration: 1000,
        position: 'center',
        stopOnFocus: true,
        style: toastifyCSS.success,
      }).showToast();
    } else {
      Toastify({
        text: message.DeleteCommentFail,
        duration: 1000,
        position: 'center',
        stopOnFocus: true,
        style: toastifyCSS.fail,
      }).showToast();
    }
    return data;
  } catch (err) {
    console.log(err);
  }
});
