import Story from './ui/Story';

// --- Static Data for Demonstration ---
const stories = [
  { id: 1, username: 'charlie_davis', avatar: 'https://i.pravatar.cc/150?u=charlie_davis' },
  { id: 2, username: 'olivia_martinez', avatar: 'https://i.pravatar.cc/150?u=olivia_martinez' },
  { id: 3, username: 'william_jackson', avatar: 'https://i.pravatar.cc/150?u=william_jackson' },
  { id: 4, username: 'sophia_white', avatar: 'https://i.pravatar.cc/150?u=sophia_white' },
  { id: 5, username: 'james_harris', avatar: 'https://i.pravatar.cc/150?u=james_harris' },
  { id: 6, username: 'ava_clark', avatar: 'https://i.pravatar.cc/150?u=ava_clark' },
  { id: 7, username: 'benjamin_lewis', avatar: 'https://i.pravatar.cc/150?u=benjamin_lewis' },
  { id: 8, username: 'mia_robinson', avatar: 'https://i.pravatar.cc/150?u=mia_robinson' },
  { id: 9, username: 'lucas_walker', avatar: 'https://i.pravatar.cc/150?u=lucas_walker' },
  { id: 10, username: 'isabella_hall', avatar: 'https://i.pravatar.cc/150?u=isabella_hall' },
];

const StoryCarousel = () => {
  return (
    <div className="w-full max-w-2xl mx-auto bg-gray-800 rounded-xl p-4 mb-6">
      <div className="flex space-x-4 overflow-x-auto pb-2 scrollbar-hide">
        {stories.map(story => (
          <Story
            key={story.id}
            username={story.username}
            avatar={story.avatar}
          />
        ))}
      </div>
    </div>
  );
};


export default StoryCarousel;