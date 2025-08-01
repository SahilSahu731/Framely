import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  allPosts: [],
  isLoading: false,
  error: null,
};

const postSlice = createSlice({
  name: 'posts',
  initialState,
  reducers: {
    setLoading: (state, action) => {
      state.isLoading = action.payload;
    },
    setPosts: (state, action) => {
      state.allPosts = action.payload;
    },
    setError: (state, action) => {
      state.error = action.payload;
    },
    addPost: (state, action) => {
      state.allPosts.unshift(action.payload);
    },
    addCommentToPost: (state, action) => {
      const { postId, comment } = action.payload;
      const postIndex = state.allPosts.findIndex((p) => p._id === postId);
      if (postIndex !== -1) {
        state.allPosts[postIndex].comments.push(comment);
      }
    },
  },
});

export const { setLoading, setPosts, setError, addPost, addCommentToPost } = postSlice.actions;

export default postSlice.reducer;