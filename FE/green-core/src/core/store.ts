import { configureStore, ThunkAction, Action } from '@reduxjs/toolkit';

import counterReduer from './temp/counter/counterSlice';
import postReducer from './temp/post/postSlice';

import commonReducer from './common/commonSlice';
import userReducer from './user/userSlice';
import diaryReducer from './diary/diarySlice';
import alertReducer from './alert/alertSlice';
import feedReducer from './feed/feedSlice';

export function makeStore() {
  return configureStore({
    reducer: {
      counter: counterReduer,
      post: postReducer,

      common: commonReducer,
      user: userReducer,
      diary: diaryReducer,
      alert: alertReducer,
      feed: feedReducer,
    },
    middleware: (getDefaultMiddleware) => getDefaultMiddleware({ serializableCheck: false }),
  });
}

const store = makeStore();

export type AppState = ReturnType<typeof store.getState>;

export type AppDispatch = typeof store.dispatch;

export type AppThunk<ReturnType = void> = ThunkAction<ReturnType, AppState, unknown, Action<string>>;

export default store;
