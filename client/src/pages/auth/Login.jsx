import { useState } from "react";
import { useDispatch } from "react-redux";
import { Link, useNavigate } from "react-router-dom";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import axios from "axios";
import { setUser } from "../../store/slices/authSlice";
import { AUTH_API_URL } from "../../utils/constant";
import toast from "react-hot-toast";

const Login = () => {
    const [isLoading, setIsLoading] = useState(false);
  const [formData, setFormData] = useState({
    email: "",
    password: "",
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
      const response = await axios.post(`${AUTH_API_URL}/login`, formData, {
        headers: {
          "Content-Type": "application/json",
        },
        withCredentials: true,
      });
      if (response.status === 200) {
        setIsLoading(false);
        dispatch(setUser(response.data.user));
        toast.success("Login successful");
        navigate("/");
      } else {
        setIsLoading(false);
        toast.error("Login failed");
        console.error("Login failed", response.data);
      }
    } catch (error) {
        toast.error("Login failed");
        setIsLoading(false);
      console.error("Login failed", error);
      // Handle login error (e.g., show a notification)
    }
  };

  return (
    <div className="flex flex-col items-center rounded-xl justify-center">
      <div className="w-full  max-w-sm p-8 space-y-4 rounded-xl bg-gray-600 mb-5">
        <h1 className="text-4xl font-serif text-center mb-8">
          <span className="text-sky-500 new-font">F</span>
          <span className="text-red-500 new-font">r</span>
          <span className="text-violet-500 new-font">a</span>
          <span className="text-yellow-500 new-font">m</span>
          <span className="text-orange-500 new-font">e</span>
          <span className="text-blue-500 new-font">l</span>
          <span className="text-pink-500 new-font">y</span>
        </h1>
        <form onSubmit={handleSubmit} className="space-y-5">
          <div className="space-y-5">
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
              className="w-full px-4 py-2.5  text-black border bg-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-400"
              required
            />
          </div>
          <div className="mt-2 text-right">
          <a href="#" className="text-xs text-sky-300">
            Forgot password?
          </a>
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
                    <span>Log In</span>
                )
              }
            </button>
          </div>
        </form>
      </div>

      <div className="w-full max-w-sm p-4 text-center bg-gray-600  rounded-xl">
        <p className="text-sm">
          Don't have an account?{" "}
          <Link
            to="/signup"
            className="font-semibold text-sky-400 ml-2 hover:underline"
          >
            Sign up
          </Link>
        </p>
      </div>
    </div>
  );
};

export default Login;
