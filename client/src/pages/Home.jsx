import { useState, useEffect } from 'react';
import { useSelector } from 'react-redux';
import PostCardSkeleton from '../components/PostCardSkeleton';
import PostCard from '../components/PostCard';
import StoryCarousel from '../components/story/StoryCarousel';
import Suggestions from '../components/Suggestions';
import usePosts from '../hooks/usePosts';
import useStories from '../hooks/useStories';
import { useOutletContext } from 'react-router-dom';


const Home = () => {
  usePosts();
  useStories();
  const { user } = useSelector((state) => state.auth);
  const {allPosts, isLoading} = useSelector((state) => state.posts)


  // Simulate data fetching
 if (isLoading) {
    return (
      <div className="w-full pt-6">
        <StoryCarousel />
        <div className="space-y-6 mt-6">
          <PostCardSkeleton />
          <PostCardSkeleton />
        </div>
      </div>
    );
  }

  return (
      <div className="w-full pt-6">
      <StoryCarousel />
      <div className="space-y-6 mt-6">
        {allPosts.length > 0 ? (
          allPosts.map((post) => <PostCard key={post._id} post={post} />)
        ) : (
          <div className="text-center text-gray-400 mt-10">
            <p>No posts yet.</p>
            <p>Follow someone or create your first post!</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default Home;