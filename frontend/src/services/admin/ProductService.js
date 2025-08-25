import BaseService from './BaseService';

const API_URL = '/products';

const ProductService = {
  async getAllProducts(subCategoryId, gender, productName) {
    try {
      const params = {};
      if (subCategoryId) params.subCategoryId = subCategoryId;
      if (gender) params.gender = gender;
      if (productName) params.productName = productName;
      
      const response = await BaseService.get(API_URL, { params });
      return response;
    } catch (error) {
      console.error('Error fetching products:', error);
      throw error;
    }
  },

  async getProductById(id) {
    try {
      const response = await BaseService.get(`${API_URL}/${id}`);
      return response;
    } catch (error) {
      console.error('Error fetching product by ID:', error);
      throw error;
    }
  },

  async createProduct(product) {
    try {
      const response = await BaseService.post(API_URL, product);
      return response;
    } catch (error) {
      console.error('Error creating product:', error);
      throw error;
    }
  },

  async updateProduct(id, product) {
    try {
      const response = await BaseService.put(`${API_URL}/${id}`, product);
      return response;
    } catch (error) {
      console.error('Error updating product:', error);
      throw error;
    }
  },

  async deleteProduct(id) {
    try {
      const response = await BaseService.delete(`${API_URL}/${id}`);
      return response;
    } catch (error) {
      console.error('Error deleting product:', error);
      throw error;
    }
  },

  async toggleProductStatus(id) {
    try {
      const response = await BaseService.put(`${API_URL}/${id}/toggle-status`);
      return response;
    } catch (error) {
      console.error('Error toggling product status:', error);
      throw error;
    }
  }
};

export default ProductService;