import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  profile: null,
  posts: [],
  isLoading: true,
  error: null,
};

const profileSlice = createSlice({
  name: 'profile',
  initialState,
  reducers: {
    setProfileLoading: (state, action) => {
      state.isLoading = action.payload;
    },
    setProfileData: (state, action) => {
      state.profile = action.payload.user;
      state.posts = action.payload.posts;
      state.isLoading = false;
      state.error = null;
    },
    setProfileError: (state, action) => {
      state.isLoading = false;
      state.error = action.payload;
    },
    toggleFollow: (state, action) => {
        const { userId } = action.payload;
        if (state.profile.followers.includes(userId)) {
            state.profile.followers = state.profile.followers.filter(id => id !== userId);
        } else {
            state.profile.followers.push(userId);
        }
    }
  },
});

export const { setProfileLoading, setProfileData, setProfileError, toggleFollow } = profileSlice.actions;
export default profileSlice.reducer;