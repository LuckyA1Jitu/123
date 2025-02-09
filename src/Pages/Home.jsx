import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';
import LoadingSpinner from '../Components/LoadingSpinner';

const Home = () => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedCategory, setSelectedCategory] = useState('all');

  useEffect(() => {
    fetchProducts();
  }, []);

  const fetchProducts = async () => {
    try {
      setLoading(true);
      setError(null);
      const response = await axios.get('http://localhost:5000/api/products');
      if (response.data) {
        setProducts(response.data);
      }
    } catch (error) {
      console.error('Error fetching products:', error);
      setError('Failed to load products. Please try again later.');
    } finally {
      setLoading(false);
    }
  };

  // Format price in INR
  const formatPrice = (price) => {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR'
    }).format(price);
  };

  const categories = ['all', 'new arrivals', 'most viewed', 'trending'];

  const filteredProducts = products.filter(product => {
    if (selectedCategory === 'all') return true;
    if (selectedCategory === 'new arrivals') return product.isNewProduct;
    if (selectedCategory === 'most viewed') return product.views > 50;
    if (selectedCategory === 'trending') return product.views > 100;
    return true;
  });

  return (
    <div className="py-4 sm:py-8 px-2 sm:px-4 md:px-6 lg:px-8">
      {/* Category Navigation - Centered and Scrollable on mobile */}
      <div className="flex justify-center mb-8">
        <div className="max-w-full overflow-x-auto scrollbar-hide -mx-2 px-2">
          <div className="inline-flex bg-gray-100 p-1.5 rounded-full shadow-inner whitespace-nowrap">
            {categories.map((category) => (
              <button
                key={category}
                onClick={() => setSelectedCategory(category)}
                className={`px-4 sm:px-8 py-2.5 rounded-full text-xs sm:text-sm font-medium capitalize transition-all duration-200 ${
                  selectedCategory === category
                    ? 'bg-white text-blue-600 shadow-md transform scale-105'
                    : 'text-gray-600 hover:text-gray-900'
                }`}
              >
                {category}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Error Message */}
      {error && (
        <div className="text-center text-red-600 mb-4 px-2">
          {error}
        </div>
      )}

      {/* Products Grid */}
      {loading ? (
        <LoadingSpinner />
      ) : products.length === 0 ? (
        <div className="text-center text-gray-500 px-2">No products available</div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-3 sm:gap-4 md:gap-6">
          {filteredProducts.map((product, index) => (
            <Link
              key={product._id}
              to={`/product/${product._id}`}
              className="group bg-white rounded-xl sm:rounded-2xl shadow-md overflow-hidden hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1"
              style={{
                animationDelay: `${index * 100}ms`,
                animation: 'fadeInUp 0.5s ease-out forwards'
              }}
            >
              <div className="relative aspect-square">
                <img
                  src={`http://localhost:5000${product.images?.[0] || product.imageUrl}`}
                  alt={product.name}
                  className="w-full h-full object-cover transform group-hover:scale-105 transition-transform duration-300"
                  onError={(e) => {
                    e.target.src = 'https://via.placeholder.com/400x400?text=Image+Not+Found';
                  }}
                />
                {/* Badges */}
                <div className="absolute top-2 sm:top-4 left-2 sm:left-4 flex flex-col gap-1 sm:gap-2">
                  {product.isNewProduct && (
                    <span className="bg-green-500 text-white px-2 sm:px-3 py-1 rounded-full text-xs sm:text-sm font-medium shadow-lg">
                      New
                    </span>
                  )}
                  <span className={`px-2 sm:px-3 py-1 rounded-full text-xs sm:text-sm font-medium shadow-lg ${
                    product.stock === 'In Stock' ? 'bg-blue-500 text-white' :
                    product.stock === 'Coming Soon' ? 'bg-yellow-500 text-white' :
                    'bg-red-500 text-white'
                  }`}>
                    {product.stock}
                  </span>
                </div>
                <div className="absolute top-2 sm:top-4 right-2 sm:right-4">
                  <span className="bg-black/50 backdrop-blur-md text-white px-2 sm:px-3 py-1 rounded-full text-xs sm:text-sm font-medium">
                    {product.views || 0} views
                  </span>
                </div>
              </div>
              <div className="p-3 sm:p-4 md:p-6">
                <h3 className="text-base sm:text-lg font-semibold mb-1 sm:mb-2 group-hover:text-blue-600 transition-colors line-clamp-2">
                  {product.name}
                </h3>
                <p className="text-gray-600 text-xs sm:text-sm mb-2 sm:mb-4 line-clamp-2">
                  {product.description}
                </p>
                <div className="flex items-center justify-between">
                  <p className="text-lg sm:text-2xl font-bold text-green-600">
                    {formatPrice(product.price)}
                  </p>
                  <span className="text-xs sm:text-sm text-gray-500">
                    Contact for details
                  </span>
                </div>
              </div>
            </Link>
          ))}
        </div>
      )}

      <style jsx>{`
        @keyframes fadeInUp {
          from {
            opacity: 0;
            transform: translateY(20px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
        
        .scrollbar-hide {
          -ms-overflow-style: none;
          scrollbar-width: none;
        }
        .scrollbar-hide::-webkit-scrollbar {
          display: none;
        }
      `}</style>
    </div>
  );
};

export default Home;
