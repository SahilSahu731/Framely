import { useEffect, useState } from 'react';
import axios from 'axios';
import { Link } from 'react-router-dom';
import { POST_API_URL } from '../utils/constant';

const ExplorePage = () => {
  const [posts, setPosts] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchExplorePosts = async () => {
      try {
        const { data } = await axios.get(`${POST_API_URL}/explore`, { withCredentials: true });
        if (data.success) {
          setPosts(data.posts);
        }
      } catch (error) {
        console.error('Failed to fetch explore feed:', error);
      } finally {
        setIsLoading(false);
      }
    };
    fetchExplorePosts();
  }, []);

  return (
    <div className="text-white max-w-5xl mx-auto p-4">
      <h1 className="text-3xl font-bold mb-6">Explore</h1>
      {posts.length === 0 && <p className="text-center mt-24 text-lg text-gray-400">No posts found of your follwing. Please follow some users to see their posts.</p>}
      {isLoading ? (
        <div className="text-center">Loading...</div>
      ) : (
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-1 md:gap-4">
          {posts.map((post) => (
            <Link to={`/post/${post._id}`} key={post._id} className="relative aspect-square group">
              <img
                src={post.image.url}
                alt={post.caption}
                className="w-full h-full object-cover rounded-md"
              />
              <div className="absolute inset-0 bg-black bg-opacity-40 flex items-center justify-center gap-4 text-white opacity-0 group-hover:opacity-100 transition-opacity">
                <span>❤️ {post.likes.length}</span>
                <span>💬 {post.comments.length}</span>
              </div>
            </Link>
          ))}
        </div>
      )}
    </div>
  );
};

export default ExplorePage;