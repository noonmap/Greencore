import { createAsyncThunk } from '@reduxjs/toolkit';
import http from '@/lib/http';
import axios from 'axios';
import * as cookies from '@/lib/cookies';

import Toastify from 'toastify-js';
import message from '@/assets/message.json';
import toastifyCSS from '@/assets/toastify.json';

import { PageType, SearchType } from '@/core/common/commonType';
import { SignUpDataType, LogInDataType, PasswordType, ProfileType, UserPlantType, EmailType, LogInOAuthDataType } from './userType';
import { ErrorCallback } from 'typescript';

const SUCCESS_MESSAGE = 'SUCCESS';

/** [POST] 회원가입  API
 * @url /user
 */
export const signUp = async (payload: SignUpDataType) => {
  try {
    const { data } = await http.post('/user', payload);

    if (data.result == SUCCESS_MESSAGE) {
      if (data.data) {
        Toastify({
          text: message.SignUpSuccess,
          duration: message.MessageDuration,
          position: 'center',
          stopOnFocus: true,
          style: toastifyCSS.success,
        }).showToast();
      } else {
        Toastify({
          text: message.SignUpFail,
          duration: message.MessageDuration,
          position: 'center',
          stopOnFocus: true,
          style: toastifyCSS.fail,
        }).showToast();
      }
    } else {
      Toastify({
        text: message.SignUpFail,
        duration: message.MessageDuration,
        position: 'center',
        stopOnFocus: true,
        style: toastifyCSS.fail,
      }).showToast();
    }

    return data;
  } catch (error: any) {
    const status = error.response?.status;

    if (status == 404) {
      Toastify({
        text: message.SignUpFail,
        duration: message.MessageDuration,
        position: 'center',
        stopOnFocus: true,
        style: toastifyCSS.fail,
      }).showToast();
    }
  }
};

/** [POST] 회원가입 OAUTH API
 * @url /user
 */
export const signUpByOAuth = async (payload: SignUpDataType) => {
  try {
    const { data } = await http.post('/user', payload);
    return data;
  } catch (error) {
    Toastify({
      text: message.SignUpFail,
      duration: message.MessageDuration,
      position: 'center',
      stopOnFocus: true,
      style: toastifyCSS.fail,
    }).showToast();
  }
};

/** [POST] 해당 이메일에 인증번호 메일 전송하는 API
 * @url /mail
 */
export const checkEmail = async (payload: EmailType) => {
  try {
    const { data } = await http.post('/mail', payload);

    if (data.result == SUCCESS_MESSAGE) {
      if (data.data) {
        Toastify({
          text: message.CheckEmailSuccess,
          duration: message.MessageDuration,
          position: 'center',
          stopOnFocus: true,
          style: toastifyCSS.success,
        }).showToast();
      } else {
        Toastify({
          text: message.CheckEmailFail,
          duration: message.MessageDuration,
          position: 'center',
          stopOnFocus: true,
          style: toastifyCSS.fail,
        }).showToast();
      }
    } else {
      Toastify({
        text: message.CheckEmailFail,
        duration: message.MessageDuration,
        position: 'center',
        stopOnFocus: true,
        style: toastifyCSS.fail,
      }).showToast();
    }

    return data;
  } catch (error: any) {
    const status = error.response?.status;

    if (status == 404) {
      Toastify({
        text: message.CheckEmailFail,
        duration: message.MessageDuration,
        position: 'center',
        stopOnFocus: true,
        style: toastifyCSS.fail,
      }).showToast();
    }
  }
};

/** [GET] DB에 있는 이메일인지 아닌지 확인하는 API
 * @url /user/email/${email}
 */
export const checkEmailDuplicated = async (email: string) => {
  const { data } = await http.get(`/user/email/${email}`);
  return data;
};

/** [POST] 비밀번호 찾기, 이메일로 임시 비밀번호를 전송하는 API
 * @url /mail/password
 */
