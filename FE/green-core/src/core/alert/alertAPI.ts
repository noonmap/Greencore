import { createAsyncThunk } from '@reduxjs/toolkit';
import { getFirestore, collection, doc, query, orderBy, startAfter, where, updateDoc, getDocs, deleteDoc, limit, setDoc } from 'firebase/firestore';

import Toastify from 'toastify-js';
import message from '@/assets/message.json';
import toastifyCSS from '@/assets/toastify.json';
import { AlertCreateType, AlertDataType } from './alertType';
import { setAlertMessage } from '@/lib/utils';

const db = getFirestore();

/** [FIREBASE] 알림 리스트 조회 */
export const getAlertList = createAsyncThunk('getAlertList', async (payload: AlertDataType) => {
	const { nickname, page, size } = payload;

	let lastPage = null;
	let alertQuery = null;

	const alertRef = collection(db, nickname);

	if (page) alertQuery = query(alertRef, orderBy('createdAt', 'desc'), startAfter(lastPage), limit(size));
	else alertQuery = query(alertRef, orderBy('createdAt', 'desc'), limit(size));

	const alertSnapshot = await getDocs(alertQuery);

	let alertList = [];
	alertSnapshot.forEach((doc) => {
		let data = doc.data();
		data['alertId'] = doc.id;
		alertList.push(data);
	});

	lastPage = alertSnapshot.docs[alertSnapshot.docs.length - 1];

	return { alertList, lastPage };
});

/** [FIREBASE] 알림 생성 */
export const createAlert = createAsyncThunk('createAlert', async (payload: AlertCreateType) => {
	const { mentionNickname, type, urlPath, createdAt, isRead } = payload;

	let nickname = 'test';
	const alertRef = collection(db, nickname);
	const newAlert = {
		type,
		content: setAlertMessage(mentionNickname, type),
		urlPath,
		createdAt,
		isRead
	};

	await setDoc(doc(alertRef), newAlert, { merge: true });
});

/** [FIREBASE] 알림 리스트 단일 삭제 */
export const deleteAlert = createAsyncThunk('deleteAlert', async (payload: AlertDataType) => {
	const { nickname, alertId } = payload;
	const alertDoc = doc(db, `${nickname}/${alertId}`);
	await deleteDoc(alertDoc);
});

/** [FIREBASE] 알림 리스트 선택 삭제 */
export const deleteSelectedAlert = createAsyncThunk('deleteSelectedAlert', async (payload: AlertDataType) => {
	const { nickname, selectedAlertList } = payload;

	selectedAlertList.forEach(async (alertId) => {
		const alertDoc = doc(db, `${nickname}/${alertId}`);
		await deleteDoc(alertDoc);
	});
});

/** [FIREBASE] 알림 리스트 선택 읽음 */
export const updateSelectedAlert = createAsyncThunk('updateSelectedAlert', async (payload: AlertDataType) => {
	const { nickname, selectedAlertList } = payload;

	selectedAlertList.forEach(async (alertId) => {
		const alertDoc = doc(db, `${nickname}/${alertId}`);
		await updateDoc(alertDoc, { isRead: true });
	});
});

/** [FIREBASE] 알림 리스트 전체 읽음 */
export const updateAllAlert = createAsyncThunk('updateAllAlert', async (nickname: string) => {
	const alertRef = collection(db, nickname);
	const alertQuery = query(alertRef, where('isRead', '==', false));

	const alertSnapshot = await getDocs(alertQuery);

	alertSnapshot.forEach(async (alert) => {
		const alertDoc = doc(db, `${nickname}/${alert.id}`);
		await updateDoc(alertDoc, { isRead: true });
	});
});
