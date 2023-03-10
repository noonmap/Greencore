import { createAsyncThunk } from "@reduxjs/toolkit";
import http from "@/lib/http.js";
import Toastify from 'toastify-js';
import message from '@/assets/message.json';
import toastifyCSS from '@/assets/toastify.json';

export const getAlertList = createAsyncThunk('getAlertList', async () => {
	try {
		const { data } = await http.get('/alert');

		// 알림 리스트 가져오는 것은 굳이 토스트 알림을 띄우지 않아도 됨
		// Toastify({
		// 	text: message.SignUpSuccess,
		// 	duration: 1500,
		// 	position: 'center',
		// 	stopOnFocus: true,
		// 	style: toastifyCSS.success
		// }).showToast();

		return data.data;
	} catch (err) {
		Toastify({
			text: message.GetAlertListFail,
			duration: 1500,
			position: 'center',
			stopOnFocus: true,
			style: toastifyCSS.fail
		}).showToast();

		console.error(err);

		return [];
	}
});
