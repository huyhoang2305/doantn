import React, { useState, useEffect, useCallback } from 'react';
import ProductService from '../../services/admin/ProductService';
import SubcategoryService from '../../services/admin/SubcategoryService';
import BrandService from '../../services/admin/BrandService';
import { Table, Button, message, Modal, Form, Input, Select, Row, Col, Card, InputNumber, Tag } from 'antd';
import ProductColorModal from './ProductColorModal';
import { EditOutlined, AppstoreAddOutlined, SearchOutlined, ClearOutlined, PoweroffOutlined } from '@ant-design/icons';

const { Option } = Select;

const ProductList = () => {
  // State management
  const [products, setProducts] = useState([]);
  const [filteredProducts, setFilteredProducts] = useState([]);
  const [subcategories, setSubcategories] = useState([]);
  const [brands, setBrands] = useState([]);
  const [filters, setFilters] = useState({
    productName: '',
    subCategoryId: null,
    brandId: null,
    minOriginalPrice: null,
    maxOriginalPrice: null,
    minUnitPrice: null,
    maxUnitPrice: null
  });
  const [modalStates, setModalStates] = useState({
    productModal: false,
    colorModal: false
  });
  const [editingProduct, setEditingProduct] = useState(null);
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [form] = Form.useForm();

  // Initial data loading
  useEffect(() => {
    const initializeData = async () => {
      try {
        await Promise.all([
          loadBrands(),
          loadProducts(),
          loadSubcategories()
        ]);
      } catch (error) {
        message.error("Lỗi khi tải dữ liệu ban đầu");
      }
    };
    
    initializeData();
  }, []);

   // Modal handling
   const toggleModal = (modalType, visible, product = null) => {
    setModalStates(prev => ({
      ...prev,
      [modalType]: visible
    }));
    
    if (modalType === 'productModal') {
      setEditingProduct(product);
      if (product) {
        form.setFieldsValue({
          productName: product.productName,
          subCategoryId: product.subCategoryId,
          brandId: product.brandId,
          originalPrice: product.originalPrice,
          unitPrice: product.unitPrice,
        });
      } else {
        form.resetFields();
      }
    } else if (modalType === 'colorModal') {
      setSelectedProduct(product); // Set selected product for color modal
    }
  };
  // Data loading functions
  const loadSubcategories = async () => {
    try {
      const response = await SubcategoryService.getAllSubcategories(null, null);
      setSubcategories(response);
    } catch (error) {
      message.error("Lỗi khi tải danh mục con");
    }
  };

  const loadBrands = async () => {
    try {
      const response = await BrandService.getAllBrands();
      setBrands(response);
    } catch (error) {
      message.error("Lỗi khi tải thương hiệu");
    }
  };

  const loadProducts = async () => {
    try {
      const response = await ProductService.getAllProducts();
      setProducts(response);
      setFilteredProducts(response);
    } catch (error) {
      message.error("Lỗi khi tải sản phẩm");
    }
  };

  // Filter function
  const applyFilters = useCallback(() => {
    let filtered = [...products];

    // Filter by product name
    if (filters.productName) {
      filtered = filtered.filter(product => 
        product.productName.toLowerCase().includes(filters.productName.toLowerCase())
      );
    }

    // Filter by subcategory
    if (filters.subCategoryId) {
      filtered = filtered.filter(product => product.subCategoryId === filters.subCategoryId);
    }

    // Filter by brand
    if (filters.brandId) {
      filtered = filtered.filter(product => product.brandId === filters.brandId);
    }

    // Filter by original price range
    if (filters.minOriginalPrice !== null) {
      filtered = filtered.filter(product => product.originalPrice >= filters.minOriginalPrice);
    }
    if (filters.maxOriginalPrice !== null) {
      filtered = filtered.filter(product => product.originalPrice <= filters.maxOriginalPrice);
    }

    // Filter by unit price range
    if (filters.minUnitPrice !== null) {
      filtered = filtered.filter(product => product.unitPrice >= filters.minUnitPrice);
    }
    if (filters.maxUnitPrice !== null) {
      filtered = filtered.filter(product => product.unitPrice <= filters.maxUnitPrice);
    }

    setFilteredProducts(filtered);
  }, [filters, products]);

  // Clear filters
  const clearFilters = () => {
    setFilters({
      productName: '',
      subCategoryId: null,
      brandId: null,
      minOriginalPrice: null,
      maxOriginalPrice: null,
      minUnitPrice: null,
      maxUnitPrice: null
    });
    setFilteredProducts(products);
  };

  // Handle filter changes
  const handleFilterChange = (field, value) => {
    setFilters(prev => ({
      ...prev,
      [field]: value
    }));
  };

  // Apply filters when filters or products change
  useEffect(() => {
    applyFilters();
  }, [applyFilters]);

  // Product operations
  const handleProductSubmit = async () => {
    try {
      const values = await form.validateFields();
      const productData = { ...values };

      if (editingProduct) {
        await ProductService.updateProduct(editingProduct.productId, productData);
        message.success("Cập nhật sản phẩm thành công");
      } else {
        await ProductService.createProduct(productData);
        message.success("Thêm sản phẩm thành công");
      }

      toggleModal('productModal', false);
      loadProducts();
    } catch (error) {
      message.error("Vui lòng điền đầy đủ các trường bắt buộc");
    }
  };

  const handleToggleStatus = async (id) => {
    try {
      await ProductService.toggleProductStatus(id);
      message.success("Cập nhật trạng thái sản phẩm thành công");
      loadProducts();
    } catch (error) {
      if (error.response?.data) {
        message.error(error.response.data);
      } else {
        message.error("Lỗi khi cập nhật trạng thái sản phẩm");
      }
    }
  };

  // Table columns configuration
  const columns = [
    {
      title: 'ID',
      dataIndex: 'productId',
      key: 'productId',
      width: 80,
      sorter: (a, b) => a.productId - b.productId,
    },
    {
      title: 'Tên sản phẩm',
      dataIndex: 'productName',
      key: 'productName',
      sorter: (a, b) => a.productName.localeCompare(b.productName),
      ellipsis: true,
    },
    {
      title: 'Danh mục con',
      dataIndex: 'subCategoryName',
      key: 'subCategoryName',
      sorter: (a, b) => a.subCategoryName.localeCompare(b.subCategoryName),
      ellipsis: true,
    },
    {
      title: 'Thương hiệu',
      dataIndex: 'brandName',
      key: 'brandName',
      sorter: (a, b) => a.brandName.localeCompare(b.brandName),
      ellipsis: true,
    },
    {
      title: 'Giá gốc',
      dataIndex: 'originalPrice',
      key: 'originalPrice',
      render: (text) => <span>{text.toLocaleString()} VNĐ</span>,
      sorter: (a, b) => a.originalPrice - b.originalPrice,
      width: 120,
    },
    {
      title: 'Giá bán',
      dataIndex: 'unitPrice',
      key: 'unitPrice',
      render: (text) => <span>{text.toLocaleString()} VNĐ</span>,
      sorter: (a, b) => a.unitPrice - b.unitPrice,
      width: 120,
    },
    {
      title: 'Trạng thái',
      dataIndex: 'isActive',
      key: 'isActive',
      render: (isActive) => (
        <Tag color={isActive ? 'green' : 'red'}>
          {isActive ? 'Hoạt động' : 'Ngừng hoạt động'}
        </Tag>
      ),
      filters: [
        { text: 'Hoạt động', value: true },
        { text: 'Ngừng hoạt động', value: false },
      ],
      onFilter: (value, record) => record.isActive === value,
      width: 130,
    },
    {
      title: 'Hành động',
      render: (_, record) => (
        <span>
          <Button 
            type="link" 
            icon={<EditOutlined />} 
            onClick={() => toggleModal('productModal', true, record)}
            title="Sửa sản phẩm"
          />
          <Button 
            type="link" 
            icon={<PoweroffOutlined />} 
            onClick={() => handleToggleStatus(record.productId)}
            title={record.isActive ? "Ngừng hoạt động" : "Kích hoạt"}
            style={{ color: record.isActive ? '#ff4d4f' : '#52c41a' }}
          />
          <Button 
            type="link" 
            icon={<AppstoreAddOutlined />} 
            onClick={() => toggleModal('colorModal', true, record)}
            title="Quản lý màu sắc"
          />
        </span>
      ),
      width: 150,
      fixed: 'right',
    },
  ];

  return (
    <div>
      {/* Filter Section */}
      <Card title="Bộ lọc sản phẩm" style={{ marginBottom: 16 }}>
        <Row gutter={[16, 16]}>
          <Col span={8}>
            <Input
              placeholder="Tìm kiếm theo tên sản phẩm"
              value={filters.productName}
              onChange={(e) => handleFilterChange('productName', e.target.value)}
              prefix={<SearchOutlined />}
            />
          </Col>
          <Col span={8}>
            <Select
              placeholder="Chọn danh mục con"
              value={filters.subCategoryId}
              onChange={(value) => handleFilterChange('subCategoryId', value)}
              allowClear
              style={{ width: '100%' }}
            >
              {subcategories.map((subcategory) => (
                <Option key={subcategory.subCategoryId} value={subcategory.subCategoryId}>
                  {subcategory.subCategoryName}
                </Option>
              ))}
            </Select>
          </Col>
          <Col span={8}>
            <Select
              placeholder="Chọn thương hiệu"
              value={filters.brandId}
              onChange={(value) => handleFilterChange('brandId', value)}
              allowClear
              style={{ width: '100%' }}
            >
              {brands.map((brand) => (
                <Option key={brand.brandId} value={brand.brandId}>
                  {brand.brandName}
                </Option>
              ))}
            </Select>
          </Col>
          <Col span={6}>
            <InputNumber
              placeholder="Giá gốc từ"
              value={filters.minOriginalPrice}
              onChange={(value) => handleFilterChange('minOriginalPrice', value)}
              style={{ width: '100%' }}
              formatter={value => `${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, ',')}
              parser={value => value.replace(/\$\s?|(,*)/g, '')}
            />
          </Col>
          <Col span={6}>
            <InputNumber
              placeholder="Giá gốc đến"
              value={filters.maxOriginalPrice}
              onChange={(value) => handleFilterChange('maxOriginalPrice', value)}
              style={{ width: '100%' }}
              formatter={value => `${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, ',')}
              parser={value => value.replace(/\$\s?|(,*)/g, '')}
            />
          </Col>
          <Col span={6}>
            <InputNumber
              placeholder="Giá bán từ"
              value={filters.minUnitPrice}
              onChange={(value) => handleFilterChange('minUnitPrice', value)}
              style={{ width: '100%' }}
              formatter={value => `${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, ',')}
              parser={value => value.replace(/\$\s?|(,*)/g, '')}
            />
          </Col>
          <Col span={6}>
            <InputNumber
              placeholder="Giá bán đến"
              value={filters.maxUnitPrice}
              onChange={(value) => handleFilterChange('maxUnitPrice', value)}
              style={{ width: '100%' }}
              formatter={value => `${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, ',')}
              parser={value => value.replace(/\$\s?|(,*)/g, '')}
            />
          </Col>
        </Row>
        <Row style={{ marginTop: 16 }}>
          <Col>
            <Button 
              type="primary" 
              icon={<SearchOutlined />}
              onClick={applyFilters}
              style={{ marginRight: 8 }}
            >
              Tìm kiếm
            </Button>
            <Button 
              icon={<ClearOutlined />}
              onClick={clearFilters}
            >
              Xóa bộ lọc
            </Button>
          </Col>
        </Row>
      </Card>

      <Button 
        type="primary" 
        onClick={() => toggleModal('productModal', true)}
        style={{ marginBottom: 16 }}
      >
        Thêm sản phẩm
      </Button>

      <Table 
        columns={columns} 
        dataSource={filteredProducts} 
        rowKey="productId" 
        pagination={{ 
          pageSize: 10,
          showSizeChanger: true,
          showQuickJumper: true,
          showTotal: (total, range) => `${range[0]}-${range[1]} của ${total} sản phẩm`,
        }}
        scroll={{ x: 1200 }}
        size="middle"
      />

      {/* Product Modal */}
      <Modal
        title={editingProduct ? "Sửa sản phẩm" : "Thêm sản phẩm"}
        open={modalStates.productModal}
        onCancel={() => toggleModal('productModal', false)}
        onOk={handleProductSubmit}
      >
        <Form form={form} layout="vertical">
          <Form.Item
            name="productName"
            label="Tên sản phẩm"
            rules={[{ required: true, message: 'Vui lòng nhập tên sản phẩm!' }]}
          >
            <Input />
          </Form.Item>
          <Form.Item
            name="subCategoryId"
            label="Danh mục con"
            rules={[{ required: true, message: 'Vui lòng chọn danh mục con!' }]}
          >
            <Select>
              {subcategories.map((subcategory) => (
                <Option key={subcategory.subCategoryId} value={subcategory.subCategoryId}>
                  {subcategory.subCategoryName}
                </Option>
              ))}
            </Select>
          </Form.Item>
          <Form.Item
            name="brandId"
            label="Thương hiệu"
            rules={[{ required: true, message: 'Vui lòng chọn thương hiệu!' }]}
          >
            <Select>
              {brands.map((brand) => (
                <Option key={brand.brandId} value={brand.brandId}>
                  {brand.brandName}
                </Option>
              ))}
            </Select>
          </Form.Item>
          <Form.Item
            name="originalPrice"
            label="Giá gốc"
            rules={[{ required: true, message: 'Vui lòng nhập giá gốc!' }]}
          >
            <Input type="number" />
          </Form.Item>
          <Form.Item
            name="unitPrice"
            label="Giá bán"
            rules={[{ required: true, message: 'Vui lòng nhập giá bán!' }]}
          >
            <Input type="number" />
          </Form.Item>
        </Form>
      </Modal>

      {/* Color Modal */}
      <ProductColorModal
        visible={modalStates.colorModal}
        product={selectedProduct}
        onCancel={() => toggleModal('colorModal', false)}
        onSuccess={loadProducts}
      />
    </div>
  );
};

export default ProductList;