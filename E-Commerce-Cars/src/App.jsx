import { BrowserRouter as Router, Route, Routes,Navigate } from "react-router-dom";
import HomePage from "./pages/HomePage";
import AboutPage from './pages/AboutPage';
import ContactPage from './pages/ContactPage';
import CartPage from './pages/CartPage';
import ProductDetails from "./components/ProductDetails";
import { useEffect } from "react";
import { CartProvider } from "./context/CartContext";
import { ToastContainer } from "react-toastify";
import 'react-toastify/dist/ReactToastify.css';
import { FavoritesProvider } from "./context/FavoritesContext";
import FavoritesPage from "./pages/FavoritesPage";
import { AuthProvider } from './context/AuthContext';
import SellerLayout from './components/SellerLayout';
import SellerDashboard from './pages/seller/SellerDashboard';
import AddProduct from './pages/seller/AddProduct';
import EditProduct from './pages/seller/EditProduct';
import { initializeMockData } from "./utils/initializeMockData";
import Messages from "./pages/seller/Messages";
import Login from "./components/Login";
import { useAuth } from "./context/AuthContext";
import Header from "./components/Header";
import ProductListingPage from "./pages/ProductListing";
import Register from "./components/Register";



function App() {
  useEffect(() => {
    
    initializeMockData(); 
  }, []);
  return (
    <AuthProvider>
    <CartProvider>
      <FavoritesProvider>
      <Router>
        <ToastContainer/>
        <AuthWarapper/>
      </Router>
      </FavoritesProvider>
    </CartProvider>
    </AuthProvider>
  );
};

function AuthWarapper(){
  const {currentUser, isSeller, isBuyer} = useAuth();
  return (
  <Routes>
    <Route path="/register" element={<Register/>}/>
    <Route path="/login" element={<Login/>}/>
    <Route path="/" element={<HomePage/>}/>
    <Route path="/products" element={<ProductListingPage />} />
    <Route path="/about" element={<AboutPage/>}/>
    <Route path="/contact" element={<ContactPage/>}/>
    <Route path="/product/:id" element={<ProductDetails/>}/>
    <Route
      path="/cart"
      element={isBuyer? <CartPage/> : <Navigate to="/login" replace/>}
    />
    <Route
      path="/favorites"
      element={isBuyer? <FavoritesPage/> : <Navigate to="/login" replace/>}
    />
    <Route path="/seller" element={isSeller? <Navigate to="/seller/dashboard" replace /> : <Navigate to="/login" />} />
    
    <Route element={isSeller ? <SellerLayout /> : <Navigate to="/login" />}>
    <Route path="/seller/dashboard" element={<SellerDashboard />} />
    <Route path="/seller/messages" element={<Messages />} />
    <Route path="/seller/add-product" element={<AddProduct />} />
    <Route path="/seller/edit-product/:id" element={<EditProduct />} />
    </Route>

  </Routes>
  );}

export default App;
