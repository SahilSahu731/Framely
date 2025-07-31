const suggestedUsers = [
  { id: 1, username: 'tech_guru', reason: 'New to Framely', avatar: 'https://i.pravatar.cc/150?u=tech_guru' },
  { id: 2, username: 'art_lover', reason: 'Followed by samantha_g', avatar: 'https://i.pravatar.cc/150?u=art_lover' },
  { id: 3, username: 'travel_bug', reason: 'Follows you', avatar: 'https://i.pravatar.cc/150?u=travel_bug' },
  { id: 4, username: 'foodie_queen', reason: 'New to Framely', avatar: 'https://i.pravatar.cc/150?u=foodie_queen' },
];

const Suggestions = () => {
  return (
    // TODO: Add a button to follow the user
    <aside className="w-80 p-5 rounded-xl ml-10 bg-gray-800 text-white">
      <h2 className="font-semibold mb-10 text-center ">Suggested for you</h2>
      <div className="space-y-4">
        {suggestedUsers.map(user => (
          <div key={user.id} className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <img src={user.avatar} alt={user.username} className="w-10 h-10 rounded-full" />
              <div>
                <p className="font-semibold text-sm">{user.username}</p>
                <p className="text-xs text-gray-400">{user.reason}</p>
              </div>
            </div>
            <button className="text-sky-400 text-sm font-semibold">
              Follow
            </button>
          </div>
        ))}
      </div>
    </aside>
  );
};

export default Suggestions;