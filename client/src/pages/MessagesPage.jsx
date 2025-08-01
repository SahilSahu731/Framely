import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import axios from "axios";
import { Link, useParams } from "react-router-dom";
import { setSelectedConversation } from "../store/slices/chatSlice"; // Assuming chatSlice exists
import MessageContainer from "../components/messages/MessageContainer"; // We will create this
import { USER_API_URL } from "../utils/constant";
import NewMessageModal from "../components/messages/NewMessageModal";
import { MessageSquarePlus } from "lucide-react";

const MessagesPage = () => {
  const [conversations, setConversations] = useState([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const { selectedConversation } = useSelector((state) => state.chat); // Assuming chatSlice exists
  const dispatch = useDispatch();
  const { id } = useParams(); // To get the user ID from the URL

  useEffect(() => {
    const getConversations = async () => {
      try {
        // This is a new endpoint we need to create
        const { data } = await axios.get(`${USER_API_URL}/conversations`, {
          withCredentials: true,
        });
        setConversations(data);
      } catch (error) {
        console.error("Error fetching conversations", error);
      }
    };
    getConversations();
  }, []);

  // Set the selected conversation based on the URL parameter
  useEffect(() => {
    if (id && conversations.length > 0) {
      const conversation = conversations.find((c) => c._id === id);
      dispatch(setSelectedConversation(conversation));
    }
  }, [id, conversations, dispatch]);

  return (
     <>
            <div className="flex h-[calc(100vh-theme(space.24))] text-white bg-gray-900">
                <div className="w-1/3 border-r border-gray-700 overflow-y-auto flex flex-col">
                    <div className="p-4 border-b border-gray-700 flex justify-between items-center">
                        <h2 className="text-xl font-bold">Chats</h2>
                        <button onClick={() => setIsModalOpen(true)} className="p-2 hover:bg-gray-700 rounded-full">
                            <MessageSquarePlus size={20}/>
                        </button>
                    </div>
                    
                    {conversations.length > 0 ? (
                        conversations.map(user => (
                            <Link to={`/messages/${user._id}`} key={user._id}>
                                <div className={`p-4 flex items-center space-x-3 hover:bg-gray-700 ${selectedConversation?._id === user._id ? 'bg-gray-700' : ''}`}>
                                    <img src={user.profilePicture} alt={user.username} className="w-12 h-12 rounded-full"/>
                                    <div><p className="font-semibold">{user.username}</p></div>
                                </div>
                            </Link>
                        ))
                    ) : (
                        <div className="flex-grow flex flex-col items-center justify-center text-center text-gray-400 p-4">
                            <h3 className="font-semibold text-lg">No conversations yet</h3>
                            <p className="text-sm">Click the button above to start a new chat.</p>
                        </div>
                    )}
                </div>

                <div className="w-2/3">
                    <MessageContainer />
                </div>
            </div>
            <NewMessageModal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} />
        </>
  );
};

export default MessagesPage;
