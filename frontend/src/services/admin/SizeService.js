import BaseService from './BaseService';

const API_URL = '/product-sizes';

const SizeService = {
  async findByProductColorId(colorId) {
    try {
      const response = await BaseService.get(`${API_URL}/product-color/${colorId}`);
      return response;
    } catch (error) {
      console.error('Error fetching sizes by product color ID:', error);
      throw error;
    }
  },

  async createProductSize(sizeData) {
    try {
      const response = await BaseService.post(API_URL, sizeData);
      return response;
    } catch (error) {
      console.error('Error creating product size:', error);
      throw error;
    }
  },

  async deleteProductSize(sizeId) {
    try {
      const response = await BaseService.delete(`${API_URL}/${sizeId}`);
      return response;
    } catch (error) {
      console.error('Error deleting product size:', error);
      throw error;
    }
  },

  async toggleSizeStatus(sizeId) {
    try {
      const response = await BaseService.put(`${API_URL}/${sizeId}/toggle-status`);
      return response;
    } catch (error) {
      console.error('Error toggling size status:', error);
      throw error;
    }
  }
};

export default SizeService;