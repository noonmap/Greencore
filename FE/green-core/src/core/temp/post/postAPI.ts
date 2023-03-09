import { createAsyncThunk } from '@reduxjs/toolkit';
// import http from '@/lib/http.js';
import axios from 'axios';

// type, parameter
export const getPostList = createAsyncThunk('getPostList', async () => {
  const { data } = await axios.get('https://jsonplaceholder.typicode.com/posts');
  return data;
});

// useSWR 사용
// export const getPostDetail = createAsyncThunk("getPostDetail", async (id: string | string[]) => {
// 	const { data } = await http.get(`/posts/${id}`);
// 	return data;
// });
