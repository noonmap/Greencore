import { createAsyncThunk } from "@reduxjs/toolkit";
import http from "@/lib/http.js";
import Toastify from "toastify-js";
import message from "@/assets/message.json";
import toastifyCSS from "@/assets/toastify.json";

// 알림 리스트 조회
export const getAlertList = createAsyncThunk("getAlertList", async () => {
  try {
    const { data } = await http.get("/alert");

    return data.data;
  } catch (err) {
    Toastify({
      text: message.GetAlertListFail,
      duration: 1500,
      position: "center",
      stopOnFocus: true,
      style: toastifyCSS.fail,
    }).showToast();

    console.error(err);

    return [];
  }
});

// 알림 삭제
export const deleteAlert = createAsyncThunk("deleteAlert", async (alertId: number) => {
  try {
    const { data } = await http.delete(`/alert/${alertId}`);

    return data.data;
  } catch (err) {
    Toastify({
      text: message.DeleteAlertFail,
      duration: 1500,
      position: "center",
      stopOnFocus: true,
      style: toastifyCSS.fail,
    }).showToast();

    console.error(err);

    return [];
  }
});
