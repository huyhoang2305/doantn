import BaseService from './BaseService';

const API_URL = '/auth';

// Token management functions
const TokenManager = {
  setToken(token, expiresIn) {
    const expirationTime = new Date().getTime() + expiresIn; // Calculate expiration time
    localStorage.setItem('adminToken', token);
    localStorage.setItem('tokenExpiration', new Date(expirationTime).toISOString()); // Store as ISO string
  },

  getToken() {
    return localStorage.getItem('adminToken');
  },

  removeToken() {
    localStorage.removeItem('adminToken');
    localStorage.removeItem('tokenExpiration');
  },

  isValid() {
    const token = this.getToken();
    const expiration = localStorage.getItem('tokenExpiration');

    if (!token || !expiration) return false;

    const currentTime = new Date().getTime();
    const expirationTime = new Date(expiration).getTime();

    return currentTime < expirationTime;
  }
};

const AuthService = {
  // Authentication methods
  async login(email, password) {
    try {
      const response = await BaseService.post(`${API_URL}/login`, { email, password });

      if (response.token && response.expiresIn) {
        TokenManager.setToken(response.token, response.expiresIn); // Pass expiresIn in milliseconds
      }
      return response;
    } catch (error) {
      console.error('Error during login:', error);
      throw error;
    }
  },

  logout() {
    TokenManager.removeToken();
  },

  isAuthenticated() {
    return TokenManager.isValid();
  },

  // User management methods
  async getCurrentUser() {
    try {
      const response = await BaseService.get(`${API_URL}/me`);
      return response;
    } catch (error) {
      console.error('Error fetching current user:', error);
      throw error;
    }
  },

  async changePassword(changePasswordDto) {
    try {
      const response = await BaseService.post(`${API_URL}/me/password`, changePasswordDto);
      return response;
    } catch (error) {
      console.error('Error changing password:', error);
      throw error;
    }
  }
};

export default AuthService;
