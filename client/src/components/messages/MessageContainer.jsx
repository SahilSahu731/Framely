import { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import axios from 'axios';
import { setMessages } from '../../store/slices/chatSlice';
import useListenMessages from '../../hooks/useListenMessages';
import MessageInput from './MessageInput';
import Message from './Message';
import { MESSAGE_API_URL } from '../../utils/constant';

const MessageContainer = () => {
  const dispatch = useDispatch();
  const { selectedConversation, messages } = useSelector((state) => state.chat);

  // Hook to listen for real-time incoming messages
  useListenMessages();

  useEffect(() => {
    const getMessages = async () => {
      if (!selectedConversation) return;
      try {
        const { data } = await axios.get(`${MESSAGE_API_URL}/${selectedConversation._id}`, { withCredentials: true });
        dispatch(setMessages(data));
      } catch (error) {
        console.error("Error fetching messages", error);
      }
    };
    getMessages();
  }, [selectedConversation, dispatch]);

  if (!selectedConversation) {
    return (
        <div className="flex items-center justify-center h-full">
            <p className="text-gray-400">Select a chat to start messaging</p>
        </div>
    );
  }

  return (
    <div className="flex flex-col h-full">
      {/* Header */}
      <div className="p-4 border-b border-gray-700">
        <span className="font-bold">{selectedConversation.username}</span>
      </div>

      {/* Messages */}
      <div className="flex-1 p-4 space-y-4 overflow-y-auto">
        {messages.map((msg) => (
          <Message key={msg._id} message={msg} />
        ))}
      </div>

      {/* Input */}
      <MessageInput />
    </div>
  );
};

export default MessageContainer;