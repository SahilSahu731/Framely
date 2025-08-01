import { useState, useEffect } from 'react';
import axios from 'axios';
import toast from 'react-hot-toast';
import { Heart, MessageCircle, Send, MoreHorizontal } from 'lucide-react';
import { useSelector } from 'react-redux';
import PostOptionsDialog from './PostOptionsDialog';
import { POST_API_URL } from '../../utils/constant';
// You may need to create these dialogs if they don't exist
// import PostOptionsDialog from './PostOptionsDialog';
// import AllCommentsDialog from './AllCommentsDialog';

const SinglePostCard = ({ initialPost }) => {
  const { user } = useSelector((state) => state.auth);
  // This component manages its own state, separate from Redux
  const [post, setPost] = useState(initialPost);
  const [newCommentText, setNewCommentText] = useState('');
  const [showOptions, setShowOptions] = useState(false);

  // When the initial post prop changes, update the local state
  useEffect(() => {
    setPost(initialPost);
  }, [initialPost]);

  if (!post || !post.author) {
    return null; // Or a loading skeleton
  }
  
  const isLikedByCurrentUser = post.likes.includes(user?._id);

  const handleToggleLike = async () => {
    const originalLikes = post.likes;
    const newLikes = isLikedByCurrentUser
      ? post.likes.filter(id => id !== user._id)
      : [...post.likes, user._id];
    
    // Optimistic UI update
    setPost({ ...post, likes: newLikes });

    try {
      await axios.post(`${POST_API_URL}/${post._id}/like`, {}, { withCredentials: true });
    } catch (error) {
      toast.error('Something went wrong.');
      setPost({ ...post, likes: originalLikes }); // Revert on error
    }
  };

  const handleAddComment = async (e) => {
    e.preventDefault();
    if (!newCommentText.trim()) return;

    try {
      const { data } = await axios.post(
        `${POST_API_URL}/${post._id}/comment`,
        { text: newCommentText },
        { withCredentials: true }
      );

      if (data.success) {
        // Update local state with the new comment
        setPost({ ...post, comments: [...post.comments, data.comment] });
        setNewCommentText('');
      }
    } catch (error) {
      toast.error('Failed to add comment.');
    }
  };

  return (
    <>
    <div className="w-full max-w-xl mx-auto bg-gray-800 rounded-xl shadow-md mb-6 text-white">
      {/* Card Header */}
      <div className="p-4 flex items-center justify-between">
        <div className='flex items-center'>
          <img className="h-10 w-10 rounded-full object-cover" src={post.author.profilePicture} alt={`${post.author.username}'s avatar`} />
          <p className="ml-3 font-semibold">{post.author.username}</p>
        </div>
        <MoreHorizontal
            className="cursor-pointer"
            onClick={() => setShowOptions(true)}
            />
      </div>

      {/* Card Image */}
      <img className="w-full h-auto object-cover" src={post.image.url} alt="Post content" />

      <div className="p-4">
        {/* Actions */}
        <div className="flex items-center space-x-4 mb-2">
          <Heart onClick={handleToggleLike} className="cursor-pointer transition-colors" color={isLikedByCurrentUser ? '#FF0000' : '#FFFFFF'} fill={isLikedByCurrentUser ? '#FF0000' : 'none'} size={24} />
          <MessageCircle className="cursor-pointer hover:text-gray-400" size={24} />
          <Send className="cursor-pointer hover:text-gray-400" size={24} />
        </div>
        
        <p className="font-semibold text-sm">{post.likes.length} likes</p>

        {/* Caption */}
        <div className="text-sm mt-2">
          <span className="font-semibold mr-2">{post.author.username}</span>
          {post.caption}
        </div>

        {/* Comments Section */}
        <div className="mt-4 pt-3 border-t border-gray-700 space-y-3 max-h-60 overflow-y-auto">
          {post.comments.map((comment) => (
              <div key={comment._id} className="text-sm">
              <span className="font-semibold mr-2">{comment.author.username}</span>
              <span>{comment.text}</span>
            </div>
          ))}
        </div>

        {/* Add Comment Form */}
        <form onSubmit={handleAddComment} className="mt-4 flex border-t border-gray-700 pt-3">
          <input type="text" value={newCommentText} onChange={(e) => setNewCommentText(e.target.value)} placeholder="Add a comment..." className="flex-grow bg-transparent focus:outline-none text-sm" />
          <button type="submit" disabled={!newCommentText.trim()} className="text-sky-400 font-semibold text-sm disabled:text-gray-500">Post</button>
        </form>
      </div>
    </div>
    <PostOptionsDialog
        isOpen={showOptions}
        onClose={() => setShowOptions(false)}
        post={post}
        currentUser={user}
      />
          </>
  );
};

export default SinglePostCard;