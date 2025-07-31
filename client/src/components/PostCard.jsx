import { Heart, MessageCircle, Send } from 'lucide-react';

const PostCard = ({ username, avatar, postImage, caption }) => {
  return (
    <div className="w-full max-w-md mx-auto bg-gray-800 rounded-xl shadow-md overflow-hidden md:max-w-2xl mb-6 text-white">
      {/* Card Header */}
      <div className="p-4 flex items-center">
        <img className="h-10 w-10 rounded-full object-cover" src={avatar} alt={`${username}'s avatar`} />
        <p className="ml-3 font-semibold">{username}</p>
      </div>

      {/* Card Image */}
      <img className="w-full h-auto object-cover" src={postImage} alt="Post content" />

      {/* Card Actions */}
      <div className="p-4">
        <div className="flex space-x-4">
          <Heart className="cursor-pointer hover:text-red-500" size={24} />
          <MessageCircle className="cursor-pointer hover:text-gray-400" size={24} />
          <Send className="cursor-pointer hover:text-gray-400" size={24} />
        </div>

        {/* Caption */}
        <div className="mt-4">
          <p>
            <span className="font-semibold mr-2">{username}</span>
            {caption}
          </p>
        </div>

        {/* Comments Link */}
        <div className="mt-2">
          <a href="#" className="text-gray-400 text-sm hover:underline">
            View all comments
          </a>
        </div>
      </div>
    </div>
  );
};

export default PostCard;