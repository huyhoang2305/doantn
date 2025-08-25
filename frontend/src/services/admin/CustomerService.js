import BaseService from './BaseService';

const API_URL = '/customers';

const CustomerService = {
  // Create a new customer
  async createCustomer(customerDto) {
    return await BaseService.post(API_URL, customerDto);
  },

  // Get all customers
  async getAllCustomers() {
    return await BaseService.get(API_URL);
  },

  // Get customer by ID
  async getCustomerById(customerId) {
    return await BaseService.get(`${API_URL}/${customerId}`);
  },

  // Update a customer
  async updateCustomer(customerId, customerDto) {
    return await BaseService.put(`${API_URL}/${customerId}`, customerDto);
  },

  // Delete a customer
  async deleteCustomer(customerId) {
    return await BaseService.delete(`${API_URL}/${customerId}`);
  },

  // Toggle customer status (active/inactive)
  async toggleCustomerStatus(customerId) {
    return await BaseService.patch(`${API_URL}/${customerId}/toggle-status`);
  },

  // Get customer by phone
  async getCustomerByPhone(phone) {
    try {
      const customers = await this.getAllCustomers();
      return customers.find(customer => customer.phone === phone) || null;
    } catch (error) {
      console.error('Error finding customer by phone:', error);
      throw error;
    }
  },

  // Get customer by email
  async getCustomerByEmail(email) {
    try {
      const customers = await this.getAllCustomers();
      return customers.find(customer => customer.email === email) || null;
    } catch (error) {
      console.error('Error finding customer by email:', error);
      throw error;
    }
  }
};

export default CustomerService;
