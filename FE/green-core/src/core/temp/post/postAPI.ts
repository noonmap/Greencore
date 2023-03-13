import { createAsyncThunk } from '@reduxjs/toolkit';
import axios from 'axios';

// type, parameter
export const getPostList = createAsyncThunk('getPostList', async () => {
  const { data } = await axios.get('https://jsonplaceholder.typicode.com/posts');
  return data;
});
