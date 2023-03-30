import { createSlice } from '@reduxjs/toolkit';
import { SearchUserType } from './userType';
import * as userAPI from './userAPI';

interface UserState {
	accessToken: string | null;

	// 검색용
	searchUserList: Array<SearchUserType>;
	isStopedAtUser: boolean;
	pageAtUser: number;
}

const initialState: UserState = {
	accessToken: null,

	// 검색용
	searchUserList: [],
	isStopedAtUser: false,
	pageAtUser: 0
};

const userSlice = createSlice({
	name: 'user',
	initialState,

	reducers: {
		SET_ACCESS_TOKEN: (state, action) => {
			state.accessToken = action.payload;
		}
	},

	extraReducers(builder) {
		builder
			.addCase(userAPI.logIn.pending, (state) => {
				state.accessToken = null;
			})
			.addCase(userAPI.logIn.fulfilled, (state, action) => {
				state.accessToken = action.payload?.accessToken;
			})
			.addCase(userAPI.logIn.rejected, (state) => {
				state.accessToken = null;
			})
			.addCase(userAPI.logInByOAuth.pending, (state) => {
				state.accessToken = null;
			})
			.addCase(userAPI.logInByOAuth.fulfilled, (state, action) => {
				state.accessToken = action.payload?.accessToken;
			})
			.addCase(userAPI.logInByOAuth.rejected, (state) => {
				state.accessToken = null;
			})
			.addCase(userAPI.logOut.fulfilled, (state) => {
				state.accessToken = null;
			})
			.addCase(userAPI.getAccessToken.pending, (state) => {
				state.accessToken = null;
			})
			.addCase(userAPI.getAccessToken.fulfilled, (state, action) => {
				if (action.payload == false) {
					// state.isAuthenticated = false;
				} else {
					// state.isAuthenticated = true;
					state.accessToken = action.payload?.accessToken;
				}
			})
			.addCase(userAPI.deleteUser.fulfilled, (state) => {
				state.accessToken = null;
			})
			.addCase(userAPI.searchByUser.fulfilled, (state, action) => {
				if (action.payload.length === 0) {
					state.isStopedAtUser = true;
				}
				state.pageAtUser = 1;
				state.searchUserList = action.payload;
			})
			.addCase(userAPI.searchByUserMore.fulfilled, (state, action) => {
				if (action.payload.length === 0) {
					state.isStopedAtUser = true;
				}
				state.pageAtUser = state.pageAtUser + 1;
				state.searchUserList = [...state.searchUserList, ...action.payload];
			});
	}
});

export const { SET_ACCESS_TOKEN } = userSlice.actions;
export default userSlice.reducer;
