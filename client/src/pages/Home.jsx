import { useState, useEffect } from 'react';
import { useSelector } from 'react-redux';
import PostCardSkeleton from '../components/PostCardSkeleton';
import PostCard from '../components/PostCard';
import StoryCarousel from '../components/StoryCarousel';
import Suggestions from '../components/Suggestions';

// --- Static Data for Demonstration ---
const staticPosts = [
  {
    username: "alex_doe",
    avatar: "https://i.pravatar.cc/150?u=alex_doe",
    postImage: "https://picsum.photos/seed/picsum1/800/600",
    caption: "Beautiful sunset at the beach! 🌅",
  },
  {
    username: "samantha_g",
    avatar: "https://i.pravatar.cc/150?u=samantha_g",
    postImage: "https://picsum.photos/seed/picsum2/800/600",
    caption: "Exploring the city streets. 🏙️",
  },
];


const Home = () => {
  const { user } = useSelector((state) => state.auth);
  const [isLoading, setIsLoading] = useState(true);

  // Simulate data fetching
  useEffect(() => {
    const timer = setTimeout(() => {
      setIsLoading(false);
    }, 2500); // 2.5 second loading simulation

    return () => clearTimeout(timer);
  }, []);


  return (
     <div className="w-full flex justify-center">
      <div className="flex-grow max-w-2xl">
        <StoryCarousel />

        <div className="space-y-6">
          {isLoading ? (
            <>
              <PostCardSkeleton />
              <PostCardSkeleton />
            </>
          ) : (
            staticPosts.map((post, index) => (
              <PostCard
                key={index}
                username={post.username}
                avatar={post.avatar}
                postImage={post.postImage}
                caption={post.caption}
              />
            ))
          )}
        </div>
      </div>
      <div className='w-80 p-4 text-white -mr-20'>
        <Suggestions />
      </div>
    </div>
  );
};

export default Home;