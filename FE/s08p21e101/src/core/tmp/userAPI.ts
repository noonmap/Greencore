import { createAsyncThunk } from "@reduxjs/toolkit";
import http from "@/common/axios";

export const logIn = createAsyncThunk("users/logIn", async (id: number) => {
  const { data } = await http.get(`/users/${id}`);
  console.log(data);
  return data;
});
