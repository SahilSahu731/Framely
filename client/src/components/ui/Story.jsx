const Story = ({ avatar, username }) => {
  return (
    <div className="flex flex-col items-center space-y-1 flex-shrink-0">
      <div className="p-0.5 rounded-full bg-gradient-to-r from-yellow-400 via-red-500 to-pink-500">
        <div className="p-0.5 bg-gray-900 rounded-full">
          <img
            className="h-16 w-16 rounded-full object-cover"
            src={avatar}
            alt={`${username}'s story`}
          />
        </div>
      </div>
      <p className="text-xs text-white w-20 truncate text-center">{username}</p>
    </div>
  );
};

export default Story;