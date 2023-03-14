import { createSlice } from '@reduxjs/toolkit';
import { UserInfoType } from './persistType';

interface PersistState {
  userInfo: UserInfoType;
}

const initialState: PersistState = {
  userInfo: { nickname: 'temp', profileImagePath: '/public/images/noProfile.png' },
};

// 이거 아직 사용예정에 있으므로 사용 ㄴㄴ
const persistSlice = createSlice({
  name: 'persist',
  initialState,

  reducers: {},

  extraReducers(builder) {},
});

export default persistSlice.reducer;
