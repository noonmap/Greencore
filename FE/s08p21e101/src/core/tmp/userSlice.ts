import { createAsyncThunk, createSlice, PayloadAction } from "@reduxjs/toolkit";
import * as userAPI from "./userAPI";
import userState from "./userState";

// reducer
const userSlice = createSlice({
	name: "user",
	initialState: userState,

	reducers: {
		editNickname(state, action) {
			state.data.username = action.payload;
		}
	},

	extraReducers: (builder) => {
		builder
			.addCase(userAPI.logIn.pending, (state) => {
				state.isLoggingIn = true;
			})
			.addCase(userAPI.logIn.fulfilled, (state, action) => {
				state.isLoggingIn = false;
				state.isLoggedIn = true;
				state.data = action.payload;
			})
			.addCase(userAPI.logIn.rejected, (state, action) => {
				state.isLoggingIn = false;
				state.data = null;
			})
			.addDefaultCase((state, action) => {});
	}
});

export default userSlice.reducer;
