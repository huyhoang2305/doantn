import React from 'react';
import { Form, Input, Button, Card } from 'antd';
import { UserOutlined, LockOutlined } from '@ant-design/icons';
import { useAuth } from '../../contexts/AuthContext';
import { Navigate } from 'react-router-dom';

const AdminLoginPage = () => {
  const { handleLogin, isAuthenticated } = useAuth();
  const [form] = Form.useForm();

  if (isAuthenticated()) {
    return <Navigate to="/admin/dashboard" replace />;
  }

  const onFinish = async (values) => {
    try {
      await handleLogin(values.email, values.password);
    } catch (error) {
        console.log(error.message || 'Đăng nhập thất bại');
    }
  };

  // Styles object
  const styles = {
    pageContainer: {
      minHeight: '100vh',
      display: 'flex',
      justifyContent: 'center',
      alignItems: 'center',
      background: 'linear-gradient(135deg, #1a365d 0%, #2d3748 100%)',
    },
    card: {
      width: '100%',
      maxWidth: '420px',
      background: 'rgba(255, 255, 255, 0.95)',
      borderRadius: '16px',
      boxShadow: '0 8px 32px rgba(0, 0, 0, 0.1)',
      backdropFilter: 'blur(10px)',
      border: 'none'
    },
    header: {
      textAlign: 'center',
      marginBottom: '2rem'
    },
    logo: {
      fontSize: '3rem',
      color: '#1a365d',
      marginBottom: '1rem'
    },
    title: {
      fontSize: '1.75rem',
      fontWeight: '600',
      color: '#1a365d',
      marginBottom: '0.5rem'
    },
    subtitle: {
      color: '#4a5568',
      fontSize: '0.875rem',
      marginBottom: '2rem'
    },
    formItem: {
      marginBottom: '1.5rem'
    },
    input: {
      padding: '12px',
      height: '48px',
      borderRadius: '8px'
    },
    button: {
      height: '48px',
      borderRadius: '8px',
      fontSize: '1rem',
      fontWeight: '500',
      background: 'linear-gradient(135deg, #4299e1 0%, #2b6cb0 100%)',
      border: 'none',
      boxShadow: '0 4px 6px rgba(66, 153, 225, 0.2)',
      marginTop: '1rem'
    }
  };

  return (
    <div style={styles.pageContainer}>
      <Card style={styles.card} bordered={false}>
        <div style={styles.header}>
          <div style={styles.logo}>
            <UserOutlined />
          </div>
          <h1 style={styles.title}>Đăng Nhập Admin</h1>
          <p style={styles.subtitle}>Chào mừng trở lại! Vui lòng đăng nhập vào tài khoản của bạn.</p>
        </div>

        <Form
          form={form}
          name="login"
          onFinish={onFinish}
          layout="vertical"
          size="large"
        >
          <Form.Item
            name="email"
            style={styles.formItem}
            rules={[
              { required: true, message: 'Vui lòng nhập email!' },
              { type: 'email', message: 'Vui lòng nhập email hợp lệ!' }
            ]}
          >
            <Input
              prefix={<UserOutlined style={{ color: '#9CA3AF' }} />}
              placeholder="Email"
              style={styles.input}
            />
          </Form.Item>

          <Form.Item
            name="password"
            style={styles.formItem}
            rules={[{ required: true, message: 'Vui lòng nhập mật khẩu!' }]}
          >
            <Input.Password
              prefix={<LockOutlined style={{ color: '#9CA3AF' }} />}
              placeholder="Mật khẩu"
              style={styles.input}
            />
          </Form.Item>

          <Form.Item>
            <Button
              type="primary"
              htmlType="submit"
              block
              style={styles.button}
              className="hover:opacity-90 transition-opacity"
            >
              Đăng Nhập
            </Button>
          </Form.Item>
        </Form>
      </Card>
    </div>
  );
};

export default AdminLoginPage;