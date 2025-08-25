import React, { useState, useEffect } from 'react';
import { Table, Button, Modal, Form, Input, message, Popconfirm, Space, Tag, Switch } from 'antd';
import { EditOutlined, DeleteOutlined, PlusOutlined, UserOutlined } from '@ant-design/icons';
import CustomerService from '../../services/admin/CustomerService';
import moment from 'moment';

const { TextArea } = Input;

const CustomerList = () => {
  const [customers, setCustomers] = useState([]);
  const [loading, setLoading] = useState(false);
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [editingCustomer, setEditingCustomer] = useState(null);
  const [form] = Form.useForm();

  useEffect(() => {
    loadCustomers();
  }, []);

  const loadCustomers = async () => {
    setLoading(true);
    try {
      const response = await CustomerService.getAllCustomers();
      setCustomers(response);
    } catch (error) {
      message.error('Không thể tải danh sách khách hàng');
      console.error('Error loading customers:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (customerId) => {
    try {
      await CustomerService.deleteCustomer(customerId);
      message.success('Xóa khách hàng thành công');
      loadCustomers();
    } catch (error) {
      message.error('Không thể xóa khách hàng');
      console.error('Error deleting customer:', error);
    }
  };

  const handleToggleStatus = async (customerId, currentStatus) => {
    try {
      await CustomerService.toggleCustomerStatus(customerId);
      message.success(`${currentStatus ? 'Vô hiệu hóa' : 'Kích hoạt'} khách hàng thành công`);
      loadCustomers();
    } catch (error) {
      message.error('Không thể thay đổi trạng thái khách hàng');
      console.error('Error toggling customer status:', error);
    }
  };

  const handleAdd = () => {
    setEditingCustomer(null);
    setIsModalVisible(true);
    form.resetFields();
  };

  const handleEdit = (customer) => {
    setEditingCustomer(customer);
    setIsModalVisible(true);
    form.setFieldsValue({
      ...customer,
      createdAt: customer.createdAt ? moment(customer.createdAt) : null,
    });
  };

  const handleCancel = () => {
    setIsModalVisible(false);
    setEditingCustomer(null);
    form.resetFields();
  };

  const handleOk = () => {
    form.validateFields().then(async (values) => {
      try {
        const customerData = {
          ...values,
          createdAt: values.createdAt ? values.createdAt.toISOString() : null,
        };

        if (editingCustomer) {
          await CustomerService.updateCustomer(editingCustomer.customerId, customerData);
          message.success('Cập nhật khách hàng thành công');
        } else {
          await CustomerService.createCustomer(customerData);
          message.success('Thêm khách hàng thành công');
        }
        
        setIsModalVisible(false);
        setEditingCustomer(null);
        form.resetFields();
        loadCustomers();
      } catch (error) {
        message.error('Có lỗi xảy ra, vui lòng thử lại');
        console.error('Error saving customer:', error);
      }
    });
  };

  const columns = [
    {
      title: 'ID',
      dataIndex: 'customerId',
      key: 'customerId',
      width: 80,
      sorter: (a, b) => a.customerId - b.customerId,
    },
    {
      title: 'Họ và tên',
      dataIndex: 'fullName',
      key: 'fullName',
      render: (text, record) => (
        <Space>
          <UserOutlined style={{ color: '#1890ff' }} />
          <strong>{text}</strong>
        </Space>
      ),
    },
    {
      title: 'Email',
      dataIndex: 'email',
      key: 'email',
      render: (email) => (
        <Tag color="blue">{email}</Tag>
      ),
    },
    {
      title: 'Số điện thoại',
      dataIndex: 'phone',
      key: 'phone',
      render: (phone) => phone || 'Chưa có',
    },
    {
      title: 'Địa chỉ',
      dataIndex: 'address',
      key: 'address',
      render: (address) => address || 'Chưa có',
      ellipsis: true,
    },
    {
      title: 'Thành phố',
      dataIndex: 'city',
      key: 'city',
      render: (city) => city || 'Chưa có',
    },
    {
      title: 'Xác thực email',
      dataIndex: 'emailConfirmed',
      key: 'emailConfirmed',
      render: (confirmed) => (
        <Tag color={confirmed ? 'green' : 'orange'}>
          {confirmed ? 'Đã xác thực' : 'Chưa xác thực'}
        </Tag>
      ),
    },
    {
      title: 'Ngày tạo',
      dataIndex: 'createdAt',
      key: 'createdAt',
      render: (date) => date ? moment(date).format('DD/MM/YYYY HH:mm') : 'N/A',
      sorter: (a, b) => moment(a.createdAt).unix() - moment(b.createdAt).unix(),
    },
    {
      title: 'Trạng thái',
      dataIndex: 'isActive',
      key: 'isActive',
      render: (isActive, record) => (
        <Switch
          checked={isActive}
          onChange={() => handleToggleStatus(record.customerId, isActive)}
          checkedChildren="Hoạt động"
          unCheckedChildren="Vô hiệu hóa"
        />
      ),
      width: 120,
    },
    {
      title: 'Thao tác',
      render: (text, record) => (
        <Space>
          <Button 
            type="link" 
            icon={<EditOutlined />} 
            onClick={() => handleEdit(record)}
            style={{ color: '#1890ff' }}
          >
            Sửa
          </Button>
          <Popconfirm
            title="Bạn có chắc chắn muốn xóa khách hàng này?"
            onConfirm={() => handleDelete(record.customerId)}
            okText="Xóa"
            cancelText="Hủy"
            okType="danger"
          >
            <Button 
              type="link" 
              danger 
              icon={<DeleteOutlined />}
            >
              Xóa
            </Button>
          </Popconfirm>
        </Space>
      ),
      key: 'actions',
      fixed: 'right',
      width: 120,
    },
  ];

  return (
    <div>
      <div style={{ 
        display: 'flex', 
        justifyContent: 'space-between', 
        alignItems: 'center', 
        marginBottom: 16,
        padding: '16px 0',
        borderBottom: '1px solid #f0f0f0'
      }}>
        <h2 style={{ margin: 0, color: '#001529', fontSize: '24px', fontWeight: 'bold' }}>
          Quản lý khách hàng
        </h2>
        <Button 
          type="primary" 
          icon={<PlusOutlined />} 
          onClick={handleAdd}
          size="large"
          style={{
            background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
            border: 'none',
            borderRadius: '8px',
            boxShadow: '0 4px 12px rgba(102, 126, 234, 0.3)'
          }}
        >
          Thêm khách hàng
        </Button>
      </div>

      <Table
        columns={columns}
        dataSource={customers}
        rowKey="customerId"
        loading={loading}
        pagination={{
          total: customers.length,
          pageSize: 10,
          showSizeChanger: true,
          showQuickJumper: true,
          showTotal: (total, range) => `${range[0]}-${range[1]} của ${total} khách hàng`,
        }}
        scroll={{ x: 1200 }}
        style={{
          background: '#fff',
          borderRadius: '12px',
          boxShadow: '0 4px 20px rgba(0,0,0,0.1)'
        }}
      />

      <Modal
        title={editingCustomer ? "Chỉnh sửa khách hàng" : "Thêm khách hàng mới"}
        visible={isModalVisible}
        onOk={handleOk}
        onCancel={handleCancel}
        okText={editingCustomer ? "Cập nhật" : "Thêm"}
        cancelText="Hủy"
        width={600}
        style={{ top: 20 }}
        bodyStyle={{ maxHeight: '70vh', overflowY: 'auto' }}
      >
        <Form
          form={form}
          layout="vertical"
          name="customerForm"
        >
          <Form.Item
            name="fullName"
            label="Họ và tên"
            rules={[
              { required: true, message: 'Vui lòng nhập họ và tên!' },
              { min: 2, message: 'Họ và tên phải có ít nhất 2 ký tự!' }
            ]}
          >
            <Input placeholder="Nhập họ và tên" />
          </Form.Item>

          <Form.Item
            name="email"
            label="Email"
            rules={[
              { required: true, message: 'Vui lòng nhập email!' },
              { type: 'email', message: 'Email không hợp lệ!' }
            ]}
          >
            <Input placeholder="Nhập email" />
          </Form.Item>

          <Form.Item
            name="phone"
            label="Số điện thoại"
            rules={[
              { pattern: /^[0-9]{10,11}$/, message: 'Số điện thoại phải có 10-11 số!' }
            ]}
          >
            <Input placeholder="Nhập số điện thoại" />
          </Form.Item>

          <Form.Item
            name="address"
            label="Địa chỉ"
          >
            <TextArea 
              rows={2} 
              placeholder="Nhập địa chỉ" 
            />
          </Form.Item>

          <Form.Item
            name="address2"
            label="Địa chỉ 2 (tùy chọn)"
          >
            <Input placeholder="Nhập địa chỉ phụ" />
          </Form.Item>

          <Form.Item
            name="city"
            label="Thành phố"
          >
            <Input placeholder="Nhập thành phố" />
          </Form.Item>

          {!editingCustomer && (
            <Form.Item
              name="hashPassword"
              label="Mật khẩu"
              rules={[
                { required: true, message: 'Vui lòng nhập mật khẩu!' },
                { min: 6, message: 'Mật khẩu phải có ít nhất 6 ký tự!' }
              ]}
            >
              <Input.Password placeholder="Nhập mật khẩu" />
            </Form.Item>
          )}
        </Form>
      </Modal>
    </div>
  );
};

export default CustomerList;
