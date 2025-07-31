import { useSelector } from "react-redux";
import { Settings, Grid3x3, Bookmark, UserSquare2 } from "lucide-react";
import { Link } from "react-router-dom";

// --- Static Data for Demonstration ---
const userProfile = {
  fullName: "John Doe",
  username: "john_doe",
  avatar: "https://i.pravatar.cc/150?u=john_doe",
  bio: "Photographer 📸 | Traveler 🌍 | Dreamer ✨\nCapturing moments from around the world.",
  posts: 128,
  followers: "4.2k",
  following: 350,
  highlights: [
    { id: 1, title: "Travel", cover: "https://picsum.photos/seed/h1/200" },
    { id: 2, title: "Food", cover: "https://picsum.photos/seed/h2/200" },
    { id: 3, title: "Friends", cover: "https://picsum.photos/seed/h3/200" },
    { id: 4, title: "Work", cover: "https://picsum.photos/seed/h4/200" },
  ],
  userPosts: Array.from({ length: 15 }, (_, i) => ({
    id: i,
    imageUrl: `https://picsum.photos/seed/post${i}/500`,
    likes: Math.floor(Math.random() * 1000),
    comments: Math.floor(Math.random() * 100),
  })),
};

const Profile = () => {
  // You can later fetch user data based on the username from the URL params
  // const { username } = useParams();
  const { user } = useSelector((state) => state.auth); // Logged-in user

  return (
    <div className="text-white max-w-4xl mx-auto p-4">
      {/* --- Profile Header --- */}
      <header className="flex flex-col md:flex-row items-center md:items-start p-4">
        <div className="w-36 h-36 md:w-40 md:h-40 flex-shrink-0">
          <img
            src={user.profilePicture}
            alt="User Avatar"
            className="rounded-full w-full h-full object-cover border-2 border-gray-700"
          />
        </div>
        <div className="md:ml-10 mt-4 md:mt-0 text-center md:text-left">
          <div className="flex items-center justify-center md:justify-start gap-4">
            <h1 className="text-2xl font-light">{user.username}</h1>
            <Link to="/accounts/edit">
              <button className="bg-gray-700 hover:bg-gray-600 text-white font-semibold py-1 px-4 rounded">
                Edit Profile
              </button>
            </Link>
            <button className="p-2 bg-gray-700 hover:bg-gray-600 rounded">
              <Settings size={20} />
            </button>
          </div>
          <div className="flex justify-center md:justify-start gap-8 my-4">
            <div>
              <span className="font-semibold">{user.postsCount}</span> posts
            </div>
            <div>
              <span className="font-semibold">{userProfile.followers}</span>{" "}
              followers
            </div>
            <div>
              <span className="font-semibold">{userProfile.following}</span>{" "}
              following
            </div>
          </div>
          <div>
            <p className="font-semibold">{userProfile.fullName}</p>
            <p className="whitespace-pre-line text-gray-300">
              {userProfile.bio}
            </p>
          </div>
        </div>
      </header>

      {/* --- Story Highlights --- */}
      <div className="px-4 py-6 mt-6">
        <div className="flex space-x-6">
          {userProfile.highlights.map((highlight) => (
            <div key={highlight.id} className="flex flex-col items-center">
              <img
                src={highlight.cover}
                alt={highlight.title}
                className="w-16 h-16 rounded-full object-cover border-2 border-gray-700"
              />
              <p className="text-sm mt-1">{highlight.title}</p>
            </div>
          ))}
        </div>
      </div>

      {/* --- Posts Section --- */}
      <div className="border-t border-gray-700">
        <div className="flex justify-around gap-12 text-sm font-semibold text-gray-400">
          <button className="flex items-center gap-2 py-3 border-t-2 border-white text-white">
            <Grid3x3 size={16} /> POSTS
          </button>
          <button className="flex items-center gap-2 py-3">
            <Bookmark size={16} /> SAVED
          </button>
          <button className="flex items-center gap-2 py-3">
            <UserSquare2 size={16} /> TAGGED
          </button>
        </div>
        <div className="grid grid-cols-3 gap-1">
          {userProfile.userPosts.map((post) => (
            <div key={post.id} className="relative aspect-square group">
              <img
                src={post.imageUrl}
                alt="User post"
                className="w-full h-full object-cover"
              />
              <div className="absolute inset-0 bg-black bg-opacity-50 flex items-center justify-center gap-4 text-white opacity-0 group-hover:opacity-100 transition-opacity">
                <span>❤️ {post.likes}</span>
                <span>💬 {post.comments}</span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Profile;
