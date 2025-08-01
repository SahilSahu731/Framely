import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  isCreatePostModalOpen: false,
  isCreateStoryModalOpen: false,
  viewingStoryUserId: null,
};

const uiSlice = createSlice({
  name: 'ui',
  initialState,
  reducers: {
    openCreatePostModal: (state) => {
      state.isCreatePostModalOpen = true;
    },
    closeCreatePostModal: (state) => {
      state.isCreatePostModalOpen = false;
    },
    openCreateStoryModal: (state) => {
      state.isCreateStoryModalOpen = true;
    },
    closeCreateStoryModal: (state) => {
      state.isCreateStoryModalOpen = false;
    },
    openStoryViewer: (state, action) => {
      state.viewingStoryUserId = action.payload;
    },
    closeStoryViewer: (state) => {
      state.viewingStoryUserId = null;
    },
  },
});

export const {
  openCreatePostModal,
  closeCreatePostModal,
  openCreateStoryModal,
  closeCreateStoryModal,
  openStoryViewer,
  closeStoryViewer,
} = uiSlice.actions;

export default uiSlice.reducer;