import BaseService from './BaseService';

class AdminUserService {
    // Lấy thông tin admin user theo ID
    getAdminUserById(userId) {
        return BaseService.get(`/users/${userId}`);
    }

    // Cập nhật thông tin admin user
    updateAdminUser(userId, userData) {
        return BaseService.put(`/users/${userId}`, userData);
    }

    // Thay đổi mật khẩu admin
    changePassword(userId, passwordData) {
        return BaseService.put(`/users/${userId}/change-password`, passwordData);
    }

    // Upload avatar admin
    uploadAvatar(userId, formData) {
        const config = {
            headers: {
                'Content-Type': 'multipart/form-data',
                'Authorization': `Bearer ${localStorage.getItem('adminToken')}`
            }
        };
        return BaseService.post(`/users/${userId}/avatar`, formData, config);
    }

    // Lấy thông tin admin hiện tại
    getCurrentAdminProfile() {
        return BaseService.get('/users/profile');
    }

    // Cập nhật thông tin admin hiện tại
    updateCurrentAdminProfile(userData) {
        return BaseService.put('/users/profile', userData);
    }

    // Thay đổi mật khẩu admin hiện tại
    changeCurrentPassword(passwordData) {
        return BaseService.put('/users/change-password', passwordData);
    }
}

const adminUserService = new AdminUserService();
export default adminUserService;
