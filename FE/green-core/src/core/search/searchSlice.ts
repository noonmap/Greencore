import { createSlice, PayloadAction } from '@reduxjs/toolkit';

interface CommonState {
  searchTag: string;
}

const initialState: CommonState = {
  searchTag: '',
};

const searchSlice = createSlice({
  name: 'search',
  initialState,

  reducers: {
    SET_SEARCH_TAG: (state, action: PayloadAction<string>) => {
      state.searchTag = action.payload;
    },
  },
});

export const { SET_SEARCH_TAG } = searchSlice.actions;

export default searchSlice.reducer;
