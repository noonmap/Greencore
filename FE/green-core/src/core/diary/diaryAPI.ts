import { createAsyncThunk } from '@reduxjs/toolkit';
import http from '@/lib/http.js';

// type, parameter
export const getDiaryList = createAsyncThunk('getDiaryList', async () => {

  try {
		const { data } = await http.get('https://jsonplaceholder.typicode.com/photos/');
		data.splice(100);
		return data;
	} catch (err) {
		console.log(err);
		return [];
	}
	
});