export const findPassword = async (payload: EmailType) => {
  try {
    const { data } = await http.post('/mail/password', payload);

    if (data.result == SUCCESS_MESSAGE) {
      Toastify({
        text: message.FindPasswordSuccess,
        duration: message.MessageDuration,
        position: 'center',
        stopOnFocus: true,
        style: toastifyCSS.success,
      }).showToast();
    } else {
      Toastify({
        text: message.FindPasswordFail,
        duration: message.MessageDuration,
        position: 'center',
        stopOnFocus: true,
        style: toastifyCSS.fail,
      }).showToast();
    }

    return data;
  } catch (error: any) {
    const status = error.response?.status;

    if (status == 404) {
      Toastify({
        text: message.FindPasswordFail,
        duration: message.MessageDuration,
        position: 'center',
        stopOnFocus: true,
        style: toastifyCSS.fail,
      }).showToast();
    }
  }
};

/** [POST] 메일 검증하는 API (인증코드 확인)
 * @url /mail/confirm
 */
export const checkAuthCode = async (payload: EmailType) => {
  try {
    const { data } = await http.post('/mail/confirm', payload);

    if (data.result == SUCCESS_MESSAGE) {
      if (data.data) {
        Toastify({
          text: message.CheckAuthCodeSuccess,
          duration: message.MessageDuration,
          position: 'center',
          stopOnFocus: true,
          style: toastifyCSS.success,
        }).showToast();
      } else {
        Toastify({
          text: message.CheckAuthCodeFail,
          duration: message.MessageDuration,
          position: 'center',
          stopOnFocus: true,
          style: toastifyCSS.fail,
        }).showToast();
      }
    } else {
      Toastify({
        text: message.CheckAuthCodeFail,
        duration: message.MessageDuration,
        position: 'center',
        stopOnFocus: true,
        style: toastifyCSS.fail,
      }).showToast();
    }

    return data;
  } catch (error: any) {
    const status = error.response?.status;

    if (status == 404) {
      Toastify({
        text: message.CheckAuthCodeFail,
        duration: message.MessageDuration,
        position: 'center',
        stopOnFocus: true,
        style: toastifyCSS.fail,
      }).showToast();
    }
  }
};

/** [DELETE] 회원탈퇴 API
 * @url /user
 */
export const deleteUser = createAsyncThunk('deleteUser', async () => {
  try {
    const { data } = await http.delete(`/user`);

    if (data.result == SUCCESS_MESSAGE) {
      if (data.data) {
        if (cookies.getCookieToken()) cookies.removeCookieToken();

        Toastify({
          text: message.DeleteUserSuccess,
          duration: message.MessageDuration,
          position: 'center',
          stopOnFocus: true,
          style: toastifyCSS.success,
        }).showToast();
      } else {
        Toastify({
          text: message.DeleteUserFail,
          duration: message.MessageDuration,
          position: 'center',
          stopOnFocus: true,
          style: toastifyCSS.fail,
        }).showToast();
      }
    }

    return data;
  } catch (error: any) {
    const status = error.response?.status;

    if (status == 404) {
      Toastify({
        text: message.DeleteUserFail,
        duration: message.MessageDuration,
        position: 'center',
        stopOnFocus: true,
        style: toastifyCSS.fail,
      }).showToast();
    }
  }
});

/** [POST] 로그인 API
 * @url /login
 */
