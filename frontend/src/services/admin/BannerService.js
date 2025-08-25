import BaseService from './BaseService';

const API_URL = '/banners';

const BannerService = {
  async getAllBanners() {
    try {
      const response = await BaseService.get(API_URL);
      return response;
    } catch (error) {
      console.error('Error fetching banners:', error);
      throw error;
    }
  },

  async getBannerById(id) {
    try {
      const response = await BaseService.get(`${API_URL}/${id}`);
      return response;
    } catch (error) {
      console.error(`Error fetching banner with ID ${id}:`, error);
      throw error;
    }
  },

  async createBanner(bannerData) {
    try {
      const formData = new FormData();
      formData.append('title', bannerData.title);
      formData.append('link', bannerData.link);
      formData.append('isActive', bannerData.isActive);
      
      if (bannerData.imageFile) {
        formData.append('imageFile', bannerData.imageFile);
      }
      
      const response = await BaseService.post(API_URL, formData, {
        headers: {
          'Content-Type': 'multipart/form-data'
        }
      });
      return response;
    } catch (error) {
      console.error('Error creating banner:', error);
      throw error;
    }
  },

  async updateBanner(id, bannerData) {
    try {
      const formData = new FormData();
      formData.append('title', bannerData.title);
      formData.append('link', bannerData.link);
      formData.append('isActive', bannerData.isActive);

      if (bannerData.imageFile) {
        formData.append('imageFile', bannerData.imageFile);
      }

      const response = await BaseService.put(`${API_URL}/${id}`, formData, {
        headers: {
          'Content-Type': 'multipart/form-data'
        }
      });
      return response;
    } catch (error) {
      console.error(`Error updating banner with ID ${id}:`, error);
      throw error;
    }
  },

  async deleteBanner(id) {
    try {
      const response = await BaseService.delete(`${API_URL}/${id}`);
      return response;
    } catch (error) {
      console.error(`Error deleting banner with ID ${id}:`, error);
      throw error;
    }
  },

  async toggleBannerStatus(id) {
    try {
      const response = await BaseService.put(`${API_URL}/${id}/toggle-status`);
      return response;
    } catch (error) {
      console.error(`Error toggling banner status with ID ${id}:`, error);
      throw error;
    }
  }
};

export default BannerService;