import { useDispatch, useSelector } from "react-redux";
import { PlusCircle } from "lucide-react";
import Story from "../ui/Story";
import { openCreateStoryModal, openStoryViewer } from "../../store/slices/uiSlice";

const StoryCarousel = () => {
  const dispatch = useDispatch();
  const { user } = useSelector((state) => state.auth);
  const { stories, isLoading } = useSelector((state) => state.stories);

  // Find the logged-in user's story from the list
  const myStory = stories.find(story => story.author._id === user?._id);

  if (isLoading) {
    return <div className="text-white text-center p-4">Loading stories...</div>;
  }

  return (
    <div className="w-full max-w-2xl mx-auto bg-gray-800 rounded-xl p-4 mb-6">
      <div className="flex space-x-4 overflow-x-auto pb-2 scrollbar-hide">
        {/* --- 1. Dedicated "Add Story" Button --- */}
        {user && (
          <div
            className="flex flex-col items-center space-y-1 flex-shrink-0 cursor-pointer group"
            onClick={() => dispatch(openCreateStoryModal())}
          >
            <div className="relative">
              <img
                className="h-16 w-16 rounded-full object-cover border-2 border-gray-600 group-hover:border-gray-400 transition-colors"
                src={user.profilePicture}
                alt="Add to your story"
              />
              <PlusCircle className="absolute bottom-0 right-0 w-6 h-6 bg-sky-500 text-white rounded-full border-2 border-gray-800" />
            </div>
            <p className="text-xs text-gray-400 w-20 truncate text-center">Add Story</p>
          </div>
        )}

        {/* --- 2. Display the User's Own Story (if it exists) --- */}
        {myStory && (
          <div className="cursor-pointer" onClick={() => dispatch(openStoryViewer(myStory.author._id))}>
            <Story
              username="Your Story" // Custom label for the user's own story
              avatar={myStory.author.profilePicture}
            />
          </div>
        )}
        
        {/* --- 3. Map and Filter Other Users' Stories --- */}
        {stories
          .filter(story => story.author._id !== user?._id) // Filter out the logged-in user's story to avoid duplicates
          .map((story) => (
            <div className="cursor-pointer" key={story._id} onClick={() => dispatch(openStoryViewer(story.author._id))}>
              <Story
                username={story.author.username}
                avatar={story.author.profilePicture}
              />
            </div>
          ))}
      </div>
    </div>
  );
};

export default StoryCarousel;