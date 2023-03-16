import { createSlice } from '@reduxjs/toolkit';

interface PlantState {}

const initialState: PlantState = {};

const plantSlice = createSlice({
  name: 'plant',
  initialState,

  reducers: {},

  extraReducers(builder) {},
});

export default plantSlice.reducer;
