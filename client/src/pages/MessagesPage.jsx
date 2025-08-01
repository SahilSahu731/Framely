import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import axios from "axios";
import { Link, useParams } from "react-router-dom";
import { setSelectedConversation } from "../store/slices/chatSlice";
import MessageContainer from "../components/messages/MessageContainer";
import NewMessageModal from "../components/messages/NewMessageModal";
import { MessageSquarePlus } from "lucide-react";
import { USER_API_URL } from "../utils/constant";

const MessagesPage = () => {
    const [conversations, setConversations] = useState([]);
    const [loading, setLoading] = useState(false);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const { selectedConversation } = useSelector(state => state.chat);
    const dispatch = useDispatch();
    const { id } = useParams(); // The ID of the user to chat with from the URL

    // Fetch existing conversations for the sidebar
    useEffect(() => {
        const getConversations = async () => {
            try {
                const { data } = await axios.get(`${USER_API_URL}/conversations`, { withCredentials: true });
                setConversations(data);
            } catch (error) {
                console.error("Error fetching conversations", error);
            }
        };
        getConversations();
    }, []);
    
    // This is the key logic to handle selecting a conversation
    useEffect(() => {
        const findOrCreateConversation = async () => {
            if (!id) return; // Do nothing if there's no ID in the URL

            setLoading(true);
            // 1. Check if the user is in our existing conversation list
            const existingConversationUser = conversations.find(c => c._id === id);

            if (existingConversationUser) {
                dispatch(setSelectedConversation(existingConversationUser));
            } else {
                // 2. If not, it's a new chat. Fetch that user's details.
                try {
                    const { data: newUser } = await axios.get(`${USER_API_URL}/${id}`, { withCredentials: true });
                    dispatch(setSelectedConversation(newUser));
                    // Optional: Add them to the conversation list for a better UI experience
                    if (!conversations.some(c => c._id === newUser._id)) {
                        setConversations(prev => [newUser, ...prev]);
                    }
                } catch (error) {
                    console.error("Failed to fetch user for new chat", error);
                }
            }
            setLoading(false);
        };

        findOrCreateConversation();

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
                                <div className={`p-4 flex items-center space-x-3 hover:bg-sky-500 mb-3 rounded-md mr-2 ${selectedConversation?._id === user._id ? 'bg-sky-600' : ''}`}>
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
                    {loading ? (
                        <div className="flex items-center justify-center h-full">Loading chat...</div>
                    ) : (
                        <MessageContainer />
                    )}
                </div>
            </div>
            <NewMessageModal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} />
        </>
    );
};

export default MessagesPage;