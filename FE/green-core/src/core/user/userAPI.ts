import { createAsyncThunk } from '@reduxjs/toolkit';
import http from '@/lib/http';
import Toastify from 'toastify-js';
import message from '@/assets/message.json';
import toastifyCSS from '@/assets/toastify.json';

import { SearchType } from '@/core/common/commonType';
import { SignUpDataType, LogInDataType, PasswordType, ProfileType, UserPlantType, EmailType } from './userType';

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
      style: toastifyCSS.success,
    }).showToast();

    return data;
  } catch (err) {
    Toastify({
      text: message.SignUpFail,
      duration: 1500,
      position: 'center',
      stopOnFocus: true,
      style: toastifyCSS.fail,
    }).showToast();
  }
};

// 메일 전송 (중복도 확인)
export const checkEmail = async (payload: EmailType) => {
  try {
    const { data } = await http.post('/mail', payload);

    Toastify({
      text: message.CheckEmailSuccess,
      duration: 1500,
      position: 'center',
      stopOnFocus: true,
      style: toastifyCSS.success,
    }).showToast();

    return data;
  } catch (error) {
    Toastify({
      text: message.CheckEmailFail,
      duration: 1500,
      position: 'center',
      stopOnFocus: true,
      style: toastifyCSS.fail,
    }).showToast();
  }
};

// 임시 비밀번호 전송
export const findPassword = async (payload: EmailType) => {
  try {
    const { data } = await http.post('/mail/password', payload);

    Toastify({
      text: message.FindPasswordSuccess,
      duration: 1500,
      position: 'center',
      stopOnFocus: true,
      style: toastifyCSS.success,
    }).showToast();

    return data;
  } catch (error) {}
};

// 메일 검증 (인증코드 확인)
export const checkAuthCode = async (payload: EmailType) => {
  try {
    const { data } = await http.post('/mail/confirm', payload);

    Toastify({
      text: message.CheckAuthCodeSuccess,
      duration: 1500,
      position: 'center',
      stopOnFocus: true,
      style: toastifyCSS.success,
    }).showToast();

    return data;
  } catch (error) {
    Toastify({
      text: message.CheckAuthCodeSuccess,
      duration: 1500,
      position: 'center',
      stopOnFocus: true,
      style: toastifyCSS.fail,
    }).showToast();
  }
};

// 회원탈퇴
export const deleteUser = async () => {
  try {
    const { data } = await http.delete(`/user`);

    Toastify({
      text: message.DeleteUserSuccess,
      duration: 1500,
      position: 'center',
      stopOnFocus: true,
      style: toastifyCSS.success,
    }).showToast();

    return data;
  } catch (error) {
    Toastify({
      text: message.DeleteUserFail,
      duration: 1500,
      position: 'center',
      stopOnFocus: true,
      style: toastifyCSS.fail,
    }).showToast();
  }
};

// 로그인
export const logIn = createAsyncThunk('logIn', async (payload: LogInDataType) => {
  try {
    const { data } = await http.post('/login', payload);

    Toastify({
      text: message.LogInSuccess,
      duration: 1500,
      position: 'center',
      stopOnFocus: true,
      style: toastifyCSS.success,
    }).showToast();

    return data;
  } catch (error) {
    Toastify({
      text: message.LogInFail,
      duration: 1500,
      position: 'center',
      stopOnFocus: true,
      style: toastifyCSS.fail,
    }).showToast();
  }
});

// 닉네임 중복 확인
export const checkNickname = async (nickname: string) => {
  try {
    const { data } = await http.get(`/user/${nickname}`);

    Toastify({
      text: message.CheckNicknameSuccess,
      duration: 1500,
      position: 'center',
      stopOnFocus: true,
      style: toastifyCSS.success,
    }).showToast();

    return data;
  } catch (error) {
    Toastify({
      text: message.CheckNicknameFail,
      duration: 3000,
      position: 'center',
      stopOnFocus: true,
      style: toastifyCSS.fail,
    }).showToast();
  }
};

// 회원정보 조회 (현재 비밀번호 확인)
export const checkPassword = async (payload: PasswordType) => {
  try {
    const { data } = await http.post(`/user/password`, payload);
    return data;
  } catch (error) {
    Toastify({
      text: message.CheckPasswordFail,
      duration: 1500,
      position: 'center',
      stopOnFocus: true,
      style: toastifyCSS.fail,
    }).showToast();
  }
};

// 회원정보 수정 (현재 비밀번호 수정)
export const updatePassword = async (payload: PasswordType) => {
  try {
    const { data } = await http.put(`/user/password`, payload);

    Toastify({
      text: message.UpdatePasswordSuccess,
      duration: 1500,
      position: 'center',
      stopOnFocus: true,
      style: toastifyCSS.success,
    }).showToast();

    return data;
  } catch (error) {
    Toastify({
      text: message.UpdatePasswordFail,
      duration: 1500,
      position: 'center',
      stopOnFocus: true,
      style: toastifyCSS.fail,
    }).showToast();
  }
};

// 회원 프로필 조회
export const getProfile = createAsyncThunk('getProfile', async (nickname: string) => {
  try {
    const { data } = await http.get(`/profile/${nickname}`);

    return data;
  } catch (error) {
    Toastify({
      text: message.GetProfileFail,
      duration: 1500,
      position: 'center',
      stopOnFocus: true,
      style: toastifyCSS.fail,
    }).showToast();
  }
});

// 회원 프로필 수정
export const updateProfile = createAsyncThunk('updateProfile', async (payload: ProfileType) => {
  try {
    const { data } = await http.put(`/profile`, payload);

    Toastify({
      text: message.UpdatePasswordSuccess,
      duration: 1500,
      position: 'center',
      stopOnFocus: true,
      style: toastifyCSS.success,
    }).showToast();

    return data;
  } catch (error) {
    Toastify({
      text: message.UpdateProfileSuccess,
      duration: 1500,
      position: 'center',
      stopOnFocus: true,
      style: toastifyCSS.fail,
    }).showToast();
  }
});

// 회원 프로필 이미지 수정
export const updateProfileImage = createAsyncThunk('updateProfileImage', async (payload: ProfileType) => {
  try {
    const { data } = await http.put(`/profile/img`, payload);

    Toastify({
      text: message.UpdateProfileImageSuccess,
      duration: 1500,
      position: 'center',
      stopOnFocus: true,
      style: toastifyCSS.success,
    }).showToast();

    return data;
  } catch (error) {
    Toastify({
      text: message.UpdateProfileImageFail,
      duration: 1500,
      position: 'center',
      stopOnFocus: true,
      style: toastifyCSS.fail,
    }).showToast();
  }
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
