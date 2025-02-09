import { Route, Routes, Navigate } from 'react-router-dom';
import './App.css';
import Home from './pages/Home';
import Collection from './pages/Collection';
import About from './pages/About';
import Contact from './pages/Contact';
import Product from './Pages/Product';
import Cart from './Pages/Cart';
import PlaceOrder from './pages/PlaceOrder';
import Orders from './Pages/Orders';
import Navbar from './Components/Navbar';
import Footer from './Components/Footer';
import SearchBar from './Components/SearchBar';
import AdminDashboard from './pages/AdminDashboard';
import AdminLogin from './pages/AdminLogin';
import { ShopContext } from './Context/ShopContext';
import { useContext } from 'react';

// Protected Route Component
const ProtectedRoute = ({ children }) => {
  const token = localStorage.getItem('adminToken');
  if (!token) {
    return <Navigate to="/admin/login" replace />;
  }
  return children;
};

function App() {
  const { showSearch } = useContext(ShopContext);

  return (
    <div className="px-4 sm:px-[5vw] md:px-[7vw] lg:px-[9vw]">
      <Navbar />
      {showSearch && <SearchBar />}

      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/collection" element={<Collection />} />
        <Route path="/about" element={<About />} />
        <Route path="/contact" element={<Contact />} />
        <Route path="/product/:productId" element={<Product />} />
        <Route path="/cart" element={<Cart />} />
        <Route path="/place-order" element={<PlaceOrder />} />
        <Route path="/orders" element={<Orders />} />
        <Route path="/admin/login" element={<AdminLogin />} />
        <Route
          path="/admin"
          element={
            <ProtectedRoute>
              <AdminDashboard />
            </ProtectedRoute>
          }
        />
      </Routes>

      <Footer />
    </div>
  );
}

export default App;
