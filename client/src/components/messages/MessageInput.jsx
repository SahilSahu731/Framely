import { useState } from 'react';
import axios from 'axios';
import { Send } from 'lucide-react';
import { useDispatch, useSelector } from 'react-redux';
import { addMessage } from '../../store/slices/chatSlice';
import { MESSAGE_API_URL } from '../../utils/constant';

const MessageInput = () => {
  const [message, setMessage] = useState('');
  const [loading, setLoading] = useState(false);
  const dispatch = useDispatch();
  const { selectedConversation } = useSelector((state) => state.chat);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!message.trim() || !selectedConversation) return;

    setLoading(true);
    try {
      const { data } = await axios.post(
        `${MESSAGE_API_URL}/send/${selectedConversation._id}`,
        { message },
        { withCredentials: true }
      );
      dispatch(addMessage(data));
      setMessage('');
    } catch (error) {
      console.error('Error sending message', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="p-4 border-t border-gray-700">
      <div className="relative">
        <input
          type="text"
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          placeholder="Send a message..."
          className="w-full bg-gray-600 border border-gray-500 rounded-full p-3 pr-12 focus:outline-none focus:ring-2 focus:ring-sky-500"
        />
        <button
          type="submit"
          disabled={loading || !message.trim()}
          className="absolute right-2 top-1/2 -translate-y-1/2 p-2 bg-sky-500 rounded-full hover:bg-sky-600 disabled:bg-gray-500"
        >
          <Send size={20} />
        </button>
      </div>
    </form>
  );
};

export default MessageInput;