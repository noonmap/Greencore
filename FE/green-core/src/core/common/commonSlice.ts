import { createSlice } from "@reduxjs/toolkit";

// firebase
import firebaseConfig from "~/config/firebaseConfig.json";
import { initializeApp } from "firebase/app";

interface CommonState {
	firebase: any;
	isLoading: boolean;
	accessToken: string;
	refreshToken: string;
	expireTime: string;
}

const firebase = initializeApp(firebaseConfig);

const initialState: CommonState = {
	firebase: firebase,
	isLoading: false,
	accessToken: '',
	refreshToken: '',
	expireTime: ''
};

const commonSlice = createSlice({
  name: "common",
  initialState,

  reducers: {},
  extraReducers(builder) {},
});

export default commonSlice.reducer;
