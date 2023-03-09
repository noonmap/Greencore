import { createAsyncThunk } from "@reduxjs/toolkit";
import http from "@/lib/http.js";

// type, parameter
export const getAlertList = createAsyncThunk("getAlertList", async () => {
  const { data } = await http.get("http://localhost:3000/api/alert");

  // return data;
  if (data.result == "SUCCESS") {
    return data.data;
  } else {
    // 승태 TODO : FAIL일 때 처리 ??
    return [];
  }
});
