import { NavLink, Link, useNavigate } from 'react-router-dom'; // Import NavLink
import { useDispatch, useSelector } from 'react-redux';
import { logout } from '@/store/slices/authSlice';
import { Home, Search, Compass, MessageCircle, PlusSquare, User, HeartIcon, LogOut, MoreHorizontal, Hamburger, Menu } from 'lucide-react';

const Sidebar = () => {
  const { user } = useSelector((state) => state.auth);
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const handleLogout = () => {
    dispatch(logout());
    navigate('/login');
  };

  const navLinks = [
    { icon: <Home />, text: 'Home', path: '/' },
    { icon: <Search />, text: 'Search', path: '/search' },
    { icon: <Compass />, text: 'Explore', path: '/explore' },
    { icon: <MessageCircle />, text: 'Messages', path: '/messages' },
    { icon: <PlusSquare />, text: 'Create', path: '/create' },
    { icon: <HeartIcon />, text: 'Notification', path: '/notification' },
  ];

  // Style for the active NavLink
  const activeLinkStyle = "flex items-center mt-2 mb-2 space-x-4 py-3 px-2 rounded-md bg-gray-700";
  const normalLinkStyle = "flex items-center mt-2 mb-2 space-x-4 py-3 px-2 rounded-md hover:bg-gray-700";

  return (
    <aside className="w-80  fixed top-0 left-0 min-h-screen bg-gray-800 text-white p-4 flex flex-col">
      <h1 className="text-3xl font-serif text-center my-4">
        <Link to="/">
             <span className="text-sky-500 new-font">F</span>
          <span className="text-red-500 new-font">r</span>
          <span className="text-violet-500 new-font">a</span>
          <span className="text-yellow-500 new-font">m</span>
          <span className="text-orange-500 new-font">e</span>
          <span className="text-blue-500 new-font">l</span>
          <span className="text-pink-500 new-font">y</span>
        </Link>
      </h1>
      <nav className="flex-grow">
        <ul>
          {navLinks.map((link) => (
            <li key={link.text}>
              <NavLink
                to={link.path}
                // Apply active style conditionally
                className={({ isActive }) => isActive ? activeLinkStyle : normalLinkStyle}
              >
                {link.icon}
                <span className="font-semibold">{link.text}</span>
              </NavLink>
            </li>
          ))}
           <li key="Profile">
              <NavLink
                to={`/profile/${user?.username}`}
                className={({ isActive }) => isActive ? activeLinkStyle : normalLinkStyle}
              >
                <User />
                <span className="font-semibold">Profile</span>
              </NavLink>
            </li>
        </ul>
      </nav>
      <div>
        <button className="w-full text-left py-3 px-2 rounded-md hover:bg-gray-700 font-semibold flex items-center space-x-4">
            <Menu/>
          <span>More</span>
        </button>
        <button onClick={handleLogout} className="w-full text-left py-3 px-2 rounded-md hover:bg-gray-700 font-semibold flex items-center space-x-4">
            <LogOut/>
          <span>Logout</span>
        </button>
      </div>
    </aside>
  );
};

export default Sidebar;