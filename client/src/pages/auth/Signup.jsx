import { useState } from 'react';
import { useDispatch } from 'react-redux';
import { Link, useNavigate } from 'react-router-dom';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import axios from 'axios';
import { setUser } from '../../store/slices/authSlice';
import { AUTH_API_URL } from '../../utils/constant';
import toast from 'react-hot-toast';

const Signup = () => {
    const [isLoading, setIsLoading] = useState(false);
  const [formData, setFormData] = useState({
    username: '',
    email: '',
    password: '',
    fullName: '',
  });
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
        setIsLoading(true);
      const response = await axios.post(`${AUTH_API_URL}/register`, formData, {
        headers: {
          'Content-Type': 'application/json',
        },
        withCredentials: true,
      });
      if (response.status === 201) {
        setIsLoading(false);
        dispatch(setUser(response.data.user));
        toast.success('Signup successful');
        navigate('/');
      } else {
        setIsLoading(false);
        console.error('Signup failed', response.data);
        toast.error('Signup failed');
      }
    } catch (error) {
        setIsLoading(false);
      console.error('Signup failed', error);
      toast.error('Signup failed');
    }
  };

  return (
     <div className="flex flex-col items-center rounded-xl justify-center">
      <div className="w-full max-w-sm p-8 space-y-4 rounded-xl bg-gray-600 mb-5">
        <h1 className="text-4xl font-serif text-center mb-4">
          <span className="text-sky-500">F</span>
          <span className="text-red-500">r</span>
          <span className="text-violet-500">a</span>
          <span className="text-yellow-500">m</span>
          <span className="text-orange-500">e</span>
          <span className="text-blue-500">l</span>
          <span className="text-pink-500">y</span>
        </h1>
        <p className="text-center text-gray-400 mt-4 mb-7">
          Sign up to see photos and videos from your friends.
        </p>
        <form onSubmit={handleSubmit} className="space-y-5">
          <div className="space-y-4 mb-6">
            <input
              type="text"
              name="fullName"
              value={formData.fullName}
              onChange={handleChange}
              placeholder="Full Name"
              className="w-full bg-gray-300 px-4 py-2.5 text-black border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-400"
              required
            />
            <input
              type="text"
              name="username"
              value={formData.username}
              onChange={handleChange}
              placeholder="Username"
              className="w-full bg-gray-300 px-4 py-2.5 text-black border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-400"
              required
            />
            <input
              type="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              placeholder="Email address"
              className="w-full bg-gray-300 px-4 py-2.5 text-black border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-400"
              required
            />
            <input
              type="password"
              name="password"
              value={formData.password}
              onChange={handleChange}
              placeholder="Password"
              className="w-full px-4 py-2.5 text-black border bg-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-400"
              required
            />
          </div>
          <div>
            <button
              type="submit"
              className="w-full py-2 font-semibold text-white uppercase bg-sky-500 rounded-lg hover:bg-sky-600 focus:outline-none focus:ring-2 focus:ring-sky-400"
            >
                {
                    isLoading ? (
                        <span>Loading...</span>
                    ) : (
                        <span>Sign Up</span>
                    )
                }
            </button>
          </div>
        </form>
      </div>

      <div className="w-full max-w-sm p-4 text-center bg-gray-600 rounded-xl">
        <p className="text-sm text-gray-200">
          Have an account?{" "}
          <Link
            to="/login"
            className="font-semibold text-sky-400 ml-2 hover:underline"
          >
            Log in
          </Link>
        </p>
      </div>
    </div>
  );
};

export default Signup;