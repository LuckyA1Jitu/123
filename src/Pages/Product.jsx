import { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import axios from 'axios';
import LoadingSpinner from '../Components/LoadingSpinner';

const Product = () => {
  const { productId } = useParams();
  const [product, setProduct] = useState(null);
  const [selectedImage, setSelectedImage] = useState(0);
  const [relatedProducts, setRelatedProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetchProduct();
  }, [productId]);

  const fetchProduct = async () => {
    try {
      setLoading(true);
      setError(null);
      
      // Fetch main product
      const response = await axios.get(`http://localhost:5000/api/products/${productId}`);
      setProduct(response.data);

      // Increment view count
      try {
        await axios.post(`http://localhost:5000/api/products/${productId}/view`);
      } catch (error) {
        console.error('Error incrementing view count:', error);
      }

      // Fetch related products
      try {
        const relatedResponse = await axios.get(`http://localhost:5000/api/products`);
        const filtered = relatedResponse.data
          .filter(p => p._id !== productId && p.category === response.data.category)
          .slice(0, 4);
        setRelatedProducts(filtered);
      } catch (error) {
        console.error('Error fetching related products:', error);
      }
    } catch (error) {
      console.error('Error fetching product:', error);
      setError('Failed to load product. Please try again later.');
    } finally {
      setLoading(false);
    }
  };

  const formatPrice = (price) => {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR'
    }).format(price);
  };

  const handleContactClick = (contactNumber) => {
    // For mobile devices, use tel: protocol
    if (/Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent)) {
      window.location.href = `tel:${contactNumber}`;
    } else {
      // For desktop, copy to clipboard
      navigator.clipboard.writeText(contactNumber);
      alert('Contact number copied to clipboard: ' + contactNumber);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen">
        <LoadingSpinner />
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <p className="text-red-600 mb-4">{error}</p>
          <Link to="/" className="text-blue-600 hover:underline">
            Return to Home
          </Link>
        </div>
      </div>
    );
  }

  if (!product) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <p className="text-gray-600 mb-4">Product not found</p>
          <Link to="/" className="text-blue-600 hover:underline">
            Return to Home
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="py-4 sm:py-8 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        {/* Product Badge */}
        <div className="mb-4 flex flex-wrap gap-2">
          {product.isNewProduct && (
            <span className="bg-green-500 text-white px-3 py-1 rounded-full text-sm">
              New Arrival
            </span>
          )}
          <span className={`px-3 py-1 rounded-full text-sm ${
            product.stock === 'In Stock' ? 'bg-blue-500 text-white' :
            product.stock === 'Coming Soon' ? 'bg-yellow-500 text-white' :
            'bg-red-500 text-white'
          }`}>
            {product.stock}
          </span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {/* Product Images */}
          <div className="space-y-4">
            <div className="bg-white rounded-lg overflow-hidden shadow-md">
              <img
                src={`http://localhost:5000${product.images?.[selectedImage] || product.imageUrl}`}
                alt={product.name}
                className="w-full h-[300px] sm:h-[500px] object-cover"
                onError={(e) => {
                  e.target.src = 'https://via.placeholder.com/400x400?text=Image+Not+Found';
                }}
              />
            </div>
            {/* Thumbnail Images */}
            {product.images && product.images.length > 1 && (
              <div className="grid grid-cols-5 gap-2">
                {product.images.map((image, index) => (
                  <button
                    key={index}
                    onClick={() => setSelectedImage(index)}
                    className={`border-2 rounded-lg overflow-hidden ${
                      selectedImage === index ? 'border-blue-500' : 'border-transparent'
                    }`}
                  >
                    <img
                      src={`http://localhost:5000${image}`}
                      alt={`${product.name} thumbnail ${index + 1}`}
                      className="w-full h-16 sm:h-20 object-cover"
                      onError={(e) => {
                        e.target.src = 'https://via.placeholder.com/100x100?text=Image+Not+Found';
                      }}
                    />
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Product Details */}
          <div className="space-y-6">
            <h1 className="text-2xl sm:text-3xl font-bold">{product.name}</h1>
            <p className="text-3xl sm:text-4xl font-bold text-green-600">
              {formatPrice(product.price)}
            </p>
            
            {/* Contact to Buy Button - New Addition */}
            <button
              onClick={() => handleContactClick(product.contactNumber)}
              className="w-full bg-blue-600 hover:bg-blue-700 text-white py-4 rounded-lg text-lg font-semibold transition-colors duration-200 flex items-center justify-center gap-2 shadow-lg hover:shadow-xl"
            >
              <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
              </svg>
              Contact to Buy
            </button>
            
            <div className="border-t border-b py-4">
              <h2 className="text-xl font-semibold mb-2">Description</h2>
              <p className="text-gray-600">{product.description}</p>
            </div>

            <div className="space-y-4">
              <div>
                <h2 className="text-lg font-semibold">Category</h2>
                <p className="text-gray-600">{product.category}</p>
              </div>

              <div>
                <h2 className="text-lg font-semibold">Availability</h2>
                <p className={`font-medium ${
                  product.stock === 'In Stock' ? 'text-green-600' :
                  product.stock === 'Coming Soon' ? 'text-yellow-600' :
                  'text-red-600'
                }`}>
                  {product.stock}
                  {product.stock === 'In Stock' && product.quantity && ` (${product.quantity} items)`}
                </p>
              </div>

              {/* Contact Information Card */}
              <div className="bg-gray-50 p-6 rounded-lg shadow-md border border-gray-100">
                <div className="flex items-start gap-4">
                  <div className="p-3 bg-blue-100 rounded-full">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-blue-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                    </svg>
                  </div>
                  <div>
                    <h2 className="text-lg font-semibold mb-1">Contact Information</h2>
                    <p className="text-gray-600 mb-2">
                      For orders and inquiries:
                    </p>
                    <p className="text-xl font-semibold text-blue-600">
                      {product.contactNumber}
                    </p>
                    <p className="text-sm text-gray-500 mt-2">
                      {/Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent) 
                        ? "Tap to call directly" 
                        : "Click to copy number"}
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Related Products */}
        {relatedProducts.length > 0 && (
          <div className="mt-16">
            <h2 className="text-2xl font-bold mb-6">Related Products</h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
              {relatedProducts.map((relatedProduct) => (
                <Link
                  key={relatedProduct._id}
                  to={`/product/${relatedProduct._id}`}
                  className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-all duration-300"
                >
                  <div className="relative aspect-square">
                    <img
                      src={`http://localhost:5000${relatedProduct.images?.[0] || relatedProduct.imageUrl}`}
                      alt={relatedProduct.name}
                      className="w-full h-full object-cover"
                      onError={(e) => {
                        e.target.src = 'https://via.placeholder.com/400x400?text=Image+Not+Found';
                      }}
                    />
                    <div className="absolute bottom-2 right-2">
                      <span className="bg-black/50 backdrop-blur-md text-white px-2 py-1 rounded-full text-xs">
                        {relatedProduct.views || 0} views
                      </span>
                    </div>
                  </div>
                  <div className="p-4">
                    <h3 className="font-semibold text-lg mb-2 line-clamp-1">{relatedProduct.name}</h3>
                    <p className="text-green-600 font-bold">{formatPrice(relatedProduct.price)}</p>
                  </div>
                </Link>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default Product;
