import { createSlice } from '@reduxjs/toolkit';
import { PlantType } from './plantType';
import * as plantAPI from './plantAPI';

interface PlantState {
  // 검색용
  searchPlantList: Array<PlantType>;
  isStopedAtPlant: boolean;
  pageAtPlant: number;
}

const initialState: PlantState = {
  // 검색용
  searchPlantList: [],
  isStopedAtPlant: false,
  pageAtPlant: 0,
};

const plantSlice = createSlice({
  name: 'plant',
  initialState,

  reducers: {},

  extraReducers(builder) {
    builder
      .addCase(plantAPI.searchByPlantName.fulfilled, (state, action) => {
        console.log('55');
        if (action.payload.length === 0) {
          state.isStopedAtPlant = true;
        }
        console.log('payload : ', action.payload);
        state.pageAtPlant = 1;
        state.searchPlantList = action.payload?.content;
      })
      .addCase(plantAPI.searchByPlantNameMore.fulfilled, (state, action) => {
        if (action.payload.length === 0) {
          state.isStopedAtPlant = true;
        }
        state.pageAtPlant = state.pageAtPlant + 1;
        state.searchPlantList = [...state.searchPlantList, ...action.payload?.content];
      });
  },
});

export default plantSlice.reducer;
