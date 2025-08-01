import { useState, useEffect } from 'react';
import axios from 'axios';
import { Link } from 'react-router-dom';
import { Search } from 'lucide-react';
import { USER_API_URL } from '../utils/constant';

const SearchPage = () => {
  const [query, setQuery] = useState('');
  const [results, setResults] = useState([]);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    const searchTimeout = setTimeout(async () => {
      if (query.trim() === '') {
        setResults([]);
        return;
      }
      setIsLoading(true);
      try {
        const { data } = await axios.get(`${USER_API_URL}/search?q=${query}`, {
          withCredentials: true,
        });
        if (data.success) {
          setResults(data.users);
        }
      } catch (error) {
        console.error('Failed to search users:', error);
      } finally {
        setIsLoading(false);
      }
    }, 300); // Wait 300ms after the user stops typing

    // Cleanup function to clear the timeout
    return () => clearTimeout(searchTimeout);
  }, [query]);

  return (
    <div className="text-white max-w-xl mx-auto p-4">
      <h1 className="text-2xl font-bold mb-6">Search</h1>
      <div className="relative mb-6">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={20} />
        <input
          type="text"
          placeholder="Search for users..."
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          className="w-full bg-gray-700 border border-gray-600 rounded-lg p-2 pl-10 focus:outline-none focus:ring-2 focus:ring-sky-500"
        />
      </div>

      <div className="space-y-4">
        {isLoading && <p className="text-gray-400">Searching...</p>}
        {!isLoading && results.map((user) => (
          <Link to={`/profile/${user.username}`} key={user._id}>
            <div className="flex items-center space-x-4 p-2 rounded-lg hover:bg-gray-700">
              <img
                src={user.profilePicture}
                alt={user.username}
                className="w-12 h-12 rounded-full object-cover"
              />
              <div>
                <p className="font-semibold">{user.username}</p>
                <p className="text-sm text-gray-400">{user.fullName}</p>
              </div>
            </div>
          </Link>
        ))}
        {!isLoading && query && results.length === 0 && (
          <p className="text-gray-400">No users found.</p>
        )}
      </div>
    </div>
  );
};

export default SearchPage;