export const logIn = createAsyncThunk('logIn', async (payload: LogInDataType) => {
  try {
    const res = await http.post('/login', payload);
    const nickname = res.data.data.nickname;

    let accessToken = null;
    let refreshToken = null;

    if (res.data.result == SUCCESS_MESSAGE) {
      accessToken = res.headers['authorization'];
      refreshToken = res.headers['x-refresh-token'];

      if (res.data.data) {
        cookies.setRefreshToken(refreshToken);

        Toastify({
          text: message.LogInSuccess,
          duration: message.MessageDuration,
          position: 'center',
          stopOnFocus: true,
          style: toastifyCSS.success,
        }).showToast();

        console.group('<< accessToken >>');
        console.log(accessToken);
        console.groupEnd();

        console.group('<< refreshToken >>');
        console.log(refreshToken);
        console.groupEnd();
      } else {
        if (cookies.getCookieToken()) cookies.removeCookieToken();

        Toastify({
          text: message.LogInFail,
          duration: message.MessageDuration,
          position: 'center',
          stopOnFocus: true,
          style: toastifyCSS.fail,
        }).showToast();
      }

      return { accessToken, userInfo: { nickname } };
    } else {
      Toastify({
        text: message.LogInFail,
        duration: message.MessageDuration,
        position: 'center',
        stopOnFocus: true,
        style: toastifyCSS.fail,
      }).showToast();

      if (cookies.getCookieToken()) cookies.removeCookieToken();
    }
  } catch (error: any) {
    const status = error.response?.status;

    if (status == 404) {
      Toastify({
        text: message.LogInFail,
        duration: message.MessageDuration,
        position: 'center',
        stopOnFocus: true,
        style: toastifyCSS.fail,
      }).showToast();
    }
  }
});

/** [POST] OAUTH 로그인 API
 * @url /login/oauth
 */
export const logInByOAuth = createAsyncThunk('logInByOAuth', async (payload: LogInOAuthDataType) => {
  try {
    const { accessToken, refreshToken, nickname } = payload;
    console.log('hhhhh', accessToken);

    const headers = {
      headers: {
        'X-Refresh-Token': refreshToken,
        Authorization: `Bearer ${accessToken}`,
      },
    };

    const res = await http.post('/login/oauth', {}, headers);

    if (res.data.result == SUCCESS_MESSAGE) {
      if (res.data.data) {
        cookies.setRefreshToken(refreshToken);

        console.group('<< accessToken >>');
        console.log(accessToken);
        console.groupEnd();

        console.group('<< refreshToken >>');
        console.log(refreshToken);
        console.groupEnd();
      } else {
        if (cookies.getCookieToken()) cookies.removeCookieToken();
      }
    } else {
      if (cookies.getCookieToken()) cookies.removeCookieToken();
    }

    return { accessToken, userInfo: { nickname } };
  } catch (error: any) {
    const status = error.response?.status;

    if (status == 404) {
      Toastify({
        text: message.LogInFail,
        duration: message.MessageDuration,
        position: 'center',
        stopOnFocus: true,
        style: toastifyCSS.fail,
      }).showToast();
    }
  }
});

/** [POST] 새롭게 access token 받는 API (refresh token)
 * @url /refresh
 */
export const getAccessToken = createAsyncThunk('getAccessToken', async (authType: string) => {
  const serverUrl =
    process.env.NODE_ENV == 'production'
      ? process.env.APP_SERVER_URL
      : process.env.LOCAL_TYPE == 'development'
      ? 'http://localhost:8080'
      : 'http://localhost:3000';

  try {
    if (cookies.getCookieToken()) {
      console.log('hihi');
      const headers = { 'X-Refresh-Token': cookies.getCookieToken() };
      const url = `${serverUrl}/api/refresh`;
      const res = await axios.post(url, { authType }, { headers });

      let accessToken = null;
      let refreshToken = null;

      if (res.data.result == SUCCESS_MESSAGE) {
        if (res.data.data) {
          accessToken = res.headers['authorization'];
          refreshToken = res.headers['x-refresh-token'];
          cookies.setRefreshToken(refreshToken);

          console.group('<< accessToken >>');
          console.log(accessToken);
          console.groupEnd();

          console.group('<< refreshToken >>');
          console.log(refreshToken);
          console.groupEnd();
        }
      }

      return { accessToken };
    } else {
      return false;
    }
  } catch (error: any) {}
});

/** [DELETE] 로그아웃 API
 * @url /logout
 */
