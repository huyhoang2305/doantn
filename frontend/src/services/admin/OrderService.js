import BaseService from './BaseService';

const API_URL = '/orders';

const OrderService = {
  async getAllOrders() {
    try {
      const response = await BaseService.get(API_URL);
      return response;
    } catch (error) {
      console.error('Error fetching orders:', error);
      throw error;
    }
  },

  async createOrder(orderRequestData) {
    try {
      const response = await BaseService.post(API_URL, orderRequestData);
      return response;
    } catch (error) {
      console.error('Error creating order:', error);
      throw error;
    }
  },

  async updateOrder(orderId, orderData) {
    try {
      const response = await BaseService.put(`${API_URL}/${orderId}`, orderData);
      return response;
    } catch (error) {
      console.error('Error updating order:', error);
      throw error;
    }
  },

  async deleteOrder(orderId) {
    try {
      const response = await BaseService.delete(`${API_URL}/${orderId}`);
      return response;
    } catch (error) {
      console.error('Error deleting order:', error);
      throw error;
    }
  },

  // Order Items operations
  async getOrderItemsByOrderId(orderId) {
    try {
      const response = await BaseService.get(`${API_URL}/${orderId}/items`);
      return response;
    } catch (error) {
      console.error('Error fetching order items:', error);
      throw error;
    }
  },

  async addOrderItem(orderId, itemData) {
    try {
      const response = await BaseService.post(`${API_URL}/${orderId}/items`, itemData);
      return response;
    } catch (error) {
      console.error('Error adding order item:', error);
      throw error;
    }
  },

  async updateOrderItem(orderId, itemId, itemData) {
    try {
      const response = await BaseService.put(`${API_URL}/${orderId}/items/${itemId}`, itemData);
      return response;
    } catch (error) {
      console.error('Error updating order item:', error);
      throw error;
    }
  },

  async deleteOrderItem(orderId, itemId) {
    try {
      const response = await BaseService.delete(`${API_URL}/${orderId}/items/${itemId}`);
      return response;
    } catch (error) {
      console.error('Error deleting order item:', error);
      throw error;
    }
  }
};

export default OrderService;