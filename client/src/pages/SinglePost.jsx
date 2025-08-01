import { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import axios from 'axios';
import SinglePostCard from '../components/post/SinglePostCard'; // <-- Use the new component
import PostCardSkeleton from '../components/PostCardSkeleton';
import { POST_API_URL } from '../utils/constant';

const SinglePost = () => {
  const { postId } = useParams();
  const [post, setPost] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchPost = async () => {
      setIsLoading(true);
      try {
        const { data } = await axios.get(`${POST_API_URL}/${postId}`, {
          withCredentials: true,
        });
        if (data.success) {
          setPost(data.post);
        }
      } catch (err) {
        setError(err.response?.data?.message || 'Failed to fetch post.');
      } finally {
        setIsLoading(false);
      }
    };
    fetchPost();
  }, [postId]);

  if (isLoading) {
    return (
      <div className="flex justify-center pt-10">
        <PostCardSkeleton />
      </div>
    );
  }

  if (error) {
    return <div className="text-center text-red-500 mt-10">Error: {error}</div>;
  }

  return (
    <div className="flex justify-center pt-10">
      {post ? (
        // Pass the fetched post to the new component
        <SinglePostCard initialPost={post} />
      ) : (
        <div className="text-white">Post not found.</div>
      )}
    </div>
  );
};

export default SinglePost;