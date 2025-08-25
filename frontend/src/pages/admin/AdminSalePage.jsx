import React, { useEffect, useState } from 'react';
import { Table, Card, Button, message, Input, Modal, Form, InputNumber, Row, Col, Divider, Select, Space } from 'antd';
import { UserAddOutlined } from '@ant-design/icons';
import OrderService from '../../services/admin/OrderService';
import AdminLayout from '../../layouts/AdminLayout';
import ProductService from '../../services/admin/ProductService';
import CustomerService from '../../services/admin/CustomerService';
import ColorService from '../../services/admin/ColorService';
import SizeService from '../../services/admin/SizeService';

const { Option } = Select;

const AdminSalePage = () => {
  const [products, setProducts] = useState([]);
  const [search, setSearch] = useState('');
  const [loading, setLoading] = useState(false);
  const [cart, setCart] = useState([]);
  const [customer, setCustomer] = useState(null);
  const [phone, setPhone] = useState('');
  const [findingCustomer, setFindingCustomer] = useState(false);
  const [checkoutVisible, setCheckoutVisible] = useState(false);
  const [createCustomerVisible, setCreateCustomerVisible] = useState(false);
  const [productSelectionVisible, setProductSelectionVisible] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [productColors, setProductColors] = useState([]);
  const [productSizes, setProductSizes] = useState([]);
  const [selectedColor, setSelectedColor] = useState(null);
  const [selectedSize, setSelectedSize] = useState(null);
  const [checkoutForm] = Form.useForm();
  const [customerForm] = Form.useForm();

  // Load all products
  const fetchProducts = async (keyword = '') => {
    setLoading(true);
    try {
      const data = await ProductService.getAllProducts(null, null, keyword || null);
      setProducts(data);
    } catch (error) {
      message.error('Không thể tải sản phẩm!');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProducts();
  }, []);

  // Search products
  const handleSearch = (value) => {
    setSearch(value);
    fetchProducts(value);
  };

  // Show product selection modal
  const showProductSelection = async (product) => {
    setSelectedProduct(product);
    setSelectedColor(null);
    setSelectedSize(null);
    setProductSizes([]);
    
    try {
      const colors = await ColorService.getColorsByProductId(product.productId);
      setProductColors(colors);
      setProductSelectionVisible(true);
    } catch (error) {
      message.error('Không thể tải màu sắc sản phẩm!');
    }
  };

  // Handle color selection
  const handleColorChange = async (colorId) => {
    setSelectedColor(colorId);
    setSelectedSize(null);
    
    try {
      const sizes = await SizeService.findByProductColorId(colorId);
      setProductSizes(sizes);
    } catch (error) {
      message.error('Không thể tải size sản phẩm!');
      setProductSizes([]);
    }
  };

  // Add product with color and size to cart
  const handleAddToCartWithSelection = () => {
    if (!selectedColor || !selectedSize) {
      message.warning('Vui lòng chọn màu sắc và size!');
      return;
    }

    const selectedColorObj = productColors.find(c => c.productColorId === selectedColor);
    const selectedSizeObj = productSizes.find(s => s.productSizeId === selectedSize);
    
    const cartKey = `${selectedProduct.productId}-${selectedColor}-${selectedSize}`;
    
    setCart((prev) => {
      const exist = prev.find((item) => item.cartKey === cartKey);
      if (exist) {
        return prev.map((item) =>
          item.cartKey === cartKey
            ? { ...item, quantity: item.quantity + 1 }
            : item
        );
      }
      return [...prev, { 
        ...selectedProduct,
        cartKey,
        productColorId: selectedColor,
        productSizeId: selectedSize,
        colorName: selectedColorObj?.colorName,
        sizeValue: selectedSizeObj?.sizeValue,
        stockQuantity: selectedSizeObj?.stockQuantity,
        quantity: 1,
        unitPrice: selectedProduct.unitPrice || 0
      }];
    });

    setProductSelectionVisible(false);
    message.success('Đã thêm sản phẩm vào giỏ hàng!');
  };

  // Update quantity in cart
  const updateCartQuantity = (cartKey, quantity) => {
    setCart((prev) =>
      prev.map((item) =>
        item.cartKey === cartKey ? { ...item, quantity } : item
      )
    );
  };

  // Remove from cart
  const removeFromCart = (cartKey) => {
    setCart((prev) => prev.filter((item) => item.cartKey !== cartKey));
  };

  // Find customer by phone
  const findCustomer = async () => {
    if (!phone) return;
    setFindingCustomer(true);
    try {
      const data = await CustomerService.getCustomerByPhone(phone);
      setCustomer(data);
      if (!data) message.warning('Không tìm thấy khách hàng!');
    } catch (error) {
      message.error('Lỗi khi tìm khách hàng!');
    } finally {
      setFindingCustomer(false);
    }
  };

  // Create new customer
  const handleCreateCustomer = async (values) => {
    try {
      const customerData = {
        ...values,
        emailConfirmed: true
        // Password will be set to default "123456" by backend
      };
      const newCustomer = await CustomerService.createCustomer(customerData);
      setCustomer(newCustomer);
      setPhone(newCustomer.phone);
      setCreateCustomerVisible(false);
      customerForm.resetFields();
      message.success('Tạo khách hàng thành công!');
    } catch (error) {
      message.error('Lỗi khi tạo khách hàng!');
    }
  };

  // Calculate total
  const totalAmount = cart.reduce((sum, item) => sum + (item.unitPrice || 0) * (item.quantity || 0), 0);

  // Checkout
  const handleCheckout = async (values) => {
    if (!cart.length) {
      message.warning('Chưa có sản phẩm trong giỏ hàng!');
      return;
    }
    setLoading(true);
    try {
      const orderRequestData = {
        customerId: customer?.customerId || 0,
        guestDto: !customer ? {
          fullName: 'Khách vãng lai',
          phone: phone,
          email: '',
          address: '',
          city: ''
        } : null,
        orderDto: {
          totalPrice: totalAmount,
          isPaid: true,
          orderNote: 'Bán hàng tại quầy'
        },
        orderItemDtos: cart.map((item) => ({
          productSizeId: item.productSizeId,
          quantity: item.quantity,
          price: item.unitPrice || 0
        }))
      };
      
      await OrderService.createOrder(orderRequestData);
      message.success('Thanh toán thành công!');
      setCart([]);
      setCustomer(null);
      setPhone('');
      setCheckoutVisible(false);
    } catch (error) {
      message.error('Thanh toán thất bại!');
    } finally {
      setLoading(false);
    }
  };

  // Product columns
  const productColumns = [
    { title: 'Tên sản phẩm', dataIndex: 'productName', key: 'productName' },
    { title: 'Giá', dataIndex: 'unitPrice', key: 'unitPrice', render: (v) => v ? v.toLocaleString('vi-VN', { style: 'currency', currency: 'VND' }) : '0 ₫' },
    { title: 'Thương hiệu', dataIndex: 'brandName', key: 'brandName' },
    {
      title: 'Thao tác',
      key: 'action',
      render: (_, record) => (
        <Button type="primary" onClick={() => showProductSelection(record)}>
          Chọn màu & size
        </Button>
      )
    }
  ];

  // Cart columns
  const cartColumns = [
    { title: 'Tên sản phẩm', dataIndex: 'productName', key: 'productName' },
    { title: 'Màu sắc', dataIndex: 'colorName', key: 'colorName' },
    { title: 'Size', dataIndex: 'sizeValue', key: 'sizeValue' },
    { title: 'Giá', dataIndex: 'unitPrice', key: 'unitPrice', render: (v) => v ? v.toLocaleString('vi-VN', { style: 'currency', currency: 'VND' }) : '0 ₫' },
    {
      title: 'Số lượng',
      dataIndex: 'quantity',
      key: 'quantity',
      render: (q, record) => (
        <InputNumber min={1} value={q} onChange={(val) => updateCartQuantity(record.cartKey, val)} />
      )
    },
    {
      title: 'Thành tiền',
      key: 'total',
      render: (_, record) => {
        const total = (record.unitPrice || 0) * (record.quantity || 0);
        return total.toLocaleString('vi-VN', { style: 'currency', currency: 'VND' });
      }
    },
    {
      title: 'Xóa',
      key: 'remove',
      render: (_, record) => (
        <Button danger onClick={() => removeFromCart(record.cartKey)}>Xóa</Button>
      )
    }
  ];

  return (
    <AdminLayout>
      <div style={{ padding: 24 }}>
        <Row gutter={24}>
          <Col span={14}>
            <Card title="Tìm kiếm & Thêm sản phẩm" bordered={false}>
              <Input.Search
                placeholder="Tìm kiếm sản phẩm..."
                enterButton="Tìm"
                value={search}
                onChange={e => setSearch(e.target.value)}
                onSearch={handleSearch}
                style={{ marginBottom: 16 }}
              />
              <Table
                dataSource={products}
                columns={productColumns}
                rowKey="productId"
                pagination={{ pageSize: 8 }}
              />
            </Card>
          </Col>
          <Col span={10}>
            <Card title="Giỏ hàng & Khách hàng" bordered={false}>
              <div style={{ marginBottom: 16 }}>
                <Space direction="vertical" style={{ width: '100%' }}>
                  <Input.Search
                    placeholder="Nhập số điện thoại khách hàng..."
                    enterButton="Tìm khách"
                    value={phone}
                    onChange={e => setPhone(e.target.value)}
                    onSearch={findCustomer}
                    loading={findingCustomer}
                  />
                  <Button 
                    type="dashed" 
                    icon={<UserAddOutlined />}
                    onClick={() => setCreateCustomerVisible(true)}
                    style={{ width: '100%' }}
                  >
                    Tạo khách hàng mới
                  </Button>
                </Space>
                {customer && (
                  <div style={{ marginTop: 8, color: '#3182ce' }}>
                    Khách: {customer.fullName} ({customer.phone})
                  </div>
                )}
              </div>
              <Divider />
              <Table
                dataSource={cart}
                columns={cartColumns}
                rowKey="cartKey"
                pagination={false}
                size="small"
              />
              <div style={{ textAlign: 'right', marginTop: 16 }}>
                <b>Tổng tiền: {totalAmount.toLocaleString('vi-VN', { style: 'currency', currency: 'VND' })}</b>
              </div>
              <Button
                type="primary"
                block
                style={{ marginTop: 16 }}
                onClick={() => setCheckoutVisible(true)}
                disabled={!cart.length}
                loading={loading}
              >
                Thanh toán
              </Button>
            </Card>
          </Col>
        </Row>
        
        {/* Create Customer Modal */}
        <Modal
          title="Tạo khách hàng mới"
          open={createCustomerVisible}
          onCancel={() => setCreateCustomerVisible(false)}
          onOk={() => customerForm.submit()}
          okText="Tạo khách hàng"
          cancelText="Hủy"
        >
          <Form form={customerForm} onFinish={handleCreateCustomer} layout="vertical">
            <Form.Item
              name="fullName"
              label="Họ và tên"
              rules={[{ required: true, message: 'Vui lòng nhập họ và tên!' }]}
            >
              <Input />
            </Form.Item>
            <Form.Item
              name="phone"
              label="Số điện thoại"
              rules={[{ required: true, message: 'Vui lòng nhập số điện thoại!' }]}
            >
              <Input />
            </Form.Item>
            <Form.Item
              name="email"
              label="Email"
              rules={[{ type: 'email', message: 'Email không hợp lệ!' }]}
            >
              <Input />
            </Form.Item>
            <Form.Item
              name="address"
              label="Địa chỉ"
              rules={[{ required: true, message: 'Vui lòng nhập địa chỉ!' }]}
            >
              <Input />
            </Form.Item>
            <Form.Item
              name="city"
              label="Thành phố"
              rules={[{ required: true, message: 'Vui lòng nhập thành phố!' }]}
            >
              <Input />
            </Form.Item>
          </Form>
        </Modal>

        {/* Product Color & Size Selection Modal */}
        <Modal
          title={`Chọn màu sắc và size - ${selectedProduct?.productName}`}
          open={productSelectionVisible}
          onCancel={() => setProductSelectionVisible(false)}
          onOk={handleAddToCartWithSelection}
          okText="Thêm vào giỏ"
          cancelText="Hủy"
          width={600}
        >
          <Row gutter={16}>
            <Col span={12}>
              <Form.Item label="Màu sắc" required>
                <Select
                  placeholder="Chọn màu sắc"
                  value={selectedColor}
                  onChange={handleColorChange}
                  style={{ width: '100%' }}
                >
                  {productColors.map((color) => (
                    <Option key={color.productColorId} value={color.productColorId}>
                      {color.colorName}
                    </Option>
                  ))}
                </Select>
              </Form.Item>
            </Col>
            <Col span={12}>
              <Form.Item label="Size" required>
                <Select
                  placeholder="Chọn size"
                  value={selectedSize}
                  onChange={setSelectedSize}
                  style={{ width: '100%' }}
                  disabled={!selectedColor}
                >
                  {productSizes.map((size) => (
                    <Option key={size.productSizeId} value={size.productSizeId}>
                      {size.sizeValue} (Còn: {size.stockQuantity})
                    </Option>
                  ))}
                </Select>
              </Form.Item>
            </Col>
          </Row>
          {selectedColor && (
            <div style={{ marginTop: 16 }}>
              <img 
                src={productColors.find(c => c.productColorId === selectedColor)?.imageUrl} 
                alt="Product"
                style={{ width: '100%', maxWidth: 200, height: 'auto' }}
              />
            </div>
          )}
        </Modal>

        {/* Checkout Modal */}
        <Modal
          title="Xác nhận thanh toán"
          open={checkoutVisible}
          onCancel={() => setCheckoutVisible(false)}
          onOk={() => checkoutForm.submit()}
          okText="Xác nhận"
          cancelText="Hủy"
          confirmLoading={loading}
        >
          <Form form={checkoutForm} onFinish={handleCheckout} layout="vertical">
            <Form.Item label="Khách hàng" >
              <Input value={customer ? `${customer.fullName} (${customer.phone})` : phone || 'Khách vãng lai'} disabled />
            </Form.Item>
            <Form.Item label="Tổng tiền">
              <Input value={totalAmount.toLocaleString('vi-VN', { style: 'currency', currency: 'VND' })} disabled />
            </Form.Item>
          </Form>
        </Modal>
      </div>
    </AdminLayout>
  );
};

export default AdminSalePage;
