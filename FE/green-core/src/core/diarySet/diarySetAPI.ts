import { DiarySetType } from './diarySetType';
import { createAsyncThunk } from '@reduxjs/toolkit';
import http from '@/lib/http';

import Toastify from 'toastify-js';
import message from '@/assets/message.json';
import toastifyCSS from '@/assets/toastify.json';
import { PageType } from '../common/commonType';
import { encodeNickname } from '@/lib/utils';

// 관찰일지 생성
export const createDiarySet = async (payload: FormData) => {
  try {
    const headers = { 'Content-Type': 'multipart/form-data' };
    const { data } = await http.post(`/diaryset`, payload, { headers });
    return data;
  } catch (error) {}
};

// 관찰일지 리스트 조회
export const getDiarySetList = async (nickname: string | string[], params: PageType) => {
  try {
    const { data } = await http.get(`/diaryset/${encodeNickname(nickname)}/list`, { params });
    return data;
  } catch (error) {}
};

// 관찰일지 수정
export const updateDiarySet = async (diarySetId: number, payload: FormData) => {
  try {
    const headers = { 'Content-Type': 'multipart/form-data' };
    payload.forEach((e) => console.log(e));
    const { data } = await http.put(`/diaryset/${diarySetId}`, payload, { headers });
    return data;
  } catch (error) {}
};

// 관찰일지 삭제
export const deleteDiarySet = async (diarySetId: number) => {
  try {
    const { data } = await http.delete(`/diaryset/${diarySetId}`);
    return data;
  } catch (error) {}
};

// 유저가 북마크한 관찰일지 목록 조회
export const getBookmarkedDiarySet = async (nickname: string, params: PageType) => {
  const { data } = await http.get(`/diaryset/${encodeNickname(nickname)}/bookmark`, { params });
  console.log(data);
  return data;
};

// 인기 관찰일지 목록 조회
export const getTopDiarySet = async () => {
  try {
    const { data } = await http.get(`/diaryset/population`);
    return data;
  } catch (error) {}
};

// 관찰일지 북마크
export const createBookmark = async (diarySetId: number) => {
  try {
    const { data } = await http.post(`/diaryset/${diarySetId}/bookmark`);
    return data;
  } catch (error) {}
};

// 관찰일지 북마크 취소
export const deleteBookmark = async (diarySetId: number) => {
  try {
    const { data } = await http.delete(`/diaryset/${diarySetId}/bookmark`);
    return data;
  } catch (error) {}
};
