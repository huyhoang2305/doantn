import React, { useState } from 'react';
import { Form, Input, Button, Card, message, Row, Col, Typography } from 'antd';
import { Link } from 'react-router-dom';
import { UserOutlined, LockOutlined, MailOutlined, PhoneOutlined, HomeOutlined } from '@ant-design/icons';
import { register } from '../../services/home/HomeService';
import CustomerLayout from '../../layouts/CustomerLayout';

const { Text } = Typography;
const authStyles = {
    container: {
      display: 'flex',
      justifyContent: 'center',
      alignItems: 'center',
      background: '#f0f2f5',
      padding: '20px'
    },
    card: {
      boxShadow: '0 4px 12px rgba(0,0,0,0.08)',
      borderRadius: '12px',
      transition: 'all 0.3s ease'
    },
    loginCard: {
      width: 400
    },
    registerCard: {
      width: '100%',
      maxWidth: 800
    },
    formInput: {
      iconColor: 'rgba(0,0,0,.25)'
    },
    button: {
      height: '40px',
      fontSize: '16px',
      borderRadius: '6px'
    }
  };
const RegisterPage = () => {
  const [loading, setLoading] = useState(false);

  const onFinish = async (values) => {
    try {
      setLoading(true);
      const response = await register(values);
      message.success('Đăng ký thành công!');
      console.log('Registration response:', response);
    } catch (error) {
      message.error('Đăng ký thất bại. Vui lòng thử lại.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <CustomerLayout>
      <div style={authStyles.container}>
        <Card
          title="Đăng Ký"
          style={{
            width: '100%',
            maxWidth: 800,
            boxShadow: '0 4px 8px rgba(0,0,0,0.1)',
            borderRadius: '8px'
          }}
        >
          <Form
            name="register"
            onFinish={onFinish}
            layout="vertical"
            requiredMark={false}
          >
            <Row gutter={16}>
              <Col xs={24} sm={24} md={12}>
                <Form.Item
                  name="fullName"
                  rules={[{ required: true, message: 'Vui lòng nhập họ tên!' }]}
                >
                  <Input
                    prefix={<UserOutlined style={{ color: 'rgba(0,0,0,.25)' }} />}
                    placeholder="Họ và tên"
                    size="large"
                  />
                </Form.Item>
              </Col>
              <Col xs={24} sm={24} md={12}>
                <Form.Item
                  name="email"
                  rules={[
                    { required: true, message: 'Vui lòng nhập email!' },
                    { type: 'email', message: 'Email không hợp lệ!' }
                  ]}
                >
                  <Input
                    prefix={<MailOutlined style={{ color: 'rgba(0,0,0,.25)' }} />}
                    placeholder="Email"
                    size="large"
                  />
                </Form.Item>
              </Col>
            </Row>

            <Row gutter={16}>
              <Col xs={24} sm={24} md={12}>
                <Form.Item
                  name="password"
                  rules={[
                    { required: true, message: 'Vui lòng nhập mật khẩu!' },
                    { min: 6, message: 'Mật khẩu phải có ít nhất 6 ký tự!' }
                  ]}
                >
                  <Input.Password
                    prefix={<LockOutlined style={{ color: 'rgba(0,0,0,.25)' }} />}
                    placeholder="Mật khẩu"
                    size="large"
                  />
                </Form.Item>
              </Col>
              <Col xs={24} sm={24} md={12}>
                <Form.Item
                  name="phone"
                  rules={[{ required: true, message: 'Vui lòng nhập số điện thoại!' }]}
                >
                  <Input
                    prefix={<PhoneOutlined style={{ color: 'rgba(0,0,0,.25)' }} />}
                    placeholder="Số điện thoại"
                    size="large"
                  />
                </Form.Item>
              </Col>
            </Row>

            <Form.Item
              name="address"
              rules={[{ required: true, message: 'Vui lòng nhập địa chỉ!' }]}
            >
              <Input
                prefix={<HomeOutlined style={{ color: 'rgba(0,0,0,.25)' }} />}
                placeholder="Địa chỉ"
                size="large"
              />
            </Form.Item>

            <Row gutter={16}>
              <Col xs={24} sm={24} md={12}>
                <Form.Item name="address2">
                  <Input
                    prefix={<HomeOutlined style={{ color: 'rgba(0,0,0,.25)' }} />}
                    placeholder="Địa chỉ bổ sung (Không bắt buộc)"
                    size="large"
                  />
                </Form.Item>
              </Col>
              <Col xs={24} sm={24} md={12}>
                <Form.Item
                  name="city"
                  rules={[{ required: true, message: 'Vui lòng nhập thành phố!' }]}
                >
                  <Input
                    prefix={<HomeOutlined style={{ color: 'rgba(0,0,0,.25)' }} />}
                    placeholder="Thành phố"
                    size="large"
                  />
                </Form.Item>
              </Col>
            </Row>

            <Form.Item>
              <Button
                type="primary"
                htmlType="submit"
                size="large"
                block
                loading={loading}
                style={{ backgroundColor: '#1890ff' }}
              >
                Đăng ký
              </Button>
            </Form.Item>

            <div style={{ textAlign: 'center' }}>
              <Text>Đã có tài khoản? </Text>
              <Link to="/login" style={{ color: '#1890ff' }}>
                Đăng nhập ngay
              </Link>
            </div>
          </Form>
        </Card>
      </div>
    </CustomerLayout>
  );
};

export default RegisterPage;