import { createSlice } from '@reduxjs/toolkit';
import { SearchPlantType } from './plantType';
import * as plantAPI from './plantAPI';

interface PlantState {
  // 검색용
  searchPlantList: Array<SearchPlantType>;
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
        if (action.payload.length === 0) {
          state.isStopedAtPlant = true;
        }
        state.pageAtPlant = 1;
        state.searchPlantList = action.payload;
      })
      .addCase(plantAPI.searchByPlantNameMore.fulfilled, (state, action) => {
        if (action.payload.length === 0) {
          state.isStopedAtPlant = true;
        }
        state.pageAtPlant = state.pageAtPlant + 1;
        state.searchPlantList = [...state.searchPlantList, ...action.payload];
      });
  },
});

export default plantSlice.reducer;
