// src/services/HomeService.js

import axios from 'axios';

const BASE_URL = 'http://localhost:8080/home'; // Base URL for your API endpoints


export const getAllBanners = async () => {
    try {
        const response = await axios.get(`${BASE_URL}/banners`);
        // Xử lý imageUrl nếu có 2 phần http
        const banners = (response.data || []).map(banner => {
            if (banner.imageUrl) {
                const httpCount = (banner.imageUrl.match(/http/g) || []).length;
                if (httpCount > 1) {
                    const lastHttpIndex = banner.imageUrl.lastIndexOf('http');
                    banner.imageUrl = banner.imageUrl.substring(lastHttpIndex);
                }
            }
            return banner;
        });
        return banners;
    } catch (error) {
        console.error("Error fetching banners:", error);
        throw error; // Rethrow the error for further handling
    }
};
// Fetch all categories
export const getAllCategories = async () => {
    try {
        const response = await axios.get(`${BASE_URL}/categories`);
        return response.data; // Assuming the response data is a list of categories
    } catch (error) {
        console.error("Error fetching categories:", error);
        throw error; // Rethrow the error for further handling
    }
};

// Fetch subcategories based on categoryId and gender
export const getSubCategories = async (categoryId, gender) => {
    try {
        const response = await axios.get(`${BASE_URL}/subcategories`, {
            params: {
                categoryId,
                gender,
            },
        });
        return response.data; // Assuming the response data is a list of subcategories
    } catch (error) {
        console.error("Error fetching subcategories:", error);
        throw error; // Rethrow the error for further handling
    }
};

// Fetch all products based on various filtering parameters
export const getAllProducts = async (subCategoryId, gender, productName) => {
    try {
        const response = await axios.get(`${BASE_URL}/products`, {
            params: {
                subCategoryId,
                gender,
                productName,
            },
        });
        // Xử lý imageUrl nếu có 2 phần http
        const products = (response.data || []).map(product => {
            if (product.imageUrl) {
                const httpCount = (product.imageUrl.match(/http/g) || []).length;
                if (httpCount > 1) {
                    // Giữ phần sau cùng
                    const lastHttpIndex = product.imageUrl.lastIndexOf('http');
                    product.imageUrl = product.imageUrl.substring(lastHttpIndex);
                }
            }
            return product;
        });
        return products;
    } catch (error) {
        console.error("Error fetching products:", error);
        throw error; // Rethrow the error for further handling
    }
};

// Fetch all sizes based on product color ID
export const getSizesByProductColorId = async (productColorId) => {
    try {
        const response = await axios.get(`${BASE_URL}/product-size/product-color/${productColorId}`);
        return response.data; // Assuming the response data is a list of sizes
    } catch (error) {
        console.error("Error fetching sizes for product color ID:", error);
        throw error; // Rethrow the error for further handling
    }
};

// Fetch all images based on product color ID
export const getImagesByProductColorId = async (productColorId) => {
    try {
        const response = await axios.get(`${BASE_URL}/product-image/product-color/${productColorId}`);
        // Xử lý imageUrl nếu có 2 phần http
        const images = (response.data || []).map(image => {
            if (image.imageUrl) {
                const httpCount = (image.imageUrl.match(/http/g) || []).length;
                if (httpCount > 1) {
                    const lastHttpIndex = image.imageUrl.lastIndexOf('http');
                    image.imageUrl = image.imageUrl.substring(lastHttpIndex);
                }
            }
            return image;
        });
        return images;
    } catch (error) {
        console.error("Error fetching images for product color ID:", error);
        throw error; // Rethrow the error for further handling
    }
};
export const getProductColorsByProductId = async (productId) => {
    try {
        const response = await axios.get(`${BASE_URL}/product-color/${productId}`);
        // Xử lý imageUrl nếu có 2 phần http
        const colors = (response.data || []).map(color => {
            if (color.imageUrl) {
                const httpCount = (color.imageUrl.match(/http/g) || []).length;
                if (httpCount > 1) {
                    const lastHttpIndex = color.imageUrl.lastIndexOf('http');
                    color.imageUrl = color.imageUrl.substring(lastHttpIndex);
                }
            }
            return color;
        });
        return colors;
    } catch (error) {
        console.error("Error fetching product colors for product ID:", error);
        throw error; // Rethrow the error for further handling
    }
};
export const getProductById = async (productId) => {
    try {
        const response = await axios.get(`${BASE_URL}/product/${productId}`);
        return response.data; // Assuming the response data contains the product details
    } catch (error) {
        console.error("Error fetching product by ID:", error);
        throw error; // Rethrow the error for further handling
    }
};

// Create a new order
export const createOrder = async (orderData) => {
    try {


        // Send the request with the payload in the body
        const response = await axios.post(`${BASE_URL}/orders`, orderData);

        return response.data; // Assuming the response contains order details
    } catch (error) {
        console.error("Error creating order:", error);
        throw error; // Rethrow the error for further handling
    }
};

// Login method to authenticate a user
export const login = async (email, password) => {
    try {
        const response = await axios.post(`${BASE_URL}/login`, {
            email,
            password,
        });
        return response.data; 
    } catch (error) {
        console.error("Error logging in:", error);
        throw error; 
    }
};

// Register method to create a new user
export const register = async (registerData) => {
    try {
        const response = await axios.post(`${BASE_URL}/register`, registerData);
        return response.data; 
    } catch (error) {
        console.error("Error registering user:", error);
        throw error; 
    }
};

// Fetch customer details by ID
export const getCustomerById = async (customerId) => {
    try {
        const response = await axios.get(`${BASE_URL}/customer/${customerId}`);
        return response.data; // Assuming the response data contains customer details
    } catch (error) {
        console.error("Error fetching customer by ID:", error);
        throw error; // Rethrow the error for further handling
    }
};
// Fetch customer details by email
export const getCustomerByEmail = async (email) => {
    try {
        const response = await axios.get(`${BASE_URL}/customer/email/${email}`);
        return response.data; // Assuming the response data contains customer details
    } catch (error) {
        console.error("Error fetching customer by email:", error);
        throw error; // Rethrow the error for further handling
    }
};

// Create VNPay payment URL
export const createVNPayPayment = async (orderId, amount) => {
    try {
        const response = await axios.post(`${BASE_URL}/vnpay-payment`, null, {
            params: {
                orderId,
                amount
            }
        });
        return response.data; // Return the payment URL
    } catch (error) {
        console.error("Error creating VNPay payment:", error);
        throw error; // Rethrow the error for further handling
    }
};

// Verify VNPay payment return
export const verifyVNPayPayment = async (params) => {
    try {
        const queryString = new URLSearchParams(params).toString();
        const response = await axios.get(`${BASE_URL}/vnpay-return?${queryString}`);
        return response.data; // Return the verification result
    } catch (error) {
        console.error("Error verifying VNPay payment:", error);
        throw error; // Rethrow the error for further handling
    }
};

// Get orders by customer ID
export const getOrdersByCustomerId = async (customerId) => {
    try {
        const response = await axios.get(`${BASE_URL}/orders/customer/${customerId}`);
        return response.data; // Return the order history
    } catch (error) {
        console.error("Error fetching order history:", error);
        throw error; // Rethrow the error for further handling
    }
};

// Update customer profile
export const updateCustomerProfile = async (customerId, profileData) => {
    try {
        const response = await axios.put(`${BASE_URL}/customer/${customerId}`, profileData);
        return response.data; // Return the updated customer data
    } catch (error) {
        console.error("Error updating customer profile:", error);
        throw error; // Rethrow the error for further handling
    }
};

// Change customer password
export const changeCustomerPassword = async (customerId, passwordData) => {
    try {
        const response = await axios.put(`${BASE_URL}/customer/${customerId}/password`, passwordData);
        return response.data; // Return the success response
    } catch (error) {
        console.error("Error changing customer password:", error);
        throw error; // Rethrow the error for further handling
    }
};
