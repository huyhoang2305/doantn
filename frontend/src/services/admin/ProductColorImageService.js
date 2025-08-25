import BaseService from './BaseService';

const API_URL = '/product-color-images';

const ProductColorImageService = {
  async addImageToColor(formData) {
    try {
      const response = await BaseService.post(API_URL, formData);
      return response;
    } catch (error) {
      console.error('Error adding image:', error);
      throw error;
    }
  },

  async deleteImageFromColor(imageId) {
    try {
      const response = await BaseService.delete(`${API_URL}/${imageId}`);
      return response;
    } catch (error) {
      console.error('Error deleting image:', error);
      throw error;
    }
  },

  async getImagesByColorId(colorId) {
    try {
      const response = await BaseService.get(`${API_URL}/color/${colorId}`);
      return response;
    } catch (error) {
      console.error('Error fetching images:', error);
      throw error;
    }
  }
};

export default ProductColorImageService;