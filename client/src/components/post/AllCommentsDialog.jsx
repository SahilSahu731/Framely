import { useState } from 'react';
import axios from 'axios';
import { useDispatch } from 'react-redux';
import { addCommentToPost } from '../../store/slices/postSlice';
import { POST_API_URL } from '../../utils/constant';

const AllCommentsDialog = ({ isOpen, onClose, post }) => {
  const dispatch = useDispatch();
  const [newCommentText, setNewCommentText] = useState('');

  if (!isOpen) return null;

  const handleAddComment = async (e) => {
    e.preventDefault();
    if (!newCommentText.trim()) return;

    try {
      const { data } = await axios.post(`${POST_API_URL}/${post._id}/comment`, { text: newCommentText }, { withCredentials: true });
      if (data.success) {
        dispatch(addCommentToPost({ postId: post._id, comment: data.comment }));
        setNewCommentText('');
      }
    } catch (error) {
      console.error('Failed to add comment:', error);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-70" onClick={onClose}>
      <div className="bg-gray-800 rounded-xl shadow-lg w-full max-w-md md:max-w-2xl text-white flex flex-col h-[70vh]" onClick={(e) => e.stopPropagation()}>
        <h2 className="text-xl font-semibold p-4 border-b border-gray-700 text-center">Comments</h2>
        <div className="flex-grow p-4 space-y-4 overflow-y-auto">
          {post.comments.map((comment) => (
            <div key={comment._id} className="flex items-start space-x-3">
              <img src={comment.author.profilePicture} alt={comment.author.username} className="w-8 h-8 rounded-full"/>
              <div>
                <p className="text-sm">
                  <span className="font-semibold mr-2">{comment.author.username}</span>
                  {comment.text}
                </p>
              </div>
            </div>
          ))}
        </div>
        <form onSubmit={handleAddComment} className="flex border-t border-gray-700 p-3">
          <input type="text" value={newCommentText} onChange={(e) => setNewCommentText(e.target.value)} placeholder="Add a comment..." className="flex-grow bg-transparent focus:outline-none text-sm"/>
          <button type="submit" disabled={!newCommentText.trim()} className="text-sky-400 font-semibold text-sm disabled:text-gray-500">Post</button>
        </form>
      </div>
    </div>
  );
};

export default AllCommentsDialog;