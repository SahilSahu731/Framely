import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  stories: [],
  isLoading: false,
  error: null,
};

const storySlice = createSlice({
  name: 'stories',
  initialState,
  reducers: {
    setStoriesLoading: (state, action) => {
      state.isLoading = action.payload;
    },
    setStories: (state, action) => {
      state.isLoading = false;
      state.stories = action.payload;
      state.error = null;
    },
    setStoriesError: (state, action) => {
      state.isLoading = false;
      state.error = action.payload;
    },
  },
});

export const { setStoriesLoading, setStories, setStoriesError } = storySlice.actions;

export default storySlice.reducer;