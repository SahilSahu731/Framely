import { useEffect } from 'react';
import { useDispatch } from 'react-redux';
import { useSocketContext } from '../context/SocketContext';
import { addMessage } from '../store/slices/chatSlice';

const useListenMessages = () => {
  const { socket } = useSocketContext();
  const dispatch = useDispatch();

  useEffect(() => {
    // Listen for the 'newMessage' event from the socket server
    socket?.on('newMessage', (newMessage) => {
      // Add the incoming message to the Redux store
      dispatch(addMessage(newMessage));
    });

    // Cleanup function to remove the event listener when the component unmounts
    return () => socket?.off('newMessage');
  }, [socket, dispatch]);
};

export default useListenMessages;