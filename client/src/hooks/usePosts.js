import { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import axios from 'axios';
import toast from 'react-hot-toast';
import { POST_API_URL } from '../utils/constant';
import { setError, setLoading, setPosts } from '../store/slices/postSlice';

const usePosts = () => {
  const dispatch = useDispatch();

  const fetchPosts = async () => {
   dispatch(setLoading(true));
   try {
     const { data } = await axios.get(`${POST_API_URL}`, {
       withCredentials: true,
     });

     if (data.success && Array.isArray(data.posts)) {
       dispatch(setPosts(data.posts));
     } else {
       throw new Error('Received invalid data format from server.');
     }
   } catch (err) {
     const errorMessage = err.response?.data?.message || 'Failed to fetch posts.';
     dispatch(setError(errorMessage));
     toast.error(errorMessage);
   } finally {
     dispatch(setLoading(false));
   }
 };

  useEffect(() => {

    fetchPosts();

  }, [dispatch]); //eslint-disable-line
};

export default usePosts;