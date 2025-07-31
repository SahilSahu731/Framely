import { BrowserRouter as Router, Routes, Route, Navigate, useNavigate } from 'react-router-dom';
import { useSelector } from 'react-redux';

// Layouts

// Pages
import AuthLayout from './components/layout/AuthLayout';
import Login from './pages/auth/Login';
import Signup from './pages/auth/Signup';
import { useEffect } from 'react';
import Home from './pages/Home';
import MainLayout from './components/layout/MainLayout';
import NotFoundPage from './components/NotFoundPage';
import Profile from './pages/user/Profile';
import EditProfilePage from './components/user/EditProfile';

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

  return (
    <Routes>
        {/* Authentication Routes */}
        <Route element={<AuthLayout />}>
          <Route path="/login" element={<Login />} />
          <Route path="/signup" element={<Signup />} />
        </Route>

        <Route element={<MainLayout />}>
          <Route path="/" element={<Home />} />
          <Route path = "/profile/:username" element={<Profile />} />
          <Route path = '*' element={<NotFoundPage/>} />
          <Route path = "/accounts/edit" element={<EditProfilePage />} />
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