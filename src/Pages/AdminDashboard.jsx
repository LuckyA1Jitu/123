import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';

const AdminDashboard = () => {
  const [products, setProducts] = useState([]);
  const [editingProduct, setEditingProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    const token = localStorage.getItem('adminToken');
    if (!token) {
      navigate('/admin/login');
      return;
    }
    fetchProducts();
  }, [navigate]);

  const fetchProducts = async () => {
    try {
      const response = await axios.get('http://localhost:5000/api/products');
      setProducts(response.data);
    } catch (error) {
      console.error('Error fetching products:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleEdit = (product) => {
    setEditingProduct({
      ...product,
      newImages: []
    });
  };

  const handleUpdate = async (e) => {
    e.preventDefault();
    const formData = new FormData();
    
    // Append all the fields
    Object.keys(editingProduct).forEach(key => {
      if (key !== 'images' && key !== 'newImages' && key !== '_id') {
        formData.append(key, editingProduct[key]);
      }
    });

    // Append new images if any
    editingProduct.newImages.forEach(image => {
      formData.append('images', image);
    });

    try {
      await axios.put(
        `http://localhost:5000/api/products/${editingProduct._id}`,
        formData,
        {
          headers: {
            'Content-Type': 'multipart/form-data',
            Authorization: `Bearer ${localStorage.getItem('adminToken')}`
          }
        }
      );
      
      setEditingProduct(null);
      fetchProducts();
    } catch (error) {
      console.error('Error updating product:', error);
      alert('Error updating product');
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Are you sure you want to delete this product?')) return;
    
    try {
      await axios.delete(`http://localhost:5000/api/products/${id}`, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem('adminToken')}`
        }
      });
      fetchProducts();
    } catch (error) {
      console.error('Error deleting product:', error);
      alert('Error deleting product');
    }
  };

  const handleLogout = () => {
    localStorage.removeItem('adminToken');
    navigate('/admin/login');
  };

  const formatPrice = (price) => {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR'
    }).format(price);
  };

  if (loading) {
    return <div className="text-center py-8">Loading...</div>;
  }

  return (
    <div className="container mx-auto p-4">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">Admin Dashboard</h1>
        <button
          onClick={handleLogout}
          className="bg-red-500 text-white px-4 py-2 rounded hover:bg-red-600"
        >
          Logout
        </button>
      </div>

      {/* Product List */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {products.map((product) => (
          <div key={product._id} className="bg-white rounded-lg shadow-md p-4">
            <img
              src={`http://localhost:5000${product.images?.[0] || product.imageUrl}`}
              alt={product.name}
              className="w-full h-48 object-cover rounded-lg mb-4"
              onError={(e) => {
                e.target.src = 'https://via.placeholder.com/400x400?text=Image+Not+Found';
              }}
            />
            <h3 className="font-semibold text-lg mb-2">{product.name}</h3>
            <p className="text-gray-600 mb-2 line-clamp-2">{product.description}</p>
            <p className="text-green-600 font-bold mb-2">{formatPrice(product.price)}</p>
            <p className="text-gray-600 mb-2">
              <span className="font-semibold">Contact:</span> {product.contactNumber}
            </p>
            <div className="flex gap-2">
              <button
                onClick={() => handleEdit(product)}
                className="bg-blue-500 text-white px-3 py-1 rounded hover:bg-blue-600"
              >
                Edit
              </button>
              <button
                onClick={() => handleDelete(product._id)}
                className="bg-red-500 text-white px-3 py-1 rounded hover:bg-red-600"
              >
                Delete
              </button>
            </div>
          </div>
        ))}
      </div>

      {/* Edit Modal */}
      {editingProduct && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-lg max-w-2xl w-full max-h-[90vh] overflow-y-auto p-6">
            <h2 className="text-xl font-semibold mb-4">Edit Product</h2>
            <form onSubmit={handleUpdate} className="space-y-4">
              <div>
                <label className="block text-sm font-medium mb-1">Name</label>
                <input
                  type="text"
                  value={editingProduct.name}
                  onChange={(e) => setEditingProduct(prev => ({...prev, name: e.target.value}))}
                  className="w-full p-2 border rounded focus:ring-2 focus:ring-blue-500"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">Description</label>
                <textarea
                  value={editingProduct.description}
                  onChange={(e) => setEditingProduct(prev => ({...prev, description: e.target.value}))}
                  className="w-full p-2 border rounded focus:ring-2 focus:ring-blue-500"
                  rows="4"
                  required
                />
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium mb-1">Price</label>
                  <input
                    type="number"
                    value={editingProduct.price}
                    onChange={(e) => setEditingProduct(prev => ({...prev, price: e.target.value}))}
                    className="w-full p-2 border rounded focus:ring-2 focus:ring-blue-500"
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-1">Category</label>
                  <input
                    type="text"
                    value={editingProduct.category}
                    onChange={(e) => setEditingProduct(prev => ({...prev, category: e.target.value}))}
                    className="w-full p-2 border rounded focus:ring-2 focus:ring-blue-500"
                    required
                  />
                </div>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium mb-1">Stock Status</label>
                  <select
                    value={editingProduct.stock}
                    onChange={(e) => setEditingProduct(prev => ({...prev, stock: e.target.value}))}
                    className="w-full p-2 border rounded focus:ring-2 focus:ring-blue-500"
                  >
                    <option value="In Stock">In Stock</option>
                    <option value="Coming Soon">Coming Soon</option>
                    <option value="Out of Stock">Out of Stock</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium mb-1">Contact Number</label>
                  <input
                    type="tel"
                    value={editingProduct.contactNumber}
                    onChange={(e) => setEditingProduct(prev => ({...prev, contactNumber: e.target.value}))}
                    className="w-full p-2 border rounded focus:ring-2 focus:ring-blue-500"
                    placeholder="Enter contact number"
                    pattern="[0-9]{10}"
                    title="Please enter a valid 10-digit phone number"
                    required
                  />
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">Add More Images</label>
                <input
                  type="file"
                  multiple
                  onChange={(e) => setEditingProduct(prev => ({
                    ...prev,
                    newImages: [...Array.from(e.target.files)]
                  }))}
                  className="w-full p-2 border rounded focus:ring-2 focus:ring-blue-500"
                  accept="image/*"
                />
              </div>
              <div className="flex gap-2 pt-4">
                <button
                  type="submit"
                  className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600 transition-colors"
                >
                  Update
                </button>
                <button
                  type="button"
                  onClick={() => setEditingProduct(null)}
                  className="bg-gray-500 text-white px-4 py-2 rounded hover:bg-gray-600 transition-colors"
                >
                  Cancel
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminDashboard; 