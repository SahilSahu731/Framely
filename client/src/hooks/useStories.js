import { useEffect } from 'react';
import { useDispatch } from 'react-redux';
import axios from 'axios';
import { setStoriesLoading, setStories, setStoriesError } from '../store/slices/storySlice';
import { STORY_API_URL } from '../utils/constant';

const useStories = () => {
  const dispatch = useDispatch();

  useEffect(() => {
    const fetchStories = async () => {
      dispatch(setStoriesLoading(true));
      try {
        const { data } = await axios.get(`${STORY_API_URL}`, {
          withCredentials: true,
        });
        if (data.success) {
          dispatch(setStories(data.stories));
        }
      } catch (err) {
        const message = err.response?.data?.message || 'Failed to fetch stories.';
        dispatch(setStoriesError(message));
      }
    };

    fetchStories();
  }, [dispatch]);
};

export default useStories;