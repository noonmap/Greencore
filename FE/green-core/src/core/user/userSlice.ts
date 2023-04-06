import { createSlice } from '@reduxjs/toolkit';
import { SearchUserType } from './userType';
import * as userAPI from './userAPI';

interface UserState {
	isPossibleUpdateUser: boolean;
	isSameUser: boolean;

	// 검색용
	searchUserList: Array<SearchUserType>;
	isStopedAtUser: boolean;
	pageAtUser: number;
}

const initialState: UserState = {
	isPossibleUpdateUser: false,
	isSameUser: false,

	// 검색용
	searchUserList: [],
	isStopedAtUser: false,
	pageAtUser: 0
};

const userSlice = createSlice({
	name: 'user',
	initialState,

	reducers: {
		SET_IS_POSSIBLE_UPDATE_USER_TRUE: (state) => {
			state.isPossibleUpdateUser = true;
		},
		SET_IS_POSSIBLE_UPDATE_USER_FALSE: (state) => {
			state.isPossibleUpdateUser = false;
		},
		SET_IS_SAME_USER_TRUE: (state) => {
			state.isSameUser = true;
		},
		SET_IS_SAME_USER_FALSE: (state) => {
			state.isSameUser = false;
		}
	},

	extraReducers(builder) {
		builder
			.addCase(userAPI.searchByUser.fulfilled, (state, action) => {
				if (action.payload?.content.length < 10) {
					state.isStopedAtUser = true;
				}
				state.pageAtUser = 1;
				state.searchUserList = action.payload?.content;
			})
			.addCase(userAPI.searchByUserMore.fulfilled, (state, action) => {
				if (action.payload?.content.length < 10) {
					state.isStopedAtUser = true;
				}
				state.pageAtUser = state.pageAtUser + 1;
				state.searchUserList = [...state.searchUserList, ...action.payload?.content];
			});
	}
});

export const { SET_IS_POSSIBLE_UPDATE_USER_TRUE, SET_IS_POSSIBLE_UPDATE_USER_FALSE, SET_IS_SAME_USER_TRUE, SET_IS_SAME_USER_FALSE } =
	userSlice.actions;
export default userSlice.reducer;
