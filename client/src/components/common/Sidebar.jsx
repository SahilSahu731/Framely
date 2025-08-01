import { useState } from "react";
import { NavLink, Link, useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { logout } from "@/store/slices/authSlice";
import {
  Home,
  Search,
  Compass,
  MessageCircle,
  PlusSquare,
  User,
  HeartIcon,
  LogOut,
  Menu,
  Image,
  Film,
  VideoIcon,
} from "lucide-react";
import useNotifications from "../../hooks/useNotifications";
import {
  openCreatePostModal,
  openCreateStoryModal,
} from "../../store/slices/uiSlice";

// The Sidebar now accepts a prop to open the modal
const Sidebar = () => {
  const { user } = useSelector((state) => state.auth);
  const dispatch = useDispatch();
  const { unreadCount } = useSelector((state) => state.notifications);
  // const [isNotificationPanelOpen, setNotificationPanelOpen] = useState(false);

  const navigate = useNavigate();

  useNotifications();

  const handleLogout = () => {
    dispatch(logout());
    navigate("/login");
  };

  //  const handleNotificationClick = async () => {
  //     setNotificationPanelOpen(!isNotificationPanelOpen);
  //     // If there are unread notifications, mark them as read
  //     if (unreadCount > 0 && !isNotificationPanelOpen) {
  //         try {
  //             await axios.post(`${NOTIFICATION_API_URL}/read`, {}, { withCredentials: true });
  //             dispatch(markAllAsRead());
  //         } catch (error) {
  //             console.error("Failed to mark notifications as read", error);
  //         }
  //     }
  // }

  // "Create" has been removed from this array to be handled separately
  const navLinks = [
    { icon: <Home />, text: "Home", path: "/" },
    { icon: <Search />, text: "Search", path: "/search" },
    { icon: <Compass />, text: "Explore", path: "/explore" },
    { icon: <MessageCircle />, text: "Messages", path: "/messages" },
  ];

  const activeLinkStyle =
    "flex items-center mt-2 mb-2 space-x-4 py-3 px-2 rounded-md bg-gray-700";
  const normalLinkStyle =
    "flex items-center mt-2 mb-2 space-x-4 py-3 px-2 rounded-md hover:bg-gray-700";

  return (
    <aside className="w-80 fixed top-0 left-0 min-h-screen bg-gray-800 text-white p-4 flex flex-col">
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
                className={({ isActive }) =>
                  isActive ? activeLinkStyle : normalLinkStyle
                }
              >
                {link.icon}
                <span className="font-semibold">{link.text}</span>
              </NavLink>
            </li>
          ))}
          <li>
            <NavLink
              to="/notifications"
              className={({ isActive }) =>
                isActive ? activeLinkStyle : normalLinkStyle
              }
            >
              <div className="relative">
                <HeartIcon />
                {unreadCount > 0 && (
                  <span className="absolute -top-1 -right-1 w-4 h-4 bg-red-500 text-white text-xs rounded-full flex items-center justify-center">
                    {unreadCount}
                  </span>
                )}
              </div>
              <span className="font-semibold ml-4">Notification</span>
            </NavLink>
          </li>

          {/* --- Create Button with Popover --- */}
          <li className="relative group">
            <button className={`${normalLinkStyle} w-full  `}>
              <PlusSquare />
              <span className="font-semibold">Create</span>
            </button>
            <div className="absolute hidden group-hover:block group left-56 top-5  ml-2 w-56 bg-gray-700 rounded-lg shadow-lg py-2">
              <button
                onClick={() => {
                  dispatch(openCreatePostModal()); // Dispatch action to open
                }}
                className="w-full text-left px-4 py-2 text-sm hover:bg-gray-600 flex justify-between items-center"
              >
                Create Post <Image size={18} />
              </button>
              <button
                onClick={() => {
                  dispatch(openCreateStoryModal()); // Dispatch action to open
                }}
                className="w-full text-left px-4 py-2 text-sm hover:bg-gray-600 flex justify-between items-center"
              >
                Add a Story <Film size={18} />
              </button>
            </div>
          </li>

          <li key="Profile">
            <NavLink
              to={`/profile/${user?.username}`}
              className={({ isActive }) =>
                isActive ? activeLinkStyle : normalLinkStyle
              }
            >
              <img
                src={user?.profilePicture}
                alt="Profile Picture"
                className="h-6 w-6 rounded-full"
              />
              <span className="font-semibold">Profile</span>
            </NavLink>
          </li>
        </ul>
      </nav>
      <div>
        <button className="w-full text-left py-3 px-2 rounded-md hover:bg-gray-700 font-semibold flex items-center space-x-4">
          <Menu />
          <span>More</span>
        </button>
        <button
          onClick={handleLogout}
          className="w-full text-left py-3 px-2 rounded-md hover:bg-gray-700 font-semibold flex items-center space-x-4"
        >
          <LogOut />
          <span>Logout</span>
        </button>
      </div>
    </aside>
  );
};

export default Sidebar;
