import { createAsyncThunk } from "@reduxjs/toolkit";
import http from "@/lib/http.js";

// type, parameter
export const getPostList = createAsyncThunk("getPostList", async () => {
	const { data } = await http.get("/posts");
	return data;
});

// useSWR 사용
// export const getPostDetail = createAsyncThunk("getPostDetail", async (id: string | string[]) => {
// 	const { data } = await http.get(`/posts/${id}`);
// 	return data;
// });
