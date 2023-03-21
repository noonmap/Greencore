import http from '@/lib/http';
import { createAsyncThunk } from '@reduxjs/toolkit';
import { CreatePostType, UpdatePostType } from './postType';
import Toastify from 'toastify-js';
import toastifyCSS from '@/assets/toastify.json';
import message from '@/assets/message.json';

// 포스트 생성, {content, image, tags}
export const createPost = createAsyncThunk('createPost', async (requestData: CreatePostType) => {
  try {
    const router = requestData.router;
    const { data } = await http.post('/post', requestData.payload);
    if (data.result === 'SUCCESS') {
      Toastify({
        text: message.CreateDiarySuccess,
        duration: 1000,
        position: 'center',
        stopOnFocus: true,
        style: toastifyCSS.success,
      }).showToast();
      router.push(`/post/${data.data.postId}`);
    } else {
      Toastify({
        text: message.CreateDiaryFail,
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
    const { data } = await http.put(`/post/${requestData.postId}`, requestData.payload);
    if (data.result === 'SUCCESS') {
      Toastify({
        text: message.CreateDiarySuccess,
        duration: 1000,
        position: 'center',
        stopOnFocus: true,
        style: toastifyCSS.success,
      }).showToast();
      router.push(`/post/${data.data.postId}`);
    } else {
      Toastify({
        text: message.CreateDiaryFail,
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
