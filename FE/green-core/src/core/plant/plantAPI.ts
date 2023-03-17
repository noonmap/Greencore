import { createAsyncThunk } from '@reduxjs/toolkit';
import http from '@/lib/http';
import { IndexType, SearchType } from './plantType';

import Toastify from 'toastify-js';
import message from '@/assets/message.json';
import toastifyCSS from '@/assets/toastify.json';

// 식물 이름 검색
export const searchByPlantName = createAsyncThunk('searchByPlantName', async (params: SearchType) => {
  try {
    const { data } = await http.get(`/plant`, { params });
    return data.data;
  } catch (error) {
    Toastify({
      text: message.SearchByPlantName,
      duration: 1500,
      position: 'center',
      stopOnFocus: true,
      style: toastifyCSS.fail,
    }).showToast();
  }
});
// 식물 이름 추가 검색
export const searchByPlantNameMore = createAsyncThunk('searchByPlantNameMore', async (params: SearchType) => {
  try {
    const { data } = await http.get(`/plant`, { params });
    return data.data;
  } catch (error) {
    Toastify({
      text: message.SearchByPlantName,
      duration: 1500,
      position: 'center',
      stopOnFocus: true,
      style: toastifyCSS.fail,
    }).showToast();
  }
});

// 식물 이름 검색 (내키식 생성 시)
export const searchByPlantNameAndUser = async (params: SearchType) => {
  try {
    const { data } = await http.get(`/plant/user`, { params });
    return data;
  } catch (error) {
    Toastify({
      text: message.SearchByPlantName,
      duration: 1500,
      position: 'center',
      stopOnFocus: true,
      style: toastifyCSS.fail,
    }).showToast();
  }
};

// 인기 식물 조회
export const getTopPlantList = async () => {
  const { data } = await http.get(`/plant/population`);
  return data;
};

// 식물 도감 이름 리스트 조회
export const getPlantList = async (params: SearchType) => {
  try {
    const { data } = await http.get(`/plant/dacs`, { params });
    return data;
  } catch (error) {
    Toastify({
      text: message.SearchByPlantName,
      duration: 1500,
      position: 'center',
      stopOnFocus: true,
      style: toastifyCSS.fail,
    }).showToast();
  }
};

// 식물 도감 리스트 조회
export const getPlantListByIndex = async (params: IndexType) => {
  try {
    const { data } = await http.get(`/plant/dacs`, { params });
    return data;
  } catch (error) {
    Toastify({
      text: message.SearchByPlantName,
      duration: 1500,
      position: 'center',
      stopOnFocus: true,
      style: toastifyCSS.fail,
    }).showToast();
  }
};

// 식물 도감 상세 조회
export const getPlant = async (plantId: number) => {
  const { data } = await http.get(`/plant/dacs/${plantId}`);
  return data;
};
