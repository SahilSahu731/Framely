import { useEffect, useState } from 'react';
import axios from 'axios';
import { Link } from 'react-router-dom';
import { X } from 'lucide-react';
import { USER_API_URL } from '../../utils/constant';

const NewMessageModal = ({ isOpen, onClose }) => {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (isOpen) {
      const fetchUsers = async () => {
        setLoading(true);
        try {
          const { data } = await axios.get(`${USER_API_URL}`, { withCredentials: true });
          setUsers(data);
        } catch (error) {
          console.error('Failed to fetch users', error);
        } finally {
          setLoading(false);
        }
      };
      fetchUsers();
    }
  }, [isOpen]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-70" onClick={onClose}>
      <div className="bg-gray-800 rounded-xl shadow-lg w-full max-w-md text-white flex flex-col h-[70vh]" onClick={(e) => e.stopPropagation()}>
        <div className="flex justify-between items-center p-4 border-b border-gray-700">
            <h2 className="text-xl font-semibold">New Message</h2>
            <X className="cursor-pointer" onClick={onClose}/>
        </div>
        <div className="flex-grow p-2 space-y-2 overflow-y-auto">
          {loading && <p className="text-center text-gray-400">Loading users...</p>}
          {!loading && users.map(user => (
            <Link to={`/messages/${user._id}`} key={user._id} onClick={onClose}>
                <div className="p-3 flex items-center space-x-4 rounded-lg hover:bg-gray-700">
                    <img src={user.profilePicture} alt={user.username} className="w-12 h-12 rounded-full"/>
                    <div>
                        <p className="font-semibold">{user.username}</p>
                        <p className="text-sm text-gray-400">{user.fullName}</p>
                    </div>
                </div>
            </Link>
          ))}
        </div>
      </div>
    </div>
  );
};

export default NewMessageModal;