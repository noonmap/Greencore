import { createAsyncThunk } from '@reduxjs/toolkit';

import Toastify from 'toastify-js';
import message from '@/assets/message.json';
import toastifyCSS from '@/assets/toastify.json';

import {
  getFirestore,
  collection,
  doc,
  query,
  orderBy,
  startAfter,
  onSnapshot,
  getDoc,
  updateDoc,
  getDocs,
  deleteDoc,
  limit,
} from 'firebase/firestore';
import { AlertDataType } from './alertType';

const db = getFirestore();

/** [FIREBASE] 알림 리스트 조회 */
export const getAlertList = createAsyncThunk('getAlertList', async (payload: AlertDataType) => {
  const { nickname, page, size } = payload;

  let lastPage = null;
  let alertQuery = null;

  const alertRef = collection(db, nickname);

  if (page) alertQuery = query(alertRef, orderBy('createdAt', 'desc'), startAfter(lastPage), limit(size));
  else alertQuery = query(alertRef, orderBy('createdAt', 'desc'), limit(size));

  // const alertSnapshot = await getDocs(alertQuery);

  let alertList = [];

  const alertSnapshot = onSnapshot(alertQuery, (snapShot: any) => {
    lastPage = snapShot.docs[snapShot.docs.length - 1];

    console.log(snapShot);

    // let alertList = [];
    // snapShot.forEach((doc) => {
    //   let newDoc = doc.data();
    //   newDoc['alertId'] = doc.id;
    //   // alertList.push(newDoc);
    //   alertList.push(newDoc);
    //   // alertList = [...temp];
    //   console.log('j', alertList);
    // });
  });

  return { alertList, lastPage };
  // console.table('a', alertList);
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
export const readSelectedAlert = createAsyncThunk('deleteAllAlertList', async (payload: AlertDataType) => {
  const { nickname, selectedAlertList } = payload;

  selectedAlertList.forEach(async (alertId) => {
    const alertDoc = doc(db, `${nickname}/${alertId}`);
    await updateDoc(alertDoc, { isRead: true });
  });
});

export const readAllAlert = createAsyncThunk('deleteAllAlertList', async (payload: AlertDataType) => {
  const { nickname, selectedAlertList } = payload;
});

// 알림 리스트 조회
// export const getAlertList = createAsyncThunk('getAlertList', async (params: AlertDataType) => {
//   try {
//     const { data } = await http.get('/alert', { params });

//     return data.data;
//   } catch (err) {
//     Toastify({
//       text: message.GetAlertListFail,
//       duration: 1500,
//       position: 'center',
//       stopOnFocus: true,
//       style: toastifyCSS.fail,
//     }).showToast();

//     console.error(err);

//     return [];
//   }
// });

// // 알림 리스트 추가 조회
// export const getAlertListMore = createAsyncThunk('getAlertListMore', async (payload: AlertDataType) => {
//   try {
//     const { data } = await http.get('/alert', { params: { page: payload.page } });

//     return data.data;
//   } catch (err) {
//     Toastify({
//       text: message.GetAlertListFail,
//       duration: 1500,
//       position: 'center',
//       stopOnFocus: true,
//       style: toastifyCSS.fail,
//     }).showToast();

//     console.error(err);

//     return [];
//   }
// });

// // 알림 삭제
// export const deleteAlert = async (alertId: number) => {
//   try {
//     const { data } = await http.delete(`/alert/${alertId}`);

//     return data;
//   } catch (err) {
//     Toastify({
//       text: message.DeleteAlertFail,
//       duration: 1500,
//       position: 'center',
//       stopOnFocus: true,
//       style: toastifyCSS.fail,
//     }).showToast();

//     console.error(err);

//     return [];
//   }
// };
