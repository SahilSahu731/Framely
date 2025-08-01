import { useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import axios from 'axios';
import { setProfileLoading, setProfileData, setProfileError, toggleFollow } from '../../store/slices/ProfileSlice';
import { Settings, Grid3x3, Bookmark, UserSquare2 } from 'lucide-react';
import { USER_API_URL } from '../../utils/constant';
import toast from 'react-hot-toast';

const Profile = () => {
  const { username } = useParams();
  const dispatch = useDispatch();

  const { user: loggedInUser } = useSelector((state) => state.auth);
  const { profile, posts, isLoading, error } = useSelector((state) => state.profile);

  const isMyProfile = loggedInUser?.username === username;
  const isFollowing = profile?.followers.includes(loggedInUser?._id);

  useEffect(() => {
    const fetchProfile = async () => {
      dispatch(setProfileLoading(true));
      try {
        const { data } = await axios.get(`${USER_API_URL}/profile/${username}`, { withCredentials: true });
        if (data.success) {
          dispatch(setProfileData({ user: data.user, posts: data.posts }));
        }
      } catch (err) {
        dispatch(setProfileError(err.response?.data?.message || 'Failed to fetch profile.'));
      }
    };
    fetchProfile();
  }, [username, dispatch]);

  const handleFollow = async () => {
      dispatch(toggleFollow({ userId: loggedInUser._id })); // Optimistic update
      try {
          await axios.post(`${USER_API_URL}/follow/${profile._id}`, {}, { withCredentials: true });
      } catch (err) {
          dispatch(toggleFollow({ userId: loggedInUser._id })); // Revert on error
          toast.error('Something went wrong.');
          console.error('Error following user:', err);
      }
  };

  if (isLoading) return <div className="text-white text-center mt-20">Loading profile...</div>;
  if (error) return <div className="text-red-500 text-center mt-20">Error: {error}</div>;
  if (!profile) return null;

  return (
    <div className="text-white max-w-4xl mx-auto p-4">
      <header className="flex flex-col md:flex-row items-center md:items-start p-4">
        <div className="w-36 h-36 md:w-40 md:h-40 flex-shrink-0">
          <img src={profile.profilePicture} alt="User Avatar" className="rounded-full w-full h-full object-cover border-2 border-gray-700"/>
        </div>
        <div className="md:ml-10 mt-4 md:mt-0 text-center md:text-left">
          <div className="flex items-center justify-center md:justify-start gap-4">
            <h1 className="text-2xl font-light">{profile.username}</h1>
            {isMyProfile ? (
              <>
                <Link to="/accounts/edit">
                  <button className="bg-gray-700 hover:bg-gray-600 text-white font-semibold py-1 px-4 rounded">Edit Profile</button>
                </Link>
                <button className="p-2 bg-gray-700 hover:bg-gray-600 rounded"><Settings size={20} /></button>
              </>
            ) : (
              <>
                <button onClick={handleFollow} className={`${isFollowing ? 'bg-gray-700' : 'bg-sky-500'} text-white font-semibold py-1 px-4 rounded`}>
                  {isFollowing ? 'Following' : 'Follow'}
                </button>
                <button className="bg-gray-700 text-white font-semibold py-1 px-4 rounded">Message</button>
              </>
            )}
          </div>
          <div className="flex justify-center md:justify-start gap-8 my-4">
            <div><span className="font-semibold">{posts.length}</span> posts</div>
            <div><span className="font-semibold">{profile.followers.length}</span> followers</div>
            <div><span className="font-semibold">{profile.following.length}</span> following</div>
          </div>
          <div>
            <p className="font-semibold">{profile.fullName}</p>
            <p className="whitespace-pre-line text-gray-300">{profile.bio}</p>
          </div>
        </div>
      </header>

      {/* Story Highlights (can be made dynamic later) */}
      <div className="px-4 py-6 mt-6 border-t border-gray-700">
        {/* Placeholder for highlights */}
      </div>

      {/* Posts Section */}
      <div className="border-t border-gray-700">
        <div className="flex justify-around gap-12 text-sm font-semibold text-gray-400">
          <button className="flex items-center gap-2 py-3 border-t-2 border-white text-white"><Grid3x3 size={16} /> POSTS</button>
          <button className="flex items-center gap-2 py-3"><Bookmark size={16} /> SAVED</button>
          <button className="flex items-center gap-2 py-3"><UserSquare2 size={16} /> TAGGED</button>
        </div>
        <div className="grid grid-cols-3 gap-1">
          {posts.map((post) => (
            <div key={post._id} className="relative aspect-square group">
              <img src={post.image.url} alt="User post" className="w-full h-full object-cover" />
              <div className="absolute inset-0 bg-black bg-opacity-50 flex items-center justify-center gap-4 text-white opacity-0 group-hover:opacity-100 transition-opacity">
                <span>❤️ {post.likes.length}</span>
                <span>💬 {post.comments.length}</span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Profile;