import { useState } from "react";
import axios from "axios";
import toast from "react-hot-toast";
import {
  Heart,
  HeartIcon,
  MessageCircle,
  MoreHorizontal,
  Send,
} from "lucide-react";
import { POST_API_URL } from "../utils/constant";
import { useDispatch, useSelector } from "react-redux";
import { addCommentToPost, toggleLike } from "../store/slices/postSlice";
import PostOptionsDialog from "./post/PostOptionsDialog";
import AllCommentsDialog from "./post/AllCommentsDialog";
import { Link, Links } from "react-router-dom";

const PostCard = ({ post }) => {
  const dispatch = useDispatch();
  const { user } = useSelector((state) => state.auth);
  const [showOptions, setShowOptions] = useState(false);
  const [showComments, setShowComments] = useState(false);

  const [newCommentText, setNewCommentText] = useState("");

  // Determine if the current user has liked this post
  const isLikedByCurrentUser = post.likes.includes(user?._id);

  const handleToggleLike = async () => {
    // Optimistic UI update: Dispatch the action immediately
    dispatch(toggleLike({ postId: post._id, userId: user._id }));

    try {
      // Then, send the request to the server
      await axios.post(
        `${POST_API_URL}/${post._id}/like`,
        {},
        { withCredentials: true }
      );
    } catch (error) {
      toast.error("Something went wrong.");
      // If the API call fails, revert the UI change
      dispatch(toggleLike({ postId: post._id, userId: user._id }));
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
        dispatch(addCommentToPost({ postId: post._id, comment: data.comment }));
        setNewCommentText("");
      }
    } catch (error) {
      toast.error("Failed to add comment.");
      console.error("Error adding comment:", error);
    }
  };

  return (
    <>
      <div className="w-full md:max-w-2xl max-w-md mx-auto bg-gray-800 rounded-xl shadow-md mb-6 text-white">
        {/* Card Header */}
        <div className="p-4 flex items-center justify-between">
          <Link to={`/profile/${post.author.username}`}>
            <div className="flex items-center">
              <img
                className="h-10 w-10 rounded-full object-cover"
                src={post.author.profilePicture}
                alt={`${post.author.username}'s avatar`}
              />
              <p className="ml-3 font-semibold">{post.author.username}</p>
            </div>
          </Link>
          <MoreHorizontal
            className="cursor-pointer"
            onClick={() => setShowOptions(true)}
          />
        </div>

        {/* Card Image */}
        <img
          className="w-full h-auto object-cover"
          src={post.image.url}
          alt="Post content"
        />

        <div className="p-4">
          {/* Card Actions */}
          <div className="flex items-center space-x-4 mb-2">
            <HeartIcon
              className={`cursor-pointer hover:text-red-400 ${
                post.likes.includes(user?._id)
                  ? "text-red-500 fill-red-500"
                  : ""
              }`}
              size={24}
              onClick={() => handleToggleLike()}
            />
            <MessageCircle
              className="cursor-pointer hover:text-gray-400"
              size={24}
              onClick={() => setShowComments(true)}
            />
            <Send className="cursor-pointer hover:text-gray-400" size={24} />
          </div>

          <p className="font-semibold text-sm">{post.likes.length} likes</p>
          <div className="text-sm mt-2">
            <span className="font-semibold mr-2">{post.author.username}</span>
            {post.caption}
          </div>

          {/* Comments Section */}
          {post.comments.length > 0 && (
            <div className="mt-3 space-y-2 text-sm">
              {post.comments.slice(0, 3).map((comment) => (
                <div key={comment._id}>
                  <span className="font-semibold mr-2">
                    {comment.author.username}
                  </span>
                  <span>{comment.text}</span>
                </div>
              ))}
              <p
                onClick={() => setShowComments(true)}
                className="text-gray-400 cursor-pointer"
              >
                View all {post.comments.length} comments
              </p>
            </div>
          )}

          {/* Add Comment Form ... */}
        </div>
      </div>

      {/* Dialogs */}
      <PostOptionsDialog
        isOpen={showOptions}
        onClose={() => setShowOptions(false)}
        post={post}
        currentUser={user}
      />
      <AllCommentsDialog
        isOpen={showComments}
        onClose={() => setShowComments(false)}
        post={post}
      />
    </>
  );
};

export default PostCard;
