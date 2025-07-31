import { useState } from 'react';
import axios from 'axios';
import toast from 'react-hot-toast';
import { Heart, MessageCircle, Send } from 'lucide-react';
import { POST_API_URL } from '../utils/constant';

const PostCard = ({ post }) => {
  // Use state to manage comments for real-time updates
  const [comments, setComments] = useState(post.comments || []);
  const [newCommentText, setNewCommentText] = useState('');

  const handleAddComment = async (e) => {
    e.preventDefault();
    if (!newCommentText.trim()) return;

    try {
      const { data } = await axios.post(
        `${POST_API_URL}${post._id}/comment`,
        { text: newCommentText },
        { withCredentials: true }
      );

      if (data.success) {
        // Add the new comment returned from the API to our local state
        setComments([...comments, data.comment]);
        setNewCommentText(''); // Clear the input field
      }
    } catch (error) {
      toast.error('Failed to add comment.');
      console.error('Error adding comment:', error);
    }
  };

  return (
    <div className="w-full max-w-xl mx-auto bg-gray-800 rounded-xl shadow-md overflow-hidden mb-6 text-white">
      {/* Card Header */}
      <div className="p-4 flex items-center">
        <img
          className="h-10 w-10 rounded-full object-cover"
          src={post.author.profilePicture} // Assuming author is populated
          alt={`${post.author.username}'s avatar`}
        />
        <p className="ml-3 font-semibold">{post.author.username}</p>
      </div>

      {/* Card Image */}
      <img className="w-full h-auto object-cover" src={post.imageUrl} alt="Post content" />

      <div className="p-4">
        {/* Card Actions */}
        <div className="flex space-x-4 mb-4">
          <Heart className="cursor-pointer hover:text-red-500" size={24} />
          <MessageCircle className="cursor-pointer hover:text-gray-400" size={24} />
          <Send className="cursor-pointer hover:text-gray-400" size={24} />
        </div>

        {/* Caption */}
        <div className="text-sm">
          <span className="font-semibold mr-2">{post.author.username}</span>
          {post.caption}
        </div>

        {/* Comments Section */}
        <div className="mt-3 space-y-2 max-h-40 overflow-y-auto text-sm">
          {comments.map((comment, index) => (
            <div key={index}>
              <span className="font-semibold mr-2">{comment.author.username}</span>
              <span>{comment.text}</span>
            </div>
          ))}
        </div>

        {/* Add Comment Form */}
        <form onSubmit={handleAddComment} className="mt-4 flex border-t border-gray-700 pt-3">
          <input
            type="text"
            value={newCommentText}
            onChange={(e) => setNewCommentText(e.target.value)}
            placeholder="Add a comment..."
            className="flex-grow bg-transparent focus:outline-none text-sm"
          />
          <button
            type="submit"
            disabled={!newCommentText.trim()}
            className="text-sky-400 font-semibold text-sm disabled:text-gray-500 disabled:cursor-not-allowed"
          >
            Post
          </button>
        </form>
      </div>
    </div>
  );
};

export default PostCard;