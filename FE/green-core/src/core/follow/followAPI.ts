import { createAsyncThunk } from '@reduxjs/toolkit';
import http from '@/lib/http';

// 팔로우하기
export const updateFollow = async (nickname: string | string[]) => {
	try {
		const { data } = await http.post(`/following/${nickname}`);
		return data;
	} catch (error) {
		console.error(error);
	}
};

// 언팔로우하기
export const deleteFollow = async (nickname: string | string[]) => {
	try {
		const { data } = await http.delete(`/following/${nickname}`);
		return data;
	} catch (error) {
		console.error(error);
	}
};
