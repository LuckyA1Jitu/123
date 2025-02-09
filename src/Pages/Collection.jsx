import { useContext, useEffect, useState } from 'react';
import { ShopContext } from '../Context/ShopContext';
import { assets } from '../assets/assets';
import Title from '../Components/Title';
import ProductItem from '../Components/ProductItem';
import { useLocation, useSearchParams } from 'react-router-dom';
import axios from 'axios';
import { Link } from 'react-router-dom';

const Collection = () => {
  const { products, search, showSearch } = useContext(ShopContext);
  const [showFilter, setShowFilter] = useState(false);
  const [filterProducts, setFilterProducts] = useState([]);
  const [category, setCategory] = useState([]);
  const [subCategory, setSubCategory] = useState([]);
  const [sortType, setSortType] = useState('relevent');
  const [filteredProducts, setFilteredProducts] = useState([]);
  const location = useLocation();
  const [loading, setLoading] = useState(true);
  const [sortBy, setSortBy] = useState('newest');
  const [searchParams] = useSearchParams();

  const toggleCategory = (e) => {
    const value = e.target.value;

    category.includes(value)
      ? setCategory((prev) => prev.filter((item) => item !== value))
      : setCategory((prev) => [...prev, value]);
  };

  const toggleSubCategory = (e) => {
    const value = e.target.value;

    subCategory.includes(value)
      ? setSubCategory((prev) => prev.filter((item) => item !== value))
      : setSubCategory((prev) => [...prev, value]);
  };

  const applyFilter = () => {
    if (!products || products.length === 0) return; // Ensure products are available

    let productsCopy = products.slice(); // Create a shallow copy of products

    if (showSearch && search) {
      productsCopy = productsCopy.filter((item) =>
        item.name.toLowerCase().includes(search.toLowerCase().trim())
      );
    }

    if (category.length > 0) {
      productsCopy = productsCopy.filter((item) =>
        category.includes(item.category)
      );
    }
    if (subCategory.length > 0) {
      productsCopy = productsCopy.filter((item) =>
        subCategory.includes(item.subCategory)
      );
    }

    setFilterProducts(productsCopy); // Update the filtered products state
  };

  const sortProducts = () => {
    if (filterProducts.length === 0) return; // Ensure there are products to sort

    let filteredProdCopy = [...filterProducts]; // Create a shallow copy of filtered products

    switch (sortType) {
      case 'low-high':
        setFilterProducts(filteredProdCopy.sort((a, b) => a.price - b.price));
        break;
      case 'high-low':
        setFilterProducts(filteredProdCopy.sort((a, b) => b.price - a.price));
        break;

      default:
        setFilterProducts(() => {
          applyFilter();
        });

        break;
    }

    setFilterProducts(filteredProdCopy); // Update the filtered products state
  };

  useEffect(() => {
    applyFilter();
  }, [category, subCategory, search, showSearch, products]);

  useEffect(() => {
    sortProducts();
  }, [sortType]);

  useEffect(() => {
    fetchProducts();
  }, [sortBy]);

  useEffect(() => {
    const searchParams = new URLSearchParams(location.search);
    const searchQuery = searchParams.get('search');
    
    if (searchQuery) {
      const filtered = products.filter(product => 
        product.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        product.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
        product.category.toLowerCase().includes(searchQuery.toLowerCase())
      );
      setFilteredProducts(filtered);
    } else {
      setFilteredProducts(products);
    }
  }, [location.search, products]);

  const fetchProducts = async () => {
    try {
      setLoading(true);
      const response = await axios.get(`http://localhost:5000/api/products?sort=${sortBy}`);
      let filteredProducts = response.data;

      // Apply search filter if exists
      const searchQuery = searchParams.get('search');
      if (searchQuery) {
        filteredProducts = filteredProducts.filter(product => 
          product.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
          product.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
          product.category.toLowerCase().includes(searchQuery.toLowerCase())
        );
      }

      setFilteredProducts(filteredProducts);
    } catch (error) {
      console.error('Error fetching products:', error);
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

  const sortOptions = [
    { value: 'newest', label: 'Newest First' },
    { value: 'oldest', label: 'Oldest First' },
    { value: 'price-low', label: 'Price: Low to High' },
    { value: 'price-high', label: 'Price: High to Low' },
    { value: 'most-viewed', label: 'Most Viewed' }
  ];

  return (
    <div className="py-8">
      {/* Header Section */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-center mb-4">Our Collection</h1>
        <div className="flex justify-end mb-4">
          <select
            value={sortBy}
            onChange={(e) => setSortBy(e.target.value)}
            className="border rounded-lg px-4 py-2"
          >
            {sortOptions.map(option => (
              <option key={option.value} value={option.value}>
                {option.label}
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* Products Grid */}
      {loading ? (
        <div className="text-center">Loading products...</div>
      ) : products.length === 0 ? (
        <div className="text-center text-gray-500">No products found</div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {filteredProducts.map((product) => (
            <Link
              key={product._id}
              to={`/product/${product._id}`}
              className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-shadow"
            >
              <div className="relative">
                <img
                  src={`http://localhost:5000${product.imageUrl}`}
                  alt={product.name}
                  className="w-full h-64 object-cover"
                />
                {/* Product Badges */}
                <div className="absolute top-2 left-2 flex gap-2">
                  {product.isNewProduct && (
                    <span className="bg-green-500 text-white px-2 py-1 rounded-full text-sm">
                      New
                    </span>
                  )}
                  <span className={`px-2 py-1 rounded-full text-sm ${
                    product.stock === 'In Stock' ? 'bg-blue-500 text-white' :
                    product.stock === 'Coming Soon' ? 'bg-yellow-500 text-white' :
                    'bg-red-500 text-white'
                  }`}>
                    {product.stock}
                  </span>
                </div>
                {/* Views Badge */}
                <div className="absolute top-2 right-2">
                  <span className="bg-black/50 text-white px-2 py-1 rounded-full text-sm">
                    {product.views} views
                  </span>
                </div>
              </div>
              <div className="p-4">
                <h3 className="text-xl font-semibold mb-2">{product.name}</h3>
                <p className="text-gray-600 mb-2 line-clamp-2">{product.description}</p>
                <p className="text-2xl font-bold text-green-600">{formatPrice(product.price)}</p>
                <div className="mt-4 text-sm text-gray-500">
                  Contact: {product.contactNumber}
                </div>
              </div>
            </Link>
          ))}
        </div>
      )}
    </div>
  );
};

export default Collection;
