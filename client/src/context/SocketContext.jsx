import { createContext, useState, useEffect, useContext } from 'react';
import io from 'socket.io-client';
import { useSelector } from 'react-redux';

const SocketContext = createContext();

export const useSocketContext = () => {
  return useContext(SocketContext);
};

export const SocketContextProvider = ({ children }) => {
  const [socket, setSocket] = useState(null);
  const { user: authUser } = useSelector((state) => state.auth);

  useEffect(() => {
    if (authUser) {
      const newSocket = io('http://localhost:5000', { // Your server URL
        query: {
          userId: authUser._id,
        },
      });

      setSocket(newSocket);

      // Cleanup function to close the socket when the component unmounts
      return () => newSocket.close();
    } else {
      if (socket) {
        socket.close();
        setSocket(null);
      }
    }
  }, [authUser]);

  return <SocketContext.Provider value={{ socket }}>{children}</SocketContext.Provider>;
};