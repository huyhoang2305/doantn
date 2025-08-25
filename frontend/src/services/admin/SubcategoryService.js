import BaseService from './BaseService';

const API_URL = '/subcategories';

const SubcategoryService = {
  async getAllSubcategories(categoryId, gender) {
    try {
      const params = {};
      if (categoryId) params.categoryId = categoryId;
      if (gender) params.gender = gender;
      
      const response = await BaseService.get(API_URL, { params });
      return response;
    } catch (error) {
      console.error('Error fetching subcategories:', error);
      throw error;
    }
  },

  async getSubcategoryById(id) {
    try {
      const response = await BaseService.get(`${API_URL}/${id}`);
      return response;
    } catch (error) {
      console.error(`Error fetching subcategory with ID ${id}:`, error);
      throw error;
    }
  },

  async createSubcategory(subcategory) {
    try {
      const response = await BaseService.post(API_URL, subcategory);
      return response;
    } catch (error) {
      console.error('Error creating subcategory:', error);
      throw error;
    }
  },

  async updateSubcategory(id, subcategory) {
    try {
      const response = await BaseService.put(`${API_URL}/${id}`, subcategory);
      return response;
    } catch (error) {
      console.error(`Error updating subcategory with ID ${id}:`, error);
      throw error;
    }
  },

  async deleteSubcategory(id) {
    try {
      const response = await BaseService.delete(`${API_URL}/${id}`);
      return response;
    } catch (error) {
      console.error(`Error deleting subcategory with ID ${id}:`, error);
      throw error;
    }
  },

  async toggleSubcategoryStatus(id) {
    try {
      const response = await BaseService.put(`${API_URL}/${id}/toggle-status`);
      return response;
    } catch (error) {
      console.error(`Error toggling subcategory status with ID ${id}:`, error);
      throw error;
    }
  },
};

export default SubcategoryService;