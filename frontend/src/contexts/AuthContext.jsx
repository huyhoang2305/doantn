import React, { createContext, useState, useContext, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { message } from 'antd';
import AuthService from '../services/admin/AuthService';

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    checkAuth();
  }, []);

  const checkAuth = async () => {
    try {
      if (AuthService.isAuthenticated()) {
        const userData = await AuthService.getCurrentUser();
        setUser(userData);
      }
    } catch (error) {
      console.error('Auth check failed:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleLogin = async (email, password) => {
    try {
      await AuthService.login(email, password);
      const userData = await AuthService.getCurrentUser();
      setUser(userData);
      message.success('Đăng nhập thành công');
      navigate('/admin/dashboard');
    } catch (error) {
      message.error(error.message || 'Đăng nhập thất bại');
      throw error;
    }
  };

  const handleLogout = () => {
    AuthService.logout();
    setUser(null);
    navigate('/admin/login');
    message.success('Đăng xuất thành công');
  };

  const handleChangePassword = async (changePasswordDto) => {
    try {
      await AuthService.changePassword(changePasswordDto);
      message.success('Đổi mật khẩu thành công');
    } catch (error) {
      message.error(error.message || 'Đổi mật khẩu thất bại');
      throw error;
    }
  };

  if (loading) {
    return <div>Loading...</div>;
  }

  const contextValue = {
    user,
    isAuthenticated: AuthService.isAuthenticated,
    handleLogin,
    handleLogout,
    handleChangePassword
  };

  return (
    <AuthContext.Provider value={contextValue}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};