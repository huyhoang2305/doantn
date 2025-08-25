import BaseService from './BaseService';

const API_URL = '/statistics';

const StatisticService = {
  async getStatisticsToday() {
    try {
      const response = await BaseService.get(`${API_URL}/today`);
      return response;
    } catch (error) {
      console.error('Error fetching statistics for today:', error);
      throw error;
    }
  },

  async getStatisticsThisMonth() {
    try {
      const response = await BaseService.get(`${API_URL}/this-month`);
      return response;
    } catch (error) {
      console.error('Error fetching statistics for this month:', error);
      throw error;
    }
  },

  async getStatisticsThisYear() {
    try {
      const response = await BaseService.get(`${API_URL}/this-year`);
      return response;
    } catch (error) {
      console.error('Error fetching statistics for this year:', error);
      throw error;
    }
  },

  async getItemQuantityByCategory() {
    try {
      const response = await BaseService.get(`${API_URL}/item-quantity-by-category`);
      return response;
    } catch (error) {
      console.error('Error fetching item quantity by category:', error);
      throw error;
    }
  },

  async getMonthlyStatisticsForYear() {
    try {
      const response = await BaseService.get(`${API_URL}/monthly`);
      return response;
    } catch (error) {
      console.error('Error fetching monthly statistics for the year:', error);
      throw error;
    }
  },

  async getDailyStatisticsForMonth(year, month) {
    try {
      const response = await BaseService.get(`${API_URL}/daily`, {
        params: { year, month }
      });
      return response;
    } catch (error) {
      console.error(`Error fetching daily statistics for ${month}/${year}:`, error);
      throw error;
    }
  },

  async getStatisticsByDay(year, month, day) {
    try {
      const response = await BaseService.get(`${API_URL}/by-day`, {
        params: { year, month, day }
      });
      return response;
    } catch (error) {
      console.error(`Error fetching statistics for ${day}/${month}/${year}:`, error);
      throw error;
    }
  },

  async getRevenueByDateRange(startDate, endDate, viewType = 'day') {
    try {
      const response = await BaseService.get(`${API_URL}/revenue`, {
        params: {
          startDate,
          endDate,
          viewType
        }
      });
      return response;
    } catch (error) {
      console.error('Error fetching revenue by date range:', error);
      throw error;
    }
  },

  async getDailyRevenue(year, month) {
    try {
      const response = await BaseService.get(`${API_URL}/daily-revenue`, {
        params: { year, month }
      });
      return response;
    } catch (error) {
      console.error('Error fetching daily revenue:', error);
      throw error;
    }
  },

  async getMonthlyRevenue(year) {
    try {
      const response = await BaseService.get(`${API_URL}/monthly-revenue`, {
        params: { year }
      });
      return response;
    } catch (error) {
      console.error('Error fetching monthly revenue:', error);
      throw error;
    }
  },
};

export default StatisticService;