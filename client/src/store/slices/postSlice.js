import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  allPosts: [],
  isLoading: false,
  error: null,
};

const postSlice = createSlice({
  name: "posts",
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
    toggleLike: (state, action) => {
      const { postId, userId } = action.payload;
      const post = state.allPosts.find((p) => p._id === postId);

      if (post) {
        const isLiked = post.likes.includes(userId);
        if (isLiked) {
          // If liked, remove the userId from the likes array
          post.likes = post.likes.filter((id) => id !== userId);
        } else {
          // If not liked, add the userId to the likes array
          post.likes.push(userId);
        }
      }
    },
    deletePostFromState: (state, action) => {
      const postId = action.payload;
      state.allPosts = state.allPosts.filter((post) => post._id !== postId);
    },
  },
});

export const {
  setLoading,
  setPosts,
  setError,
  addPost,
  addCommentToPost,
  deletePostFromState,
  toggleLike,
} = postSlice.actions;

export default postSlice.reducer;
