// src/services/admin/VoucherService.js

import axios from 'axios';

const BASE_URL = 'http://localhost:8080/admin'; // Base URL for admin API endpoints

// Get all vouchers
export const getAllVouchers = async () => {
    try {
        const response = await axios.get(`${BASE_URL}/vouchers`);
        return response.data;
    } catch (error) {
        console.error("Error fetching vouchers:", error);
        throw error;
    }
};

// Get voucher by ID
export const getVoucherById = async (voucherId) => {
    try {
        const response = await axios.get(`${BASE_URL}/vouchers/${voucherId}`);
        return response.data;
    } catch (error) {
        console.error("Error fetching voucher by ID:", error);
        throw error;
    }
};

// Create new voucher
export const createVoucher = async (voucherData) => {
    try {
        const response = await axios.post(`${BASE_URL}/vouchers`, voucherData);
        return response.data;
    } catch (error) {
        console.error("Error creating voucher:", error);
        throw error;
    }
};

// Update voucher
export const updateVoucher = async (voucherId, voucherData) => {
    try {
        const response = await axios.put(`${BASE_URL}/vouchers/${voucherId}`, voucherData);
        return response.data;
    } catch (error) {
        console.error("Error updating voucher:", error);
        throw error;
    }
};

// Delete voucher
export const deleteVoucher = async (voucherId) => {
    try {
        const response = await axios.delete(`${BASE_URL}/vouchers/${voucherId}`);
        return response.data;
    } catch (error) {
        console.error("Error deleting voucher:", error);
        throw error;
    }
};

// Toggle voucher status
export const toggleVoucherStatus = async (voucherId) => {
    try {
        const response = await axios.put(`${BASE_URL}/vouchers/${voucherId}/toggle-status`);
        return response.data;
    } catch (error) {
        console.error("Error toggling voucher status:", error);
        throw error;
    }
};

// Check voucher validity for customer
export const checkVoucherValidity = async (voucherCode, customerId, orderValue) => {
    try {
        const response = await axios.post(`${BASE_URL}/vouchers/check`, {
            voucherCode,
            customerId,
            orderValue
        });
        return response.data;
    } catch (error) {
        console.error("Error checking voucher validity:", error);
        throw error;
    }
};

// Apply voucher to order
export const applyVoucher = async (voucherCode, customerId, orderValue) => {
    try {
        const response = await axios.post(`${BASE_URL}/vouchers/apply`, {
            voucherCode,
            customerId,
            orderValue
        });
        return response.data;
    } catch (error) {
        console.error("Error applying voucher:", error);
        throw error;
    }
};

// Get available vouchers for customer
export const getAvailableVouchersForCustomer = async (customerId, orderValue) => {
    try {
        const response = await axios.get(`${BASE_URL}/vouchers/available`, {
            params: {
                customerId,
                orderValue
            }
        });
        return response.data;
    } catch (error) {
        console.error("Error fetching available vouchers:", error);
        throw error;
    }
};
