import { useState, useRef, useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import axios from 'axios';
import { setUser } from '../../store/slices/authSlice';
import toast from 'react-hot-toast';
import { AUTH_API_URL } from '../../utils/constant';

const ChangeProfilePhotoDialog = ({ isOpen, onClose }) => {
  const { user } = useSelector((state) => state.auth);
  const dispatch = useDispatch();
  
  const [selectedFile, setSelectedFile] = useState(null);
  const [previewUrl, setPreviewUrl] = useState('');
  const fileInputRef = useRef(null);

  // Set initial preview to the current user's photo
  useEffect(() => {
    if (user?.profilePicture) {
      setPreviewUrl(user.profilePicture);
    }
  }, [user, isOpen]); // Reset when dialog opens

  if (!isOpen) {
    return null;
  }

  const handleFileSelect = (e) => {
    const file = e.target.files[0];
    if (file) {
      setSelectedFile(file);
      setPreviewUrl(URL.createObjectURL(file));
    }
  };

  const handleUpdatePhoto = async () => {
    if (!selectedFile) {
      toast.error('Please select a new photo first.');
      return;
    }

    const apiFormData = new FormData();
    apiFormData.append('profilePicture', selectedFile);
    
    const toastId = toast.loading('Uploading photo...');

    try {
      const { data } = await axios.put(`${AUTH_API_URL}/change-profile-photo`, apiFormData, {
        headers: { 'Content-Type': 'multipart/form-data' },
        withCredentials: true,
      });

      if (data.success) {
        toast.success('Profile photo updated!', { id: toastId });
        dispatch(setUser(data.user)); 
        onClose(); 
      }
    } catch (error) {
      toast.error('Failed to update photo.', { id: toastId });
      console.error('Failed to change photo:', error);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-70" onClick={onClose}>
      <div className="bg-gray-800 rounded-xl shadow-lg p-8 w-full max-w-md text-center" onClick={(e) => e.stopPropagation()}>
        <h2 className="text-2xl font-bold text-white mb-6">Change Profile Photo</h2>
        
        <div className="flex justify-center mb-6">
          <img 
            src={previewUrl} 
            alt="Profile Preview" 
            className="w-48 h-48 rounded-full object-cover border-4 border-gray-600"
          />
        </div>
        
        <input 
          type="file" 
          ref={fileInputRef} 
          onChange={handleFileSelect} 
          hidden 
          accept="image/*" 
        />
        
        <div className="space-y-4">
          <button 
            onClick={() => fileInputRef.current.click()}
            className="w-full py-3 font-semibold text-sky-400 bg-transparent rounded-lg hover:bg-gray-700 transition-colors"
          >
            Select a different Photo
          </button>
          <button 
            onClick={handleUpdatePhoto}
            disabled={!selectedFile}
            className="w-full py-3 font-semibold text-white bg-sky-500 rounded-lg hover:bg-sky-600 disabled:bg-sky-800 disabled:cursor-not-allowed transition-colors"
          >
            Update Photo
          </button>
        </div>
      </div>
    </div>
  );
};

export default ChangeProfilePhotoDialog;