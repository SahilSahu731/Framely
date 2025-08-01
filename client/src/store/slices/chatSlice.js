import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  selectedConversation: null,
  messages: [],
};

const chatSlice = createSlice({
  name: 'chat',
  initialState,
  reducers: {
    setSelectedConversation: (state, action) => {
      state.selectedConversation = action.payload;
    },
    setMessages: (state, action) => {
      state.messages = action.payload;
    },
    addMessage: (state, action) => {
      state.messages.push(action.payload);
    },
  },
});

export const { setSelectedConversation, setMessages, addMessage } = chatSlice.actions;
export default chatSlice.reducer;