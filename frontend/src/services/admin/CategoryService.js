import BaseService from './BaseService';

const API_URL = '/categories';

const CategoryService = {
  async getAllCategories() {
    try {
      const response = await BaseService.get(API_URL);
      return response;
    } catch (error) {
      console.error('Error fetching categories:', error);
      throw error;
    }
  },

  async getCategoryById(id) {
    try {
      const response = await BaseService.get(`${API_URL}/${id}`);
      return response;
    } catch (error) {
      console.error(`Error fetching category with ID ${id}:`, error);
      throw error;
    }
  },

  async createCategory(category) {
    try {
      const response = await BaseService.post(API_URL, category);
      return response;
    } catch (error) {
      console.error('Error creating category:', error);
      throw error;
    }
  },

  async updateCategory(id, category) {
    try {
      const response = await BaseService.put(`${API_URL}/${id}`, category);
      return response;
    } catch (error) {
      console.error(`Error updating category with ID ${id}:`, error);
      throw error;
    }
  },

  async deleteCategory(id) {
    try {
      const response = await BaseService.delete(`${API_URL}/${id}`);
      return response;
    } catch (error) {
      console.error(`Error deleting category with ID ${id}:`, error);
      throw error;
    }
  },

  async toggleCategoryStatus(id) {
    try {
      const response = await BaseService.put(`${API_URL}/${id}/toggle-status`);
      return response;
    } catch (error) {
      console.error(`Error toggling category status with ID ${id}:`, error);
      throw error;
    }
  }
};

export default CategoryService;