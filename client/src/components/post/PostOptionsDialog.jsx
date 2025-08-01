import axios from "axios";
import toast from "react-hot-toast";
import { useDispatch } from "react-redux";
import { deletePostFromState } from "../../store/slices/postSlice"; // We'll create this next
import { POST_API_URL } from "../../utils/constant";
import { Link } from "react-router-dom";

const PostOptionsDialog = ({ isOpen, onClose, post, currentUser }) => {
  const dispatch = useDispatch();
  if (!isOpen) return null;

  const isAuthor = currentUser?._id === post.author._id;

  const handleDelete = async () => {
    if (!window.confirm("Are you sure you want to delete this post?")) return;

    const toastId = toast.loading("Deleting post...");
    try {
      await axios.delete(`${POST_API_URL}/${post._id}`, {
        withCredentials: true,
      });
      dispatch(deletePostFromState(post._id));
      toast.success("Post deleted.", { id: toastId });
      onClose();
    } catch (error) {
      toast.error("Failed to delete post.", { id: toastId });
      console.error("Error deleting post:", error);
    }
  };

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-70"
      onClick={onClose}
    >
      <div
        className="bg-gray-800 rounded-xl shadow-lg w-full max-w-xs text-white text-center"
        onClick={(e) => e.stopPropagation()}
      >
        <ul className="py-2">
          {isAuthor && (
            <li
              onClick={handleDelete}
              className="font-bold text-red-500 py-3 px-4 cursor-pointer hover:bg-gray-700"
            >
              Delete
            </li>
          )}
          <li className="py-3 px-4 cursor-pointer hover:bg-gray-700 border-t border-gray-700">
            Report
          </li>
          <Link to={`/post/${post._id}`}>
            <li className="py-3 px-4 cursor-pointer hover:bg-gray-700 border-t border-gray-700">
              Go to post
            </li>
          </Link>
          <li
            onClick={onClose}
            className="py-3 px-4 cursor-pointer hover:bg-gray-700 border-t border-gray-700"
          >
            Cancel
          </li>
        </ul>
      </div>
    </div>
  );
};

export default PostOptionsDialog;
