import { createSlice, PayloadAction } from '@reduxjs/toolkit';

import firebaseConfig from '~/config/firebaseConfig.json';
import { initializeApp } from 'firebase/app';

import { UserInfoType } from './commonType';
import { logIn, deleteUser, logOut, logInByOAuth, getAccessToken } from '@/core/user/userAPI';
import { createAlert, updateAllAlert, checkIsAlert } from '@/core/alert/alertAPI';

interface CommonState {
	firebase: any;
	userInfo: UserInfoType;
	searchState: string;
	isAlert: boolean;
	authType: string;
	accessToken: string;
}

const firebase = initializeApp(firebaseConfig);

const initialState: CommonState = {
	firebase: firebase,
	userInfo: null,
	searchState: 'home',
	isAlert: false,
	authType: null,
	accessToken: null
};

const commonSlice = createSlice({
	name: 'common',
	initialState,

	reducers: {
		SET_IS_SEARCH_STATE: (state, action: PayloadAction<string>) => {
			state.searchState = action.payload;
		},
		SET_AUTH_TYPE_DB: (state) => {
			state.authType = 'DB';
		},
		SET_AUTH_TYPE_KAKAO: (state) => {
			state.authType = 'KAKAO';
		},
		SET_AUTH_TYPE_FIREBASE: (state) => {
			state.authType = 'FIREBASE';
		},
		SET_ACCESS_TOKEN: (state, action) => {
			state.accessToken = action.payload;
		},
		SET_USER_INFO: (state, action) => {
			state.userInfo = action.payload;
		},
		SET_IS_ALERT_TRUE: (state) => {
			state.isAlert = true;
		},
		SET_IS_ALERT_FALSE: (state) => {
			state.isAlert = false;
		}
	},

	extraReducers(builder) {
		builder
			.addCase(logIn.pending, (state) => {
				state.userInfo = null;
				state.accessToken = null;
			})
			.addCase(logIn.fulfilled, (state, action) => {
				state.userInfo = action.payload?.userInfo;
				state.accessToken = action.payload?.accessToken;
				// console.log(action.payload);
				// action.payload.router?.push('/home');
			})
			.addCase(logInByOAuth.pending, (state) => {
				state.userInfo = null;
				state.accessToken = null;
			})
			.addCase(logInByOAuth.fulfilled, (state, action) => {
				state.userInfo = action.payload?.userInfo;
				state.accessToken = action.payload?.accessToken;
				// console.log(action.payload);
				// action.payload.router?.push('/home');
			})
			.addCase(logOut.fulfilled, (state) => {
				state.userInfo = null;
				state.accessToken = null;
			})
			.addCase(deleteUser.fulfilled, (state) => {
				state.userInfo = null;
				state.accessToken = null;
			})
			.addCase(getAccessToken.pending, (state) => {
				state.accessToken = null;
			})
			.addCase(getAccessToken.fulfilled, (state, action) => {
				if (action.payload == false) {
					// state.isAuthenticated = false;
				} else {
					// state.isAuthenticated = true;
					state.accessToken = action.payload?.accessToken;
				}
			})
			.addCase(updateAllAlert.fulfilled, (state) => {
				state.isAlert = false;
			})
			.addCase(checkIsAlert.fulfilled, (state, action) => {
				state.isAlert = action.payload;
			});
	}
});

export const {
	SET_ACCESS_TOKEN,
	SET_IS_SEARCH_STATE,
	SET_AUTH_TYPE_DB,
	SET_AUTH_TYPE_KAKAO,
	SET_AUTH_TYPE_FIREBASE,
	SET_USER_INFO,
	SET_IS_ALERT_TRUE,
	SET_IS_ALERT_FALSE
} = commonSlice.actions;

export default commonSlice.reducer;
