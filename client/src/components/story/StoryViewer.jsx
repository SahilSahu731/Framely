import { useEffect, useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { closeStoryViewer } from '../../store/slices/uiSlice';
import { X } from 'lucide-react';

const StoryViewer = () => {
  const dispatch = useDispatch();
  const { viewingStoryUserId } = useSelector((state) => state.ui);
  const { stories } = useSelector((state) => state.stories);

  const [currentUserStory, setCurrentUserStory] = useState(null);
  const [activeMediaIndex, setActiveMediaIndex] = useState(0);

  // Find the correct story to display when the viewer opens
  useEffect(() => {
    if (viewingStoryUserId) {
      const story = stories.find(s => s.author._id === viewingStoryUserId);
      setCurrentUserStory(story);
      setActiveMediaIndex(0); // Reset to the first item
    } else {
      setCurrentUserStory(null);
    }
  }, [viewingStoryUserId, stories]);

  // Handle auto-advancing to the next story item
  useEffect(() => {
    if (currentUserStory) {
      const timer = setTimeout(() => {
        if (activeMediaIndex < currentUserStory.media.length - 1) {
          setActiveMediaIndex(activeMediaIndex + 1);
        } else {
          dispatch(closeStoryViewer()); // Close when the last story finishes
        }
      }, 5000); // 5-second timer per story item

      return () => clearTimeout(timer);
    }
  }, [activeMediaIndex, currentUserStory, dispatch]);

  if (!currentUserStory) {
    return null;
  }

  const handleNext = () => {
    if (activeMediaIndex < currentUserStory.media.length - 1) {
        setActiveMediaIndex(activeMediaIndex + 1);
    }
  };

  const handlePrev = () => {
    if (activeMediaIndex > 0) {
        setActiveMediaIndex(activeMediaIndex - 1);
    }
  };

  const activeMedia = currentUserStory.media[activeMediaIndex];

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-90">
      {/* Close Button */}
      <X className="absolute top-4 right-4 text-white cursor-pointer z-10" size={32} onClick={() => dispatch(closeStoryViewer())} />

      {/* Story Content */}
      <div className="relative h-full w-full max-w-md flex items-center">
        {/* Progress Bars */}
        <div className="absolute top-2 left-2 right-2 flex gap-1">
            {currentUserStory.media.map((_, index) => (
                <div key={index} className="h-1 flex-1 bg-gray-500 rounded-full">
                    <div
                        className="h-full bg-white rounded-full"
                        style={{ width: index < activeMediaIndex ? '100%' : (index === activeMediaIndex ? '100%' : '0%'), transition: index === activeMediaIndex ? 'width 5s linear' : 'none' }}
                    ></div>
                </div>
            ))}
        </div>

        {/* Navigation Overlays */}
        <div className="absolute left-0 h-full w-1/3 cursor-pointer" onClick={handlePrev}></div>
        <div className="absolute right-0 h-full w-1/3 cursor-pointer" onClick={handleNext}></div>

        {/* Media Display */}
        <img src={activeMedia.url} alt="Story content" className="w-full h-auto object-contain" />
      </div>
    </div>
  );
};

export default StoryViewer;