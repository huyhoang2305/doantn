import BaseService from './BaseService';

const API_URL = '/brands';

const BrandService = {
  async getAllBrands() {
    try {
      const response = await BaseService.get(API_URL);
      return response;
    } catch (error) {
      console.error('Error fetching brands:', error);
      throw error;
    }
  },

  async getBrandById(id) {
    try {
      const response = await BaseService.get(`${API_URL}/${id}`);
      return response;
    } catch (error) {
      console.error(`Error fetching brand with ID ${id}:`, error);
      throw error;
    }
  },

  async createBrand(brandData) {
    try {
      const formData = new FormData();
      formData.append('brandName', brandData.brandName);
      if (brandData.imageFile) {
        formData.append('imageFile', brandData.imageFile);
      }
      
      const response = await BaseService.post(API_URL, formData, {
        headers: {
          'Content-Type': 'multipart/form-data'
        }
      });
      return response;
    } catch (error) {
      console.error('Error creating brand:', error);
      throw error;
    }
  },

  async updateBrand(id, brandData) {
    try {
      const formData = new FormData();
      formData.append('brandName', brandData.brandName);
      if (brandData.imageFile) {
        formData.append('imageFile', brandData.imageFile);
      }
      
      const response = await BaseService.put(`${API_URL}/${id}`, formData, {
        headers: {
          'Content-Type': 'multipart/form-data'
        }
      });
      return response;
    } catch (error) {
      console.error(`Error updating brand with ID ${id}:`, error);
      throw error;
    }
  },

  async deleteBrand(id) {
    try {
      const response = await BaseService.delete(`${API_URL}/${id}`);
      return response;
    } catch (error) {
      console.error(`Error deleting brand with ID ${id}:`, error);
      throw error;
    }
  },

  async toggleBrandStatus(id) {
    try {
      const response = await BaseService.put(`${API_URL}/${id}/toggle-status`);
      return response;
    } catch (error) {
      console.error(`Error toggling brand status with ID ${id}:`, error);
      throw error;
    }
  }
};

export default BrandService;