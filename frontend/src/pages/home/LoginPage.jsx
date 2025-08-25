import React, { useState } from 'react';
import { Form, Input, Button, Card, message, Typography } from 'antd';
import { Link, useNavigate } from 'react-router-dom'; // Import useNavigate
import { UserOutlined, LockOutlined } from '@ant-design/icons';
import { login } from '../../services/home/HomeService';
import CustomerLayout from '../../layouts/CustomerLayout';

const { Text } = Typography;

const authStyles = {
  container: {
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    background: '#f0f2f5',
    padding: '20px',
  },
  card: {
    boxShadow: '0 4px 12px rgba(0,0,0,0.08)',
    borderRadius: '12px',
    transition: 'all 0.3s ease',
  },
  loginCard: {
    width: 400,
  },
  registerCard: {
    width: '100%',
    maxWidth: 800,
  },
  formInput: {
    iconColor: 'rgba(0,0,0,.25)',
  },
  button: {
    height: '40px',
    fontSize: '16px',
    borderRadius: '6px',
  },
};

const LoginPage = () => {
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate(); // Initialize navigate

  const onFinish = async (values) => {
    try {
      setLoading(true);
      const response = await login(values.email, values.password);

      localStorage.setItem('jwt', response);

      message.success('Đăng nhập thành công!');
      
      // Redirect to the home page
      navigate('/');
    } catch (error) {
      message.error('Đăng nhập thất bại. Vui lòng thử lại.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <CustomerLayout>
      <div style={authStyles.container}>
        <Card
          title="Đăng Nhập"
          style={{
            width: 400,
            boxShadow: '0 4px 8px rgba(0,0,0,0.1)',
            borderRadius: '8px',
          }}
        >
          <Form
            name="login"
            onFinish={onFinish}
            layout="vertical"
            requiredMark={false}
          >
            <Form.Item
              name="email"
              rules={[
                { required: true, message: 'Vui lòng nhập email!' },
                { type: 'email', message: 'Email không hợp lệ!' },
              ]}
            >
              <Input
                prefix={<UserOutlined style={{ color: 'rgba(0,0,0,.25)' }} />}
                placeholder="Email"
                size="large"
              />
            </Form.Item>

            <Form.Item
              name="password"
              rules={[{ required: true, message: 'Vui lòng nhập mật khẩu!' }]}
            >
              <Input.Password
                prefix={<LockOutlined style={{ color: 'rgba(0,0,0,.25)' }} />}
                placeholder="Mật khẩu"
                size="large"
              />
            </Form.Item>

            <Form.Item>
              <Button
                type="primary"
                htmlType="submit"
                size="large"
                block
                loading={loading}
                style={{ backgroundColor: '#1890ff' }}
              >
                Đăng nhập
              </Button>
            </Form.Item>

            <div style={{ textAlign: 'center' }}>
              <Text>Chưa có tài khoản? </Text>
              <Link to="/register" style={{ color: '#1890ff' }}>
                Đăng ký ngay
              </Link>
            </div>
          </Form>
        </Card>
      </div>
    </CustomerLayout>
  );
};

export default LoginPage;
