import React, { useState, useEffect } from 'react';
import {
  Table,
  Button,
  Input,
  Modal,
  Form,
  message,
  Row,
  Col,
  Tooltip
} from 'antd';
import {
  PlusOutlined,
  EditOutlined,
  SearchOutlined
} from '@ant-design/icons';
import AdminLayout from '../../layouts/AdminLayout';
import CustomerService from '../../services/admin/CustomerService';

const CustomerPage = () => {
  const [customers, setCustomers] = useState([]);
  const [loading, setLoading] = useState(false);
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [editingCustomer, setEditingCustomer] = useState(null);
  const [searchText, setSearchText] = useState('');
  const [form] = Form.useForm();

  // Fetch customers from API
  const fetchCustomers = async () => {
    setLoading(true);
    try {
      const data = await CustomerService.getAllCustomers();
      setCustomers(data);
    } catch (error) {
      message.error('Không thể tải danh sách khách hàng');
      console.error('Error fetching customers:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCustomers();
  }, []);

  // Handle create/update customer
  const handleSubmit = async (values) => {
    try {
      if (editingCustomer) {
        await CustomerService.updateCustomer(editingCustomer.customerId, values);
        message.success('Cập nhật khách hàng thành công!');
      } else {
        await CustomerService.createCustomer(values);
        message.success('Thêm khách hàng thành công!');
      }
      
      setIsModalVisible(false);
      setEditingCustomer(null);
      form.resetFields();
      await fetchCustomers();
    } catch (error) {
      message.error(editingCustomer ? 'Cập nhật thất bại!' : 'Thêm khách hàng thất bại!');
      console.error('Error saving customer:', error);
    }
  };

  // Open modal for create/edit
  const openModal = (customer = null) => {
    setEditingCustomer(customer);
    setIsModalVisible(true);
    
    if (customer) {
      form.setFieldsValue({
        fullName: customer.fullName,
        email: customer.email,
        phone: customer.phone,
        address: customer.address,
        city: customer.city
        // Don't set hashPassword - leave it empty for optional update
      });
    } else {
      form.resetFields();
    }
  };

  // Close modal
  const closeModal = () => {
    setIsModalVisible(false);
    setEditingCustomer(null);
    form.resetFields();
  };

  // Filter customers based on search text
  const filteredCustomers = customers.filter(customer =>
    customer.fullName?.toLowerCase().includes(searchText.toLowerCase()) ||
    customer.email?.toLowerCase().includes(searchText.toLowerCase()) ||
    customer.phone?.includes(searchText) ||
    customer.city?.toLowerCase().includes(searchText.toLowerCase())
  );

  // Table columns
  const columns = [
    {
      title: 'ID',
      dataIndex: 'customerId',
      key: 'customerId',
      width: 60,
    },
    {
      title: 'Họ và tên',
      dataIndex: 'fullName',
      key: 'fullName',
    },
    {
      title: 'Email',
      dataIndex: 'email',
      key: 'email',
    },
    {
      title: 'Số điện thoại',
      dataIndex: 'phone',
      key: 'phone',
    },
    {
      title: 'Địa chỉ',
      dataIndex: 'address',
      key: 'address',
      render: (text) => (
        <Tooltip title={text}>
          <span style={{ maxWidth: 200, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap', display: 'inline-block' }}>
            {text}
          </span>
        </Tooltip>
      ),
    },
    {
      title: 'Thành phố',
      dataIndex: 'city',
      key: 'city',
    },
    {
      title: 'Hành động',
      key: 'actions',
      render: (_, record) => (
        <Button
          type="link"
          icon={<EditOutlined />}
          onClick={() => openModal(record)}
        />
      ),
    },
  ];

  return (
    <AdminLayout>
      <div style={{ padding: '24px' }}>
        {/* Search and Add Button */}
        <Row gutter={[16, 16]} style={{ marginBottom: '16px' }}>
          <Col xs={24} sm={12} md={8}>
            <Input
              placeholder="Tìm kiếm theo tên, email, số điện thoại hoặc thành phố"
              value={searchText}
              onChange={(e) => setSearchText(e.target.value)}
              prefix={<SearchOutlined />}
              allowClear
            />
          </Col>
          <Col xs={24} sm={12} md={8}>
            <Button
              type="primary"
              icon={<PlusOutlined />}
              onClick={() => openModal()}
            >
              Thêm khách hàng
            </Button>
          </Col>
        </Row>

        {/* Customers Table */}
        <Table
          columns={columns}
          dataSource={filteredCustomers}
          loading={loading}
          rowKey="customerId"
          pagination={{ pageSize: 8 }}
        />

        {/* Create/Edit Modal */}
        <Modal
          title={editingCustomer ? 'Chỉnh sửa khách hàng' : 'Thêm khách hàng mới'}
          visible={isModalVisible}
          onCancel={closeModal}
          footer={null}
          width={600}
        >
          <Form
            form={form}
            layout="vertical"
            onFinish={handleSubmit}
          >
            <Row gutter={16}>
              <Col span={12}>
                <Form.Item
                  label="Họ và tên"
                  name="fullName"
                  rules={[
                    { required: true, message: 'Vui lòng nhập họ và tên!' },
                    { min: 2, message: 'Tên phải có ít nhất 2 ký tự!' }
                  ]}
                >
                  <Input placeholder="Nhập họ và tên" />
                </Form.Item>
              </Col>
              <Col span={12}>
                <Form.Item
                  label="Email"
                  name="email"
                  rules={[
                    { required: true, message: 'Vui lòng nhập email!' },
                    { type: 'email', message: 'Email không hợp lệ!' }
                  ]}
                >
                  <Input placeholder="Nhập email" />
                </Form.Item>
              </Col>
            </Row>

            <Row gutter={16}>
              <Col span={12}>
                <Form.Item
                  label="Số điện thoại"
                  name="phone"
                  rules={[
                    { required: true, message: 'Vui lòng nhập số điện thoại!' },
                    { pattern: /^[0-9]{10,11}$/, message: 'Số điện thoại không hợp lệ!' }
                  ]}
                >
                  <Input placeholder="Nhập số điện thoại" />
                </Form.Item>
              </Col>
              <Col span={12}>
                <Form.Item
                  label="Thành phố"
                  name="city"
                  rules={[
                    { required: true, message: 'Vui lòng nhập thành phố!' }
                  ]}
                >
                  <Input placeholder="Nhập thành phố" />
                </Form.Item>
              </Col>
            </Row>

            <Row gutter={16}>
              <Col span={24}>
                <Form.Item
                  label="Địa chỉ"
                  name="address"
                  rules={[
                    { required: true, message: 'Vui lòng nhập địa chỉ!' }
                  ]}
                >
                  <Input placeholder="Nhập địa chỉ chi tiết" />
                </Form.Item>
              </Col>
            </Row>

            {editingCustomer && (
              <Row gutter={16}>
                <Col span={24}>
                  <Form.Item
                    label="Mật khẩu mới (để trống nếu không thay đổi)"
                    name="hashPassword"
                    rules={[
                      { min: 6, message: 'Mật khẩu phải có ít nhất 6 ký tự!' }
                    ]}
                  >
                    <Input.Password placeholder="Nhập mật khẩu mới (không bắt buộc)" />
                  </Form.Item>
                </Col>
              </Row>
            )}

            <Form.Item style={{ marginTop: '24px', marginBottom: 0, textAlign: 'right' }}>
              <Button onClick={closeModal} style={{ marginRight: 8 }}>
                Hủy
              </Button>
              <Button type="primary" htmlType="submit">
                {editingCustomer ? 'Cập nhật' : 'Thêm mới'}
              </Button>
            </Form.Item>
          </Form>
        </Modal>
      </div>
    </AdminLayout>
  );
};

export default CustomerPage;
