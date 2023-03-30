import { createSlice, PayloadAction } from '@reduxjs/toolkit';

// firebase
import firebaseConfig from '~/config/firebaseConfig.json';
import { initializeApp } from 'firebase/app';

import { UserInfoType } from './commonType';
import { logIn, deleteUser, logOut, logInByOAuth } from '@/core/user/userAPI';
import { createAlert, updateAllAlert, checkIsAlert } from '@/core/alert/alertAPI';

interface CommonState {
	firebase: any;
	isLoading: boolean;
	userInfo: UserInfoType;
	searchState: string;
	isAlert: boolean;
	authType: string;
}

const firebase = initializeApp(firebaseConfig);

const initialState: CommonState = {
	firebase: firebase,
	isLoading: false,
	userInfo: null,
	searchState: 'home',
	isAlert: false,
	authType: null
};

const commonSlice = createSlice({
	name: 'common',
	initialState,

	reducers: {
		SET_IS_LOADING_TRUE: (state) => {
			state.isLoading = true;
		},
		SET_IS_LOADING_FALSE: (state) => {
			state.isLoading = false;
		},
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
		}
	},

	extraReducers(builder) {
		builder
			.addCase(logIn.pending, (state) => {
				state.userInfo = null;
			})
			.addCase(logIn.fulfilled, (state, action) => {
				state.userInfo = action.payload?.userInfo;
			})
			.addCase(logInByOAuth.pending, (state) => {
				state.userInfo = null;
			})
			.addCase(logInByOAuth.fulfilled, (state, action) => {
				state.userInfo = action.payload?.userInfo;
			})
			.addCase(logOut.fulfilled, (state) => {
				state.userInfo = null;
			})
			.addCase(deleteUser.fulfilled, (state) => {
				state.userInfo = null;
			})
			.addCase(createAlert.fulfilled, (state) => {
				state.isAlert = true;
			})
			.addCase(updateAllAlert.fulfilled, (state) => {
				state.isAlert = false;
			})
			.addCase(checkIsAlert.fulfilled, (state, action) => {
				state.isAlert = action.payload;
			});
	}
});

export const { SET_IS_LOADING_TRUE, SET_IS_LOADING_FALSE, SET_IS_SEARCH_STATE, SET_AUTH_TYPE_DB, SET_AUTH_TYPE_KAKAO, SET_AUTH_TYPE_FIREBASE } =
	commonSlice.actions;

export default commonSlice.reducer;
