import { useState, useRef } from 'react';
import axios from 'axios';
import toast from 'react-hot-toast';
import { X, ImageUp } from 'lucide-react';

const CreatePostModal = ({ isOpen, onClose }) => {
  const [caption, setCaption] = useState('');
  const [selectedFile, setSelectedFile] = useState(null);
  const [previewUrl, setPreviewUrl] = useState('');
  const fileInputRef = useRef(null);

  if (!isOpen) return null;

  const handleFileSelect = (e) => {
    const file = e.target.files[0];
    if (file) {
      setSelectedFile(file);
      setPreviewUrl(URL.createObjectURL(file));
    }
  };

  const handleCreatePost = async () => {
    if (!selectedFile) {
      toast.error('Please select an image to post.');
      return;
    }
    const apiFormData = new FormData();
    // The key 'postImage' MUST match the server's upload.single() name
    apiFormData.append('postImage', selectedFile);
    apiFormData.append('caption', caption);

    const toastId = toast.loading('Creating post...');
    try {
      const { data } = await axios.post('/api/posts/create', apiFormData, {
        headers: { 'Content-Type': 'multipart/form-data' },
        withCredentials: true,
      });
      if (data.success) {
        toast.success(data.message, { id: toastId });
        onClose(); // Close modal on success
        // You might want to refresh the feed here or navigate to the new post
      }
    } catch (error) {
      toast.error('Failed to create post.', { id: toastId });
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-70" onClick={onClose}>
      <div className="bg-gray-800 rounded-xl shadow-lg w-full max-w-lg text-white" onClick={(e) => e.stopPropagation()}>
        <div className="flex justify-between items-center p-4 border-b border-gray-700">
          <h2 className="text-xl font-semibold">Create new post</h2>
          <X className="cursor-pointer" onClick={onClose} />
        </div>
        <div className="p-4">
          {!previewUrl ? (
            <div
              className="flex flex-col items-center justify-center h-80 bg-gray-900 rounded-lg border-2 border-dashed border-gray-600 cursor-pointer"
              onClick={() => fileInputRef.current.click()}
            >
              <ImageUp size={48} className="text-gray-500 mb-4" />
              <p>Select a photo to post</p>
            </div>
          ) : (
            <div className="flex flex-col md:flex-row gap-4">
              <img src={previewUrl} alt="Post preview" className="md:w-1/2 w-full h-auto object-cover rounded-lg" />
              <div className="flex-grow">
                <textarea
                  value={caption}
                  onChange={(e) => setCaption(e.target.value)}
                  placeholder="Write a caption..."
                  className="w-full h-full bg-transparent text-white focus:outline-none resize-none"
                  rows="8"
                ></textarea>
              </div>
            </div>
          )}
          <input type="file" ref={fileInputRef} onChange={handleFileSelect} hidden accept="image/*" />
        </div>
        <div className="p-4 border-t border-gray-700">
          <button onClick={handleCreatePost} className="w-full py-2 font-semibold text-white bg-sky-500 rounded-lg hover:bg-sky-600">
            Share
          </button>
        </div>
      </div>
    </div>
  );
};

export default CreatePostModal;