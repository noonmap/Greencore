import { createAsyncThunk } from '@reduxjs/toolkit';
import http from '@/lib/http';
import Toastify from 'toastify-js';
import message from '@/assets/message.json';
import toastifyCSS from '@/assets/toastify.json';

import { SearchType } from '@/core/common/commonType';
import { SignUpDataType, LogInDataType, PasswordType, ProfileType, UserPlantType } from './userType';

// 회원가입
export const signUp = async (payload: SignUpDataType) => {
	/* "background": "linear-gradient(to right, #00b09b, #96c93d)",*/
	// "background": "linear-gradient(to top, #c1dfc4 0%, #deecdd 100%)",

	try {
		const { data } = await http.post('/user', payload);

		Toastify({
			text: message.SignUpSuccess,
			duration: 1500,
			position: 'center',
			stopOnFocus: true,
			style: toastifyCSS.success
		}).showToast();

		return data;
	} catch (err) {
		Toastify({
			text: message.SignUpFail,
			duration: 1500,
			position: 'center',
			stopOnFocus: true,
			style: toastifyCSS.fail
		}).showToast();
	}
};

// 회원탈퇴
export const deleteUser = createAsyncThunk('deleteUser', async () => {
  const { data } = await http.delete(`/user`);
  return data;
});

// 로그인
export const logIn = createAsyncThunk('logIn', async (payload: LogInDataType) => {
  const { data } = await http.post('/login', payload);
  return data;
});

// 닉네임 중복 확인
export const checkNickname = createAsyncThunk('checkNickname', async (nickname: string) => {
  const { data } = await http.get(`/login/${nickname}`);
  return data;
});

// 회원정보 조회 (현재 비밀번호 확인)
export const checkPassword = createAsyncThunk('checkPassword', async (payload: PasswordType) => {
  const { data } = await http.post(`/user/password`, payload);
  return data;
});

// 회원정보 수정 (현재 비밀번호 수정)
export const updatePassword = createAsyncThunk('updatePassword', async (payload: PasswordType) => {
  const { data } = await http.put(`/user/password`, payload);
  return data;
});

// 회원 프로필 조회
export const getProfile = createAsyncThunk('getProfile', async (nickname: string) => {
  const { data } = await http.get(`/profile/${nickname}`);
  return data;
});

// 회원 프로필 수정
export const updateProfile = createAsyncThunk('updateProfile', async (payload: ProfileType) => {
  const { data } = await http.put(`/profile`, payload);
  return data;
});

// 회원 프로필 이미지 수정
export const updateProfileImage = createAsyncThunk('updateProfileImage', async (payload: ProfileType) => {
  const { data } = await http.put(`/profile/img`, payload);
  return data;
});

// 키우는 식물 리스트 조회
export const getUserPlantList = createAsyncThunk('getUserPlantList', async (nickname: string) => {
  const { data } = await http.get(`/user/plant/${nickname}`);
  return data;
});

// 키우는 식물 생성
export const createUserPlant = createAsyncThunk('createUserPlant', async (payload: UserPlantType) => {
  const { data } = await http.post(`/user/plant`, payload);
  return data;
});

// 키우는 식물 삭제
export const deleteUserPlant = createAsyncThunk('deleteUserPlant', async (userPlantId: number) => {
  const { data } = await http.delete(`/user/plant/${userPlantId}`);
  return data;
});

// 키우는 식물 닉네임 수정
export const updateUserPlant = createAsyncThunk('updateUserPlant', async (userPlantId: number) => {
  const { data } = await http.put(`/user/plant/${userPlantId}`);
  return data;
});

// 사용자 검색
export const searchByUser = createAsyncThunk('searchByUser', async (params: SearchType) => {
  const { data } = await http.get(`/profile`, { params });
  return data;
});

// 나와 같은 식물을 키우는 사람들 조회
export const getSamePlantUserList = createAsyncThunk('getSamePlantUserList', async () => {
  const { data } = await http.get(`/profile/plant`);
  return data;
});
