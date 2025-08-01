import { useState, useRef } from 'react';
import axios from 'axios';
import toast from 'react-hot-toast';
import { X, ImageUp, Send } from 'lucide-react';
import { STORY_API_URL } from '../../utils/constant';

const CreateStoryModal = ({ isOpen, onClose }) => {
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

  const handleAddStory = async () => {
    if (!selectedFile) {
      toast.error('Please select a media file to share.');
      return;
    }
    const apiFormData = new FormData();
    apiFormData.append('storyMedia', selectedFile);

    const toastId = toast.loading('Adding to your story...');
    try {
      const { data } = await axios.post(`${STORY_API_URL}/add`, apiFormData, {
        headers: { 'Content-Type': 'multipart/form-data' },
        withCredentials: true,
      });

      if (data.success) {
        toast.success(data.message, { id: toastId });
        onClose(); // Close the modal
      }
    } catch (error) {
      toast.error('Failed to add story.', { id: toastId });
      console.error('Error adding story:', error);
    }
  };

  const handleClose = () => {
    setSelectedFile(null);
    setPreviewUrl('');
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-70" onClick={handleClose}>
      <div className="bg-gray-800 rounded-xl shadow-lg w-full max-w-lg text-white" onClick={(e) => e.stopPropagation()}>
        <div className="flex justify-between items-center p-4 border-b border-gray-700">
          <h2 className="text-xl font-semibold">Add to your story</h2>
          <X className="cursor-pointer" onClick={handleClose} />
        </div>
        <div className="p-4">
          {!previewUrl ? (
            <div
              className="flex flex-col items-center justify-center h-80 bg-gray-900 rounded-lg border-2 border-dashed border-gray-600 cursor-pointer"
              onClick={() => fileInputRef.current.click()}
            >
              <ImageUp size={48} className="text-gray-500 mb-4" />
              <p>Select a photo or video</p>
            </div>
          ) : (
            <div className="flex justify-center items-center h-80 bg-black rounded-lg">
              <img src={previewUrl} alt="Story preview" className="max-h-full max-w-full object-contain" />
            </div>
          )}
          <input type="file" ref={fileInputRef} onChange={handleFileSelect} hidden accept="image/*,video/*" />
        </div>
        <div className="p-4">
          <button
            onClick={handleAddStory}
            disabled={!selectedFile}
            className="w-full flex justify-center items-center gap-2 py-3 font-semibold text-white bg-sky-500 rounded-lg hover:bg-sky-600 disabled:bg-gray-500 disabled:cursor-not-allowed"
          >
            <Send size={18} />
            Share to Story
          </button>
        </div>
      </div>
    </div>
  );
};

export default CreateStoryModal;