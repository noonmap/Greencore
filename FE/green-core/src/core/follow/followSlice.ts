import { createSlice } from '@reduxjs/toolkit';

interface FollowState {}

const initialState: FollowState = {};

const followSlice = createSlice({
	name: 'follow',
	initialState,

	reducers: {},

	extraReducers(builder) {}
});

export default followSlice.reducer;
