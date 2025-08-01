import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate,
  useNavigate,
} from "react-router-dom";
import { useSelector } from "react-redux";

// Layouts

// Pages
import AuthLayout from "./components/layout/AuthLayout";
import Login from "./pages/auth/Login";
import Signup from "./pages/auth/Signup";
import { useEffect } from "react";
import Home from "./pages/Home";
import MainLayout from "./components/layout/MainLayout";
import NotFoundPage from "./components/NotFoundPage";
import Profile from "./pages/user/Profile";
import EditProfilePage from "./pages/user/EditProfilePage";
import SinglePost from "./pages/SinglePost";
import SearchPage from "./pages/SearchPage";
import NotificationPage from "./pages/NotificationPage";
import ExplorePage from "./pages/ExplorePage";
import MessagesPage from "./pages/MessagesPage";
import MoreForYou from "./pages/MoreForYou";

// Route Protection
// const ProtectedRoute = ({ children }) => {
//   const { user } = useSelector((state) => state.auth);
//   return user ? children : <Navigate to="/login" />;
// };

const AdminRoute = ({ children }) => {
  const { user } = useSelector((state) => state.auth);
  return user && user.isAdmin ? children : <Navigate to="/" />;
};

function App() {
  const { user } = useSelector((state) => state.auth);
  const navigate = useNavigate();

  useEffect(() => {
    if (user) {
      navigate("/");
    }
  }, [user]);

  useEffect(() => {
    if (!user) {
      navigate("/login");
    }
  }, [user]);

  return (
    <Routes>
      {/* Authentication Routes */}
      <Route element={<AuthLayout />}>
        <Route path="/login" element={<Login />} />
        <Route path="/signup" element={<Signup />} />
      </Route>

      <Route path="/" element={<MainLayout />}>
        <Route index element={<Home />} />
        <Route path="profile/:username" element={<Profile />} />
        <Route path="accounts/edit" element={<EditProfilePage />} />
        <Route path="post/:id" element={<SinglePost />} />
        <Route path="/search" element={<SearchPage />} />
        <Route path="/notifications" element={<NotificationPage />} />
        <Route path="/explore" element={<ExplorePage />} />
        <Route path="messages" element={<MessagesPage />} />
        <Route path="messages/:id" element={<MessagesPage />} />
        <Route path="*" element={<NotFoundPage />} />
        <Route path="more" element={<MoreForYou />} />
      </Route>

      {/* Admin Routes */}
      {/* <Route element={<AdminRoute><AdminLayout /></AdminRoute>}>
          <Route path="/admin/dashboard" element={<AdminDashboard />} /> */}
      {/* Add other admin routes here */}
      {/* </Route> */}
    </Routes>
  );
}

export default App;
