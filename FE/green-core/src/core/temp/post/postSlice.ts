import { createSlice } from "@reduxjs/toolkit";
import * as PostType from "./postType";
import * as postAPI from "./postAPI";

interface PostState {
	isLoading: boolean;
	postList: Array<PostType.PostList>;
}

const initialState: PostState = {
	isLoading: true,
	postList: []
};

const postSlice = createSlice({
	name: "post",
	initialState,

	reducers: {},

	// pending, fulfiiled, rejected, (state, action)
	extraReducers(builder) {
		builder
			.addCase(postAPI.getPostList.pending, (state) => {
				state.isLoading = true;
				state.postList = [];
			})
			.addCase(postAPI.getPostList.fulfilled, (state, action) => {
				state.isLoading = false;
				state.postList = action.payload;
			});
	}
});

export default postSlice.reducer;