export const logOut = createAsyncThunk('logOut', async () => {
  try {
    const { data } = await http.post('/logout');

    if (data.result == SUCCESS_MESSAGE) {
      if (data.data) {
        if (cookies.getCookieToken()) cookies.removeCookieToken();
      }
    }
  } catch (error: any) {
    const status = error.response?.status;

    if (status == 404) {
      Toastify({
        text: message.LogInFail,
        duration: message.MessageDuration,
        position: 'center',
        stopOnFocus: true,
        style: toastifyCSS.fail,
      }).showToast();
    }
  }
});

/** [GET] 닉네임 중복 확인하는 API
 * @url `/user/${nickname}`
 */
export const checkNickname = async (nickname: string) => {
  try {
    const { data } = await http.get(`/user/nickname/${nickname}`);

    if (data.result == SUCCESS_MESSAGE) {
      if (data.data) {
        Toastify({
          text: message.CheckNicknameSuccess,
          duration: message.MessageDuration,
          position: 'center',
          stopOnFocus: true,
          style: toastifyCSS.success,
        }).showToast();
      } else {
        Toastify({
          text: message.CheckNicknameFail,
          duration: 3000,
          position: 'center',
          stopOnFocus: true,
          style: toastifyCSS.fail,
        }).showToast();
      }
    }

    return data;
  } catch (error: any) {
    const status = error.response?.status;

    if (status == 404) {
      Toastify({
        text: message.CheckNicknameFail,
        duration: 3000,
        position: 'center',
        stopOnFocus: true,
        style: toastifyCSS.fail,
      }).showToast();
    }
  }
};

/** [POST] 현재 비밀번호 확인하는 API
 * @url `/user/password`
 */
export const checkPassword = async (payload: PasswordType) => {
  try {
    const { data } = await http.post(`/user/password`, payload);

    if (data.result == SUCCESS_MESSAGE) {
      if (!data.data) {
        Toastify({
          text: message.CheckPasswordFail,
          duration: message.MessageDuration,
          position: 'center',
          stopOnFocus: true,
          style: toastifyCSS.fail,
        }).showToast();
      }
    }
    return data;
  } catch (error: any) {
    const status = error.response?.status;

    if (status == 404) {
      Toastify({
        text: message.CheckPasswordFail,
        duration: message.MessageDuration,
        position: 'center',
        stopOnFocus: true,
        style: toastifyCSS.fail,
      }).showToast();
    }
  }
};

/** [PUT] 회원 정보 수정 API (현재 비밀번호 수정)
 * @url /user/password
 */
export const updatePassword = async (payload: PasswordType) => {
  try {
    const { data } = await http.put(`/user/password`, payload);

    if (data.result == SUCCESS_MESSAGE) {
      if (data.data) {
        Toastify({
          text: message.UpdatePasswordSuccess,
          duration: message.MessageDuration,
          position: 'center',
          stopOnFocus: true,
          style: toastifyCSS.success,
        }).showToast();
      } else {
        Toastify({
          text: message.UpdatePasswordFail,
          duration: message.MessageDuration,
          position: 'center',
          stopOnFocus: true,
          style: toastifyCSS.fail,
        }).showToast();
      }
    }

    return data;
  } catch (error: any) {
    const status = error.response?.status;

    if (status == 404) {
      Toastify({
        text: message.UpdatePasswordFail,
        duration: message.MessageDuration,
        position: 'center',
        stopOnFocus: true,
        style: toastifyCSS.fail,
      }).showToast();
    }
  }
};

/** [GET] 회원 프로필 조회 API
 * @url /profile/${nickname}
 */
export const getProfile = async (nickname: string | string[]) => {
  const { data } = await http.get(`/profile/${nickname}`);
  return data;
};

/** [PUT] 회원 프로필 수정 API
 * @url /profile
 */
