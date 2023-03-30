import { createAsyncThunk } from '@reduxjs/toolkit';
import http from '@/lib/http';
import * as cookies from '@/lib/cookies';

import Toastify from 'toastify-js';
import message from '@/assets/message.json';
import toastifyCSS from '@/assets/toastify.json';

import { PageType, SearchType } from '@/core/common/commonType';
import { SignUpDataType, LogInDataType, PasswordType, ProfileType, UserPlantType, EmailType, LogInOAuthDataType } from './userType';
import { hasRequestAnimationFrame } from 'swr/_internal';
import { referenceEnhancer } from 'mobx/dist/internal';

/** [POST] 회원가입  API
 * @url /user
 */
export const signUp = async (payload: SignUpDataType) => {
	/* "background": "linear-gradient(to right, #00b09b, #96c93d)",*/
	// "background": "linear-gradient(to top, #c1dfc4 0%, #deecdd 100%)",

	try {
		const { data } = await http.post('/user', payload);

		if (data.result == 'SUCCESS') {
			Toastify({
				text: message.SignUpSuccess,
				duration: 1500,
				position: 'center',
				stopOnFocus: true,
				style: toastifyCSS.success
			}).showToast();
		} else {
			Toastify({
				text: message.SignUpFail,
				duration: 1500,
				position: 'center',
				stopOnFocus: true,
				style: toastifyCSS.fail
			}).showToast();
		}

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

/** [POST] OAUTH 이용해서 회원가입  API
 * @url /user
 */
// export const signUpByOAuth = async (payload: SignUpDataType) => {
// 	try {
// 		const { data } = await http.post('/user', payload);

// 		Toastify({
// 			text: message.SignUpSuccess,
// 			duration: 1500,
// 			position: 'center',
// 			stopOnFocus: true,
// 			style: toastifyCSS.success
// 		}).showToast();

// 		return data;
// 	} catch (err) {
// 		Toastify({
// 			text: message.SignUpFail,
// 			duration: 1500,
// 			position: 'center',
// 			stopOnFocus: true,
// 			style: toastifyCSS.fail
// 		}).showToast();
// 	}
// };

/** [POST] 해당 이메일에 인증번호 메일 전송하는 API
 * @url /mail
 */
export const checkEmail = async (payload: EmailType) => {
	try {
		const { data } = await http.post('/mail', payload);

		Toastify({
			text: message.CheckEmailSuccess,
			duration: 1500,
			position: 'center',
			stopOnFocus: true,
			style: toastifyCSS.success
		}).showToast();

		return data;
	} catch (error) {
		Toastify({
			text: message.CheckEmailFail,
			duration: 1500,
			position: 'center',
			stopOnFocus: true,
			style: toastifyCSS.fail
		}).showToast();
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
		// FIXME:  비밀번호 찾기인데 토큰이 필요한가?
		// const headers = { authorization: accessToken };
		const { data } = await http.post('/mail/password', payload);

		Toastify({
			text: message.FindPasswordSuccess,
			duration: 1500,
			position: 'center',
			stopOnFocus: true,
			style: toastifyCSS.success
		}).showToast();

		return data;
	} catch (error) {}
};

/** [POST] 메일 검증하는 API (인증코드 확인)
 * @url /mail/confirm
 */
export const checkAuthCode = async (payload: EmailType) => {
	try {
		const { data } = await http.post('/mail/confirm', payload);

		Toastify({
			text: message.CheckAuthCodeSuccess,
			duration: 1500,
			position: 'center',
			stopOnFocus: true,
			style: toastifyCSS.success
		}).showToast();

		return data;
	} catch (error) {
		Toastify({
			text: message.CheckAuthCodeSuccess,
			duration: 1500,
			position: 'center',
			stopOnFocus: true,
			style: toastifyCSS.fail
		}).showToast();
	}
};

/** [DELETE] 회원탈퇴 API
 * @url /user
 */
export const deleteUser = createAsyncThunk('deleteUser', async () => {
	try {
		const { data } = await http.delete(`/user`);

		if (cookies.getCookieToken()) cookies.removeCookieToken();

		Toastify({
			text: message.DeleteUserSuccess,
			duration: 1500,
			position: 'center',
			stopOnFocus: true,
			style: toastifyCSS.success
		}).showToast();

		return data;
	} catch (error) {
		Toastify({
			text: message.DeleteUserFail,
			duration: 1500,
			position: 'center',
			stopOnFocus: true,
			style: toastifyCSS.fail
		}).showToast();
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

		if (res.data.result == 'SUCCESS') {
			Toastify({
				text: message.LogInSuccess,
				duration: 1500,
				position: 'center',
				stopOnFocus: true,
				style: toastifyCSS.success
			}).showToast();

			accessToken = res.headers['authorization'];
			refreshToken = res.headers['x-refresh-token'];

			cookies.setRefreshToken(refreshToken);

			console.group('<< accessToken >>');
			console.log(accessToken);
			console.groupEnd();

			console.group('<< refreshToken >>');
			console.log(refreshToken);
			console.groupEnd();
		} else {
			Toastify({
				text: message.LogInFail,
				duration: 1500,
				position: 'center',
				stopOnFocus: true,
				style: toastifyCSS.fail
			}).showToast();

			if (cookies.getCookieToken()) cookies.removeCookieToken();
		}

		return { accessToken, userInfo: { nickname } };
	} catch (error) {
		Toastify({
			text: message.LogInFail,
			duration: 1500,
			position: 'center',
			stopOnFocus: true,
			style: toastifyCSS.fail
		}).showToast();
	}
});

/** [POST] OAUTH 로그인 API
 * @url /login/oauth
 */
export const logInByOAuth = createAsyncThunk('logInByOAuth', async (payload: LogInOAuthDataType) => {
	try {
		const { accessToken, refreshToken } = payload;
		const headers = {
			headers: {
				'X-Refresh-Token': refreshToken,
				Authorization: `Bearer ${accessToken}`
			}
		};

		console.log(headers);
		const res = await http.post('/login/oauth', {}, headers);
		const nickname = res.data.data.nickname;
		console.log(res);
		console.log(nickname);

		if (res.data.result == 'SUCCESS') {
			Toastify({
				text: message.LogInSuccess,
				duration: 1500,
				position: 'center',
				stopOnFocus: true,
				style: toastifyCSS.success
			}).showToast();

			cookies.setRefreshToken(refreshToken);

			console.group('<< accessToken >>');
			console.log(accessToken);
			console.groupEnd();

			console.group('<< refreshToken >>');
			console.log(refreshToken);
			console.groupEnd();
		} else {
			Toastify({
				text: message.LogInFail,
				duration: 1500,
				position: 'center',
				stopOnFocus: true,
				style: toastifyCSS.fail
			}).showToast();

			if (cookies.getCookieToken()) cookies.removeCookieToken();
		}

		return { accessToken, userInfo: { nickname } };
	} catch (error) {
		Toastify({
			text: message.LogInFail,
			duration: 1500,
			position: 'center',
			stopOnFocus: true,
			style: toastifyCSS.fail
		}).showToast();
	}
});

/** [POST] 새롭게 access token 받는 API (refresh token)
 * @url /refresh
 */
export const getAccessToken = createAsyncThunk('getAccessToken', async (authType: string) => {
	try {
		if (cookies.getCookieToken()) {
			const headers = { 'X-Refresh-Token': cookies.getCookieToken() };
			const res = await http.post('/refresh', { authType }, { headers });

			let accessToken = null;
			let refreshToken = null;

			if (res.data.result == 'SUCCESS') {
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

			return { accessToken };
		} else {
			return false;
		}
	} catch (error) {
		console.log('에러난다');
		console.log(error);
	}
});

/** [DELETE] 로그아웃 API
 * @url /logout
 */
export const logOut = createAsyncThunk('logOut', async () => {
	try {
		// const headers = { authorization: accessToken };
		const { data } = await http.post('/logout');

		if (cookies.getCookieToken()) cookies.removeCookieToken();

		Toastify({
			text: message.LogOutSuccess,
			duration: 1500,
			position: 'center',
			stopOnFocus: true,
			style: toastifyCSS.success
		}).showToast();

		console.log(data);
	} catch (error) {
		if (cookies.getCookieToken()) cookies.removeCookieToken();

		Toastify({
			text: message.LogOutFail,
			duration: 1500,
			position: 'center',
			stopOnFocus: true,
			style: toastifyCSS.fail
		}).showToast();
	}
});

/** [GET] 닉네임 중복 확인하는 API
 * @url `/user/${nickname}`
 */
export const checkNickname = async (nickname: string) => {
	try {
		const { data } = await http.get(`/user/${nickname}`);

		Toastify({
			text: message.CheckNicknameSuccess,
			duration: 1500,
			position: 'center',
			stopOnFocus: true,
			style: toastifyCSS.success
		}).showToast();

		return data;
	} catch (error) {
		Toastify({
			text: message.CheckNicknameFail,
			duration: 3000,
			position: 'center',
			stopOnFocus: true,
			style: toastifyCSS.fail
		}).showToast();
	}
};

/** [POST] 현재 비밀번호 확인하는 API
 * @url `/user/password`
 */
export const checkPassword = async (payload: PasswordType) => {
	try {
		// const headers = { authorization: accessToken };
		const { data } = await http.post(`/user/password`, payload);
		return data;
	} catch (error) {
		Toastify({
			text: message.CheckPasswordFail,
			duration: 1500,
			position: 'center',
			stopOnFocus: true,
			style: toastifyCSS.fail
		}).showToast();
	}
};

/** [PUT] 회원 정보 수정 API (현재 비밀번호 수정)
 * @url /user/password
 */
export const updatePassword = async (payload: PasswordType) => {
	try {
		// const headers = { authorization: accessToken };
		const { data } = await http.put(`/user/password`, payload);

		Toastify({
			text: message.UpdatePasswordSuccess,
			duration: 1500,
			position: 'center',
			stopOnFocus: true,
			style: toastifyCSS.success
		}).showToast();

		return data;
	} catch (error) {
		Toastify({
			text: message.UpdatePasswordFail,
			duration: 1500,
			position: 'center',
			stopOnFocus: true,
			style: toastifyCSS.fail
		}).showToast();
	}
};

/** [GET] 회원 프로필 조회 API
 * @url /profile/${nickname}
 */
export const getProfile = async (nickname: string | string[]) => {
	try {
		const { data } = await http.get(`/profile/${nickname}`);
		return data;
	} catch (error) {
		Toastify({
			text: message.GetProfileFail,
			duration: 1500,
			position: 'center',
			stopOnFocus: true,
			style: toastifyCSS.fail
		}).showToast();
	}
};

/** [PUT] 회원 프로필 수정 API
 * @url /profile
 */
export const updateProfile = async (payload: ProfileType) => {
	try {
		// const headers = { authorization: accessToken };
		const { data } = await http.put(`/profile`, payload);

		Toastify({
			text: message.UpdatePasswordSuccess,
			duration: 1500,
			position: 'center',
			stopOnFocus: true,
			style: toastifyCSS.success
		}).showToast();

		return data;
	} catch (error) {
		Toastify({
			text: message.UpdateProfileSuccess,
			duration: 1500,
			position: 'center',
			stopOnFocus: true,
			style: toastifyCSS.fail
		}).showToast();
	}
};

/** [PUT] 회원 프로필 수정 API
 * @url /profile/img
 */
export const updateProfileImage = createAsyncThunk('updateProfileImage', async (payload: ProfileType) => {
	try {
		// const headers = { authorization: accessToken };
		const { data } = await http.put(`/profile/img`, payload);

		Toastify({
			text: message.UpdateProfileImageSuccess,
			duration: 1500,
			position: 'center',
			stopOnFocus: true,
			style: toastifyCSS.success
		}).showToast();

		return data;
	} catch (error) {
		Toastify({
			text: message.UpdateProfileImageFail,
			duration: 1500,
			position: 'center',
			stopOnFocus: true,
			style: toastifyCSS.fail
		}).showToast();
	}
});

/** [GET] 키우는 식물 리스트 조회 API
 * @url /user/plant/${nickname}
 */
export const getUserPlantList = async (nickname: string | string[], params: PageType) => {
	// const headers = { authorization: accessToken, ...params };
	const { data } = await http.get(`/user/plant/${nickname}`);
	return data;
};

// 키우는 식물  조회
/** [GET] 키우는 식물 단일 조회 API
 * @url /user/plant/${nickname}/${userPlatId}
 */
export const getUserPlant = async (nickname: string, userPlatId: string) => {
	// const headers = { authorization: accessToken };
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
	const { data } = await http.delete(`/user/plant/${userPlantId}`);
	return data;
};

// 키우는 식물 닉네임 수정
export const updateUserPlant = async (userPlantId: number, payload: UserPlantType) => {
	const { data } = await http.put(`/user/plant/${userPlantId}`, payload);
	return data;
};

// 사용자 검색
export const searchByUser = createAsyncThunk('searchByUser', async (params: SearchType) => {
	try {
		const { data } = await http.get(`/profile`, { params });

		return data.data;
	} catch (error) {
		Toastify({
			text: message.SearchFail,
			duration: 1500,
			position: 'center',
			stopOnFocus: true,
			style: toastifyCSS.fail
		}).showToast();
	}
});

// 사용자 추가 검색
export const searchByUserMore = createAsyncThunk('searchByUserMore', async (params: SearchType) => {
	try {
		const { data } = await http.get(`/profile`, { params });

		return data.data;
	} catch (error) {
		Toastify({
			text: message.SearchFail,
			duration: 1500,
			position: 'center',
			stopOnFocus: true,
			style: toastifyCSS.fail
		}).showToast();
	}
});

// 나와 같은 식물을 키우는 사람들 조회
export const getSamePlantUserList = async () => {
	const { data } = await http.get(`/profile/plant`);
	return data;
};
