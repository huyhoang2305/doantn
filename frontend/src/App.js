import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import './App.css';
import CategoryPage from './pages/admin/CategoryPage'; // Import the CategoryPage component
import BannerPage from './pages/admin/BannerPage';
import DashboardPage from './pages/admin/DashboardPage';
import BrandPage from './pages/admin/BrandPage';
import SubCategoryPage from './pages/admin/SubCategoryPage';
import ProductPage from './pages/admin/ProductPage';
import OrderPage from './pages/admin/OrderPage';
import CustomerPage from './pages/admin/CustomerPage';
import VoucherPage from './pages/admin/VoucherPage';
import HomePage from './pages/home/HomePage';
import ProductDetails from './pages/home/ProductDetails';
import Cart from './pages/home/Cart';
import CheckoutPage from './pages/home/CheckoutPage';
import SuccessPage from './pages/home/SuccessPage';
import VNPayReturn from './pages/home/VNPayReturn';
import OrderHistoryPage from './pages/home/OrderHistoryPage';
import ProfilePage from './pages/home/ProfilePage';
import Product from './pages/home/Product';
import AboutPage from './pages/home/AboutPage';
import ContactPage from './pages/home/ContactPage';
import LoginPage from './pages/home/LoginPage';
import RegisterPage from './pages/home/RegisterPage';

import AdminSalePage from './pages/admin/AdminSalePage';
import AdminLoginPage from './pages/admin/AdminLoginPage';
import AdminProfilePage from './pages/admin/AdminProfilePage';

import { AuthProvider } from './contexts/AuthContext';
function App() {
  return (
    <Router>
          <AuthProvider>
        <Routes>
          <Route path="/admin/dashboard" element={<DashboardPage />} /> 
          <Route path="/admin/login" element={<AdminLoginPage />} /> 
          <Route path="/admin/category" element={<CategoryPage />} /> 
          <Route path="/admin/banner" element={<BannerPage />} /> 
          <Route path="/admin/brand" element={<BrandPage />} /> 
          <Route path="/admin/subcategory" element={<SubCategoryPage />} /> 
          <Route path="/admin/product" element={<ProductPage />} /> 
          <Route path="/admin/order" element={<OrderPage />} /> 
          <Route path="/admin/sale" element={<AdminSalePage />} /> 
          <Route path="/admin/customer" element={<CustomerPage />} /> 
          <Route path="/admin/voucher" element={<VoucherPage />} /> 
          <Route path="/admin/profile" element={<AdminProfilePage />} /> 
          <Route path="/" element={<HomePage />} /> 
          <Route path="/login" element={<LoginPage />} /> 
          <Route path="/register" element={<RegisterPage />} /> 
          <Route path="/product" element={<Product />} /> 
          <Route path="/product/:productId" element={<ProductDetails />} />
          <Route path="/cart/" element={<Cart />} />
          <Route path="/about/" element={<AboutPage />} />
          <Route path="/contact/" element={<ContactPage />} />
          <Route path="/checkout/" element={<CheckoutPage />} />
          <Route path="/success/" element={<SuccessPage />} />
          <Route path="/vnpay-return/" element={<VNPayReturn />} />
          <Route path="/orders/" element={<OrderHistoryPage />} />
          <Route path="/profile/" element={<ProfilePage />} />
        </Routes>
        </AuthProvider>
    </Router>
  );
}

export default App;
