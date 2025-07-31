import axios from "axios";
import { useEffect, useRef, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { AUTH_API_URL } from "../../utils/constant";
import { changeProfileStatus, setUser } from "../../store/slices/authSlice";
import toast from "react-hot-toast";
import { useNavigate } from "react-router-dom";
import ChangeProfilePhotoDialog from "./ChangeProfilePhotoDialog";

const EditProfilePage = () => {
  const { user } = useSelector((state) => state.auth);
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    fullName: "",
    website: "",
    bio: "",
  });
  const [profilePic, setProfilePic] = useState(user.profilePicture || "");
  const [isPrivate, setIsPrivate] = useState(false);

  const [isPhotoDialogOpen, setIsPhotoDialogOpen] = useState(false);

  // Initialize form with user data from Redux
  useEffect(() => {
    if (user) {
      setFormData({
        fullName: user.fullName || "",
        website: user.website || "",
        bio: user.bio || "",
      });
      setProfilePic(user.profilePicture || "");
      setIsPrivate(user.isPrivate || false);
    }
  }, [user]);

  const handleChange = (e) => {
    setFormData((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleFormSubmit = async (e) => {
    e.preventDefault();
    try {
      const res = await axios.put(`${AUTH_API_URL}/update-profile`, formData, {
        headers: {
          "Content-Type": "application/json",
        },
        withCredentials: true,
      });
      if (res.status === 200) {
        toast.success("Profile updated successfully!");
        dispatch(setUser(res.data.user));
        navigate("/profile");
      } else {
        toast.error("Failed to update profile.");
      }
    } catch (error) {
      toast.error("Failed to update profile.");
      console.error("Failed to update profile:", error);
    }
  };

  const handleTogglePrivacy = async () => {
    try {
      const { data } = await axios.put(
        `${AUTH_API_URL}/change-status`,
        {},
        { withCredentials: true }
      );
      setIsPrivate(data.isPrivate);
      dispatch(changeProfileStatus(data.isPrivate));
      toast.success(`Profile is now ${data.isPrivate ? "Private" : "Public"}.`);
    } catch (error) {
      console.error("Failed to update status:", error);
      alert("Error changing status.");
    }
  };

  return (
    <>
      <div className="bg-gray-800 text-white max-w-3xl mx-auto rounded-lg">
        <div className="p-8">
          <div className="flex flex-col items-center mb-8">
            <img
              src={profilePic}
              alt="Avatar Preview"
              className="w-40 h-40 rounded-full object-cover border-4 border-gray-700 mb-4"
            />
            <button
              type="button"
              onClick={() => setIsPhotoDialogOpen(true)} // Open the dialog
              className="text-sky-400 font-semibold hover:text-sky-300"
            >
              Change profile photo
            </button>
          </div>

          <form onSubmit={handleFormSubmit} className="space-y-6">
            {/* Full Name */}
            <div>
              <label
                htmlFor="fullName"
                className="block text-sm font-semibold mb-1"
              >
                Name
              </label>
              <input
                type="text"
                id="fullName"
                name="fullName"
                value={formData.fullName}
                onChange={handleChange}
                placeholder="Full Name"
                className="w-full bg-gray-700 border border-gray-600 rounded p-2 focus:outline-none focus:ring-2 focus:ring-sky-500"
              />
            </div>

            {/* Website */}
            <div>
              <label
                htmlFor="website"
                className="block text-sm font-semibold mb-1"
              >
                Website
              </label>
              <input
                type="text"
                id="website"
                name="website"
                value={formData.website}
                onChange={handleChange}
                placeholder="Website"
                className="w-full bg-gray-700 border border-gray-600 rounded p-2 focus:outline-none focus:ring-2 focus:ring-sky-500"
              />
            </div>

            {/* Bio */}
            <div>
              <label htmlFor="bio" className="block text-sm font-semibold mb-1">
                Bio
              </label>
              <textarea
                id="bio"
                name="bio"
                value={formData.bio}
                onChange={handleChange}
                rows="4"
                className="w-full bg-gray-700 border border-gray-600 rounded p-2 focus:outline-none focus:ring-2 focus:ring-sky-500"
              ></textarea>
            </div>

            {/* Submit Button */}
            <div className="flex justify-end">
              <button
                type="submit"
                className="bg-sky-500 hover:bg-sky-600 text-white font-semibold py-2 px-6 rounded-lg"
              >
                Submit
              </button>
            </div>
          </form>

          {/* --- Additional Actions --- */}
          <div className="mt-10 pt-6 border-t border-gray-700 space-y-4">
            <button
              onClick={handleTogglePrivacy}
              className="text-sky-400 font-semibold hover:underline"
            >
              {isPrivate
                ? "Switch to Public Profile"
                : "Switch to Private Profile"}
            </button>
            <br />
            <button className="text-sky-400 font-semibold hover:underline">
              Get Verified
            </button>
          </div>
        </div>
      </div>
      {/* Render the Dialog */}
      <ChangeProfilePhotoDialog
        isOpen={isPhotoDialogOpen}
        onClose={() => setIsPhotoDialogOpen(false)}
      />
    </>
  );
};

export default EditProfilePage;