export const updateProfile = async (payload: ProfileType) => {
  try {
    const { data } = await http.put(`/profile`, payload);

    if (data.result == SUCCESS_MESSAGE) {
      if (data.data) {
        Toastify({
          text: message.UpdateProfileSuccess,
          duration: message.MessageDuration,
          position: 'center',
          stopOnFocus: true,
          style: toastifyCSS.success,
        }).showToast();
      } else {
        Toastify({
          text: message.UpdateProfileFail,
          duration: message.MessageDuration,
          position: 'center',
          stopOnFocus: true,
          style: toastifyCSS.fail,
        }).showToast();
      }
    }

    return data;
  } catch (error: any) {
    const status = error.response?.status;

    if (status == 404) {
      Toastify({
        text: message.UpdateProfileFail,
        duration: message.MessageDuration,
        position: 'center',
        stopOnFocus: true,
        style: toastifyCSS.fail,
      }).showToast();
    }
  }
};

/** [GET] 키우는 식물 리스트 조회 API
 * @url /user/plant/${nickname}
 */
export const getUserPlantList = async (nickname: string | string[], params: PageType) => {
  const { data } = await http.get(`/user/plant/${nickname}`, { params });
  return data;
};

// 키우는 식물  조회
/** [GET] 키우는 식물 단일 조회 API
 * @url /user/plant/${nickname}/${userPlatId}
 */
export const getUserPlant = async (nickname: string, userPlatId: string) => {
  const { data } = await http.get(`/user/plant/${nickname}/${userPlatId}`);
  return data;
};

// 키우는 식물 생성
export const createUserPlant = async (payload: UserPlantType) => {
  const { data } = await http.post(`/user/plant`, payload);
  return data.data;
};

// 키우는 식물 삭제
export const deleteUserPlant = async (userPlantId: number) => {
  try {
    const { data } = await http.delete(`/user/plant/${userPlantId}`);

    if (data.result == SUCCESS_MESSAGE) {
      if (data.data) {
        Toastify({
          text: message.DeleteUserPlantSuccess,
          duration: message.MessageDuration,
          position: 'center',
          stopOnFocus: true,
          style: toastifyCSS.success,
        }).showToast();
      }
    }

    return data;
  } catch (error) {}
};

// 키우는 식물 닉네임 수정
export const updateUserPlant = async (userPlantId: number, payload: UserPlantType) => {
  try {
    const { data } = await http.put(`/user/plant/${userPlantId}`, payload);

    if (data.result == SUCCESS_MESSAGE) {
      if (data.data) {
        Toastify({
          text: message.UpdateUserPlantSuccess,
          duration: message.MessageDuration,
          position: 'center',
          stopOnFocus: true,
          style: toastifyCSS.success,
        }).showToast();
      } else {
        Toastify({
          text: message.UpdateUserPlantFail,
          duration: message.MessageDuration,
          position: 'center',
          stopOnFocus: true,
          style: toastifyCSS.fail,
        }).showToast();
      }
    }

    return data;
  } catch (error: any) {
    const status = error.response?.status;

    if (status == 404) {
      Toastify({
        text: message.UpdateUserPlantFail,
        duration: message.MessageDuration,
        position: 'center',
        stopOnFocus: true,
        style: toastifyCSS.fail,
      }).showToast();
    }
  }
};

// 사용자 검색
export const searchByUser = createAsyncThunk('searchByUser', async (params: SearchType) => {
  try {
    const { data } = await http.get(`/profile`, { params });
    return data.data;
  } catch (error: any) {
    const status = error.response?.status;

    if (status == 404) {
      Toastify({
        text: message.SearchFail,
        duration: message.MessageDuration,
        position: 'center',
        stopOnFocus: true,
        style: toastifyCSS.fail,
      }).showToast();
    }
  }
});

// 사용자 추가 검색
export const searchByUserMore = createAsyncThunk('searchByUserMore', async (params: SearchType) => {
  try {
    const { data } = await http.get(`/profile`, { params });
    return data.data;
  } catch (error: any) {
    const status = error.response?.status;

    if (status == 404) {
      Toastify({
        text: message.SearchFail,
        duration: message.MessageDuration,
        position: 'center',
        stopOnFocus: true,
        style: toastifyCSS.fail,
      }).showToast();
    }
  }
});

// 나와 같은 식물을 키우는 사람들 조회
export const getSamePlantUserList = async () => {
  const { data } = await http.get(`/profile/plant`);
  return data;
};
