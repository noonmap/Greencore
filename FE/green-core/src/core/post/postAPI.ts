import http from '@/lib/http';
import { createAsyncThunk } from '@reduxjs/toolkit';
import { CreatePostType, DeletePostType, UpdatePostType } from './postType';
import Toastify from 'toastify-js';
import toastifyCSS from '@/assets/toastify.json';
import message from '@/assets/message.json';
import { PageType } from '@/core/common/commonType';

// 포스트 생성, {content, image, tags}
export const createPost = createAsyncThunk('createPost', async (requestData: CreatePostType) => {
  try {
    const router = requestData.router;
    const payload = requestData.payload;
    const headers = { 'Content-Type': 'multipart/form-data' };
    const { data } = await http.post('/post', payload, { headers });
    if (data.result === 'SUCCESS') {
      Toastify({
        text: message.CreatePostSuccess,
        duration: 1000,
        position: 'center',
        stopOnFocus: true,
        style: toastifyCSS.success,
      }).showToast();
      router.push(`/post/${data.data.postId}`);
    } else {
      Toastify({
        text: message.CreatePostFail,
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

// 포스트 수정, {content, image, tags}
export const updatePost = createAsyncThunk('updatePost', async (requestData: UpdatePostType) => {
  try {
    const router = requestData.router;
    const payload = requestData.payload;
    const headers = { 'Content-Type': 'multipart/form-data' };
    const { data } = await http.put(`/post/${requestData.postId}`, payload, { headers });
    if (data.result === 'SUCCESS') {
      Toastify({
        text: message.UpdatePostSuccess,
        duration: 1000,
        position: 'center',
        stopOnFocus: true,
        style: toastifyCSS.success,
      }).showToast();
      router.push(`/post/${requestData.postId}`);
    } else {
      Toastify({
        text: message.UpdatePostFail,
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

// 포스트 삭제, {}
export const deletePost = createAsyncThunk('deletePost', async (requestData: DeletePostType) => {
  try {
    const router = requestData.router;
    const { data } = await http.delete(`/post/${requestData.postId}`);
    if (data.result === 'SUCCESS') {
      Toastify({
        text: message.DeletePostSuccess,
        duration: 1000,
        position: 'center',
        stopOnFocus: true,
        style: toastifyCSS.success,
      }).showToast();
      router.push(`/home`);
    } else {
      Toastify({
        text: message.DeletePostFail,
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

// 포스트 상세 조회
export const getPost = async (postId: number) => {
  try {
    const { data } = await http.get(`/post/${postId}`);
    return data;
  } catch (err) {
    console.log(err);
  }
};

/** 포스트 조회하는 함수 */
export const getPostList = async (nickname: string | string[], params: PageType) => {
  const { data } = await http.get(`/post/list/${nickname}`, { params });
  return data;
};

/** 포스트 삭제하는 함수 (without router) */
export const deleteSelectedPost = async (postId: any) => {
  const { data } = await http.delete(`/post/${postId}`);
  return data;
};
