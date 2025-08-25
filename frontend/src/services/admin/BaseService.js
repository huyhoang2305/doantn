import axios from 'axios';

// Create an axios instance with a base URL
const BaseService = axios.create({
  baseURL: 'http://localhost:8080', // Your base URL
});

// Function to get auth headers dynamically
BaseService.interceptors.request.use((config) => {
  const token = localStorage.getItem('adminToken');

  // Prevent sending the token for login requests
  if (config.url && config.url.includes('/auth/login')) {
    delete config.headers.Authorization; // Remove Authorization header
  } else if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }

  return config;
});

// Response interceptor to handle errors uniformly
BaseService.interceptors.response.use(
  (response) => response.data, // Automatically extract data
  (error) => {
    // Handle errors gracefully
    const errorMessage = error.response?.data || error.message;
    return Promise.reject(errorMessage);
  }
);

export default BaseService;
