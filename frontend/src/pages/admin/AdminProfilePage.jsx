import React, { useState, useEffect, useCallback } from 'react';
import {
  Card,
  Form,
  Input,
  Button,
  message,
  Spin,
  Alert,
  Tabs,
  Row,
  Col,
  Avatar,
  Typography,
  Divider
} from 'antd';
import {
  UserOutlined,
  LockOutlined,
  EditOutlined,
  SaveOutlined,
  EyeInvisibleOutlined,
  EyeTwoTone
} from '@ant-design/icons';
import AdminLayout from '../../layouts/AdminLayout';
import AdminUserService from '../../services/admin/AdminUserService';

const { Title, Text } = Typography;
const { TabPane } = Tabs;

const AdminProfilePage = () => {
  const [loading, setLoading] = useState(false);
  const [updating, setUpdating] = useState(false);
  const [changingPassword, setChangingPassword] = useState(false);
  const [profile, setProfile] = useState(null);
  const [error, setError] = useState(null);
  
  const [profileForm] = Form.useForm();
  const [passwordForm] = Form.useForm();

  const fetchProfile = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      // Sử dụng getCurrentAdminProfile thay vì getCurrentUser + getAdminUserById
      const profileData = await AdminUserService.getCurrentAdminProfile();
      setProfile(profileData);
      profileForm.setFieldsValue({
        fullName: profileData.fullName
      });
    } catch (err) {
      setError('Không thể tải thông tin tài khoản');
      console.error('Error fetching profile:', err);
    } finally {
      setLoading(false);
    }
  }, [profileForm]);

  useEffect(() => {
    fetchProfile();
  }, [fetchProfile]);

  const handleUpdateProfile = async (values) => {
    setUpdating(true);
    try {
      await AdminUserService.updateCurrentAdminProfile({
        fullName: values.fullName
      });
      
      message.success('Cập nhật thông tin thành công!');
      await fetchProfile(); // Refresh data
    } catch (err) {
      message.error('Cập nhật thông tin thất bại!');
      console.error('Error updating profile:', err);
    } finally {
      setUpdating(false);
    }
  };

  const handleChangePassword = async (values) => {
    setChangingPassword(true);
    try {
      await AdminUserService.changeCurrentPassword({
        oldPassword: values.currentPassword,
        newPassword: values.newPassword
      });
      
      message.success('Đổi mật khẩu thành công!');
      passwordForm.resetFields();
    } catch (err) {
      message.error('Đổi mật khẩu thất bại! Vui lòng kiểm tra mật khẩu hiện tại.');
      console.error('Error changing password:', err);
    } finally {
      setChangingPassword(false);
    }
  };

  const validatePassword = (_, value) => {
    if (!value || value.length < 8) {
      return Promise.reject(new Error('Mật khẩu phải có ít nhất 8 ký tự'));
    }
    if (value.length > 16) {
      return Promise.reject(new Error('Mật khẩu không được vượt quá 16 ký tự'));
    }
    return Promise.resolve();
  };

  const validateConfirmPassword = (_, value) => {
    const newPassword = passwordForm.getFieldValue('newPassword');
    if (value && value !== newPassword) {
      return Promise.reject(new Error('Mật khẩu xác nhận không khớp'));
    }
    return Promise.resolve();
  };

  if (loading) {
    return (
      <AdminLayout>
        <div style={{ textAlign: 'center', padding: '50px' }}>
          <Spin size="large" />
        </div>
      </AdminLayout>
    );
  }

  return (
    <AdminLayout>
      <div style={{ padding: '24px', maxWidth: '800px', margin: '0 auto' }}>
        <Title level={2}>
          <UserOutlined /> Quản lý tài khoản cá nhân
        </Title>

        {error && (
          <Alert
            message="Lỗi"
            description={error}
            type="error"
            showIcon
            style={{ marginBottom: '24px' }}
            closable
          />
        )}

        {profile && (
          <Card>
            {/* Header với avatar và thông tin cơ bản */}
            <div style={{ textAlign: 'center', marginBottom: '32px' }}>
              <Avatar 
                size={80} 
                icon={<UserOutlined />} 
                style={{ backgroundColor: '#1890ff', marginBottom: '16px' }}
              />
              <div>
                <Title level={3} style={{ margin: 0 }}>
                  {profile.fullName}
                </Title>
                <Text type="secondary">{profile.email}</Text>
                <br />
                <Text type="secondary">
                  Vai trò: <strong>{profile.role === 'ADMIN' ? 'Quản trị viên' : 'Nhân viên'}</strong>
                </Text>
                <br />
                <Text type="secondary">
                  Ngày tạo: {new Date(profile.createdAt).toLocaleDateString('vi-VN')}
                </Text>
              </div>
            </div>

            <Divider />

            <Tabs defaultActiveKey="1" type="card">
              <TabPane 
                tab={
                  <span>
                    <EditOutlined />
                    Thông tin cá nhân
                  </span>
                } 
                key="1"
              >
                <Form
                  form={profileForm}
                  layout="vertical"
                  onFinish={handleUpdateProfile}
                >
                  <Row gutter={[16, 16]}>
                    <Col xs={24}>
                      <Form.Item
                        label="Họ và tên"
                        name="fullName"
                        rules={[
                          { required: true, message: 'Vui lòng nhập họ và tên' },
                          { min: 2, message: 'Họ và tên phải có ít nhất 2 ký tự' }
                        ]}
                      >
                        <Input 
                          prefix={<UserOutlined />} 
                          placeholder="Nhập họ và tên"
                          size="large"
                        />
                      </Form.Item>
                    </Col>
                    <Col xs={24}>
                      <Form.Item label="Email">
                        <Input 
                          value={profile.email}
                          disabled
                          prefix={<UserOutlined />} 
                          size="large"
                          style={{ color: '#666', backgroundColor: '#f5f5f5' }}
                        />
                        <div style={{ fontSize: '12px', color: '#666', marginTop: '4px' }}>
                          Email không thể thay đổi
                        </div>
                      </Form.Item>
                    </Col>
                  </Row>

                  <Form.Item>
                    <Button 
                      type="primary" 
                      htmlType="submit" 
                      loading={updating}
                      icon={<SaveOutlined />}
                      size="large"
                    >
                      Cập nhật thông tin
                    </Button>
                  </Form.Item>
                </Form>
              </TabPane>

              <TabPane 
                tab={
                  <span>
                    <LockOutlined />
                    Đổi mật khẩu
                  </span>
                } 
                key="2"
              >
                <Form
                  form={passwordForm}
                  layout="vertical"
                  onFinish={handleChangePassword}
                >
                  <Form.Item
                    label="Mật khẩu hiện tại"
                    name="currentPassword"
                    rules={[
                      { required: true, message: 'Vui lòng nhập mật khẩu hiện tại' }
                    ]}
                  >
                    <Input.Password
                      prefix={<LockOutlined />}
                      placeholder="Nhập mật khẩu hiện tại"
                      size="large"
                      iconRender={(visible) => (visible ? <EyeTwoTone /> : <EyeInvisibleOutlined />)}
                    />
                  </Form.Item>

                  <Form.Item
                    label="Mật khẩu mới"
                    name="newPassword"
                    rules={[
                      { required: true, message: 'Vui lòng nhập mật khẩu mới' },
                      { validator: validatePassword }
                    ]}
                  >
                    <Input.Password
                      prefix={<LockOutlined />}
                      placeholder="Nhập mật khẩu mới (8-16 ký tự)"
                      size="large"
                      iconRender={(visible) => (visible ? <EyeTwoTone /> : <EyeInvisibleOutlined />)}
                    />
                  </Form.Item>

                  <Form.Item
                    label="Xác nhận mật khẩu mới"
                    name="confirmPassword"
                    rules={[
                      { required: true, message: 'Vui lòng xác nhận mật khẩu mới' },
                      { validator: validateConfirmPassword }
                    ]}
                  >
                    <Input.Password
                      prefix={<LockOutlined />}
                      placeholder="Nhập lại mật khẩu mới"
                      size="large"
                      iconRender={(visible) => (visible ? <EyeTwoTone /> : <EyeInvisibleOutlined />)}
                    />
                  </Form.Item>

                  <Form.Item>
                    <Button 
                      type="primary" 
                      htmlType="submit" 
                      loading={changingPassword}
                      icon={<LockOutlined />}
                      size="large"
                    >
                      Đổi mật khẩu
                    </Button>
                  </Form.Item>
                </Form>
              </TabPane>
            </Tabs>
          </Card>
        )}
      </div>
    </AdminLayout>
  );
};

export default AdminProfilePage;
