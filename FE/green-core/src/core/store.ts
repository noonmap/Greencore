import { configureStore, ThunkAction, Action } from '@reduxjs/toolkit';

import counterReduer from './temp/counter/counterSlice';
import postReducer from './temp/post/postSlice';
import diaryReducer from './diary/diarySlice';
import alertReducer from './alert/alertSlice';

export function makeStore() {
  return configureStore({
    reducer: {
      counter: counterReduer,
      post: postReducer,
      diary: diaryReducer,
      alert: alertReducer,
    },
  });
}

const store = makeStore();

export type AppState = ReturnType<typeof store.getState>;

export type AppDispatch = typeof store.dispatch;

export type AppThunk<ReturnType = void> = ThunkAction<ReturnType, AppState, unknown, Action<string>>;

export default store;
