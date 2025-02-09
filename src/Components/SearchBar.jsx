import { useState, useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import { ShopContext } from '../Context/ShopContext';

const SearchBar = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const { setShowSearch } = useContext(ShopContext);
  const navigate = useNavigate();

  const handleSearch = (e) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      navigate(`/collection?search=${encodeURIComponent(searchQuery)}`);
      setShowSearch(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center">
      <div className="bg-white p-4 rounded-lg w-full max-w-2xl mx-4">
        <form onSubmit={handleSearch} className="relative">
          <input
            type="text"
            placeholder="Search products..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full p-4 border rounded-lg pr-12"
            autoFocus
          />
          <button
            type="submit"
            className="absolute right-4 top-1/2 -translate-y-1/2 bg-blue-500 text-white px-4 py-2 rounded"
          >
            Search
          </button>
        </form>
        <button
          onClick={() => setShowSearch(false)}
          className="mt-4 text-gray-600 hover:text-gray-800"
        >
          Close
        </button>
      </div>
    </div>
  );
};

export default SearchBar;
