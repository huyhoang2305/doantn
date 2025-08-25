import React, { useState, useEffect } from 'react';
import { Modal, Form, Input, Table, Button, message, Upload } from 'antd';
import ColorService from '../../services/admin/ColorService';
import SizeService from '../../services/admin/SizeService';
import ProductColorImageService from '../../services/admin/ProductColorImageService';
import { UploadOutlined, PoweroffOutlined } from '@ant-design/icons';

const ProductColorModal = ({ visible, product, onCancel, onSuccess }) => {
  // Forms
  const [colorForm] = Form.useForm();
  const [sizeForm] = Form.useForm();
  const [imageForm] = Form.useForm();

  // State
  const [productColors, setProductColors] = useState([]);
  const [productSizes, setProductSizes] = useState([]);
  const [productColorImages, setProductColorImages] = useState([]);
  const [selectedColorId, setSelectedColorId] = useState(null);
  // Load data when product changes
  useEffect(() => {
    if (product && visible) {
  
      loadProductColors(product.productId);
    }
  }, [product, visible]);

  // Reset state when modal closes
  useEffect(() => {
    if (!visible) {
      setSelectedColorId(null);
      setProductSizes([]);
      setProductColorImages([]);
      colorForm.resetFields();
      sizeForm.resetFields();
      imageForm.resetFields();
    }
  }, [visible, colorForm, sizeForm, imageForm]);

  // Data loading functions
  const loadProductColors = async (productId) => {
    try {
      const data = await ColorService.getColorsByProductId(productId);
      setProductColors(data);
    } catch (error) {
      message.error("Lỗi khi tải màu sắc sản phẩm");
    }
  };

  const loadProductSizes = async (colorId) => {
    try {
      const data = await SizeService.findByProductColorId(colorId);
      setProductSizes(data);
    } catch (error) {
      message.error("Lỗi khi tải kích thước sản phẩm");
    }
  };

  const loadProductColorImages = async (colorId) => {
    try {
      const data = await ProductColorImageService.getImagesByColorId(colorId);
      setProductColorImages(data);
    } catch (error) {
      message.error("Lỗi khi tải hình ảnh sản phẩm");
    }
  };

  // Color operations
  const handleColorSelect = (colorId) => {
    setSelectedColorId(colorId);
    loadProductSizes(colorId);
    loadProductColorImages(colorId);
  };

  const handleAddColor = async () => {
    try {
      const values = await colorForm.validateFields();
      const { colorName, imageFile } = values;
      
      const formData = new FormData();
      formData.append('imageFile', imageFile[0].originFileObj);
      formData.append('colorName', colorName);
      formData.append('productId', product.productId);

      await ColorService.addColorToProduct(formData);
      message.success("Thêm màu sắc thành công");
      loadProductColors(product.productId);
      colorForm.resetFields();
      onSuccess();
    } catch (error) {
      message.error("Lỗi khi thêm màu sắc");
    }
  };

  const handleToggleColorStatus = async (colorId) => {
    try {
      await ColorService.toggleColorStatus(colorId);
      message.success("Thay đổi trạng thái màu sắc thành công");
      loadProductColors(product.productId);
      onSuccess();
    } catch (error) {
      if (error.response?.data?.message) {
        message.error(error.response.data.message);
      } else if (typeof error.response?.data === 'string') {
        message.error(error.response.data);
      } else {
        message.error("Lỗi khi thay đổi trạng thái màu sắc");
      }
    }
  };

  // Size operations
  const handleAddSize = async () => {
    try {
      const values = await sizeForm.validateFields();
      const newSize = {
        ...values,
        productColorId: selectedColorId,
      };

      await SizeService.createProductSize(newSize);
      message.success("Thêm kích thước thành công");
      loadProductSizes(selectedColorId);
      sizeForm.resetFields();
    } catch (error) {
      message.error("Lỗi khi thêm kích thước");
    }
  };

  const handleToggleSizeStatus = async (sizeId) => {
    try {
      await SizeService.toggleSizeStatus(sizeId);
      message.success("Thay đổi trạng thái kích thước thành công");
      loadProductSizes(selectedColorId);
    } catch (error) {
      if (error.response?.data?.message) {
        message.error(error.response.data.message);
      } else if (typeof error.response?.data === 'string') {
        message.error(error.response.data);
      } else {
        message.error("Lỗi khi thay đổi trạng thái kích thước");
      }
    }
  };

  // Image operations
  const handleAddImage = async () => {
    try {
      const values = await imageForm.validateFields();
      const { imageFile } = values;
      
      const formData = new FormData();
      imageFile.forEach(file => {
        formData.append('imageFiles', file.originFileObj);
      });
      formData.append('productColorId', selectedColorId);

      await ProductColorImageService.addImageToColor(formData);
      message.success("Thêm hình ảnh thành công");
      loadProductColorImages(selectedColorId);
      imageForm.resetFields();
    } catch (error) {
      message.error("Lỗi khi thêm hình ảnh");
    }
  };

  const handleDeleteImage = async (imageId) => {
    try {
      await ProductColorImageService.deleteImageFromColor(imageId);
      message.success("Xóa hình ảnh thành công");
      loadProductColorImages(selectedColorId);
    } catch (error) {
      message.error("Lỗi khi xóa hình ảnh");
    }
  };

  // Table configurations
  const colorColumns = [
    {
      title: 'Hình ảnh',
      dataIndex: 'imageUrl',
      key: 'imageUrl',
      render: (text) => text ? 
        <img src={text} alt="Màu sắc" style={{ width: 50, height: 50 }} /> : 
        'Không có ảnh',
    },
    {
      title: 'Màu sắc',
      dataIndex: 'colorName',
      key: 'colorName',
      render: (text, record) => (
        <Button 
          type="link" 
          onClick={() => handleColorSelect(record.productColorId)}
          style={{ color: selectedColorId === record.productColorId ? '#1890ff' : undefined }}
        >
          {text}
        </Button>
      ),
    },
    {
      title: 'Trạng thái',
      dataIndex: 'isActive',
      key: 'isActive',
      render: (isActive) => (
        <span style={{ color: isActive ? 'green' : 'red' }}>
          {isActive ? 'Hoạt động' : 'Ngừng hoạt động'}
        </span>
      ),
    },
    {
      title: 'Hành động',
      key: 'action',
      render: (_, record) => (
        <Button 
          type="link" 
          icon={<PoweroffOutlined />}
          onClick={() => handleToggleColorStatus(record.productColorId)}
          style={{ color: record.isActive ? '#ff4d4f' : '#52c41a' }}
          title={record.isActive ? 'Ngừng hoạt động' : 'Kích hoạt'}
        >
        </Button>
      ),
    },
  ];

  const sizeColumns = [
    {
      title: 'Kích thước',
      dataIndex: 'sizeValue',
      key: 'sizeValue',
    },
    {
      title: 'Số lượng tồn kho',
      dataIndex: 'stockQuantity',
      key: 'stockQuantity',
    },
    {
      title: 'Trạng thái',
      dataIndex: 'isActive',
      key: 'isActive',
      render: (isActive) => (
        <span style={{ color: isActive ? 'green' : 'red' }}>
          {isActive ? 'Hoạt động' : 'Ngừng hoạt động'}
        </span>
      ),
    },
    {
      title: 'Hành động',
      key: 'action',
      render: (_, record) => (
        <Button 
          type="link" 
          icon={<PoweroffOutlined />}
          onClick={() => handleToggleSizeStatus(record.productSizeId)}
          style={{ color: record.isActive ? '#ff4d4f' : '#52c41a' }}
          title={record.isActive ? 'Ngừng hoạt động' : 'Kích hoạt'}
        >
        </Button>
      ),
    },
  ];

  const imageColumns = [
    {
      title: 'Hình ảnh',
      dataIndex: 'imageUrl',
      key: 'imageUrl',
      render: (text) => (
        <img src={text} alt="Hình ảnh sản phẩm" style={{ width: 50, height: 50 }} />
      ),
    },
    {
      title: 'Hành động',
      key: 'action',
      render: (_, record) => (
        <Button type="link" danger onClick={() => handleDeleteImage(record.productColorImageId)}>
          Xóa
        </Button>
      ),
    },
  ];

  return (
    <Modal
      title={`Quản lý màu và kích thước cho ${product?.productName || ''}`}
      open={visible}
      onCancel={onCancel}
      width={800}
      footer={null}
    >
      {/* Color Management Section */}
      <div style={{ marginBottom: 24 }}>
        <h3>Thêm màu mới</h3>
        <Form form={colorForm} layout="vertical">
          <Form.Item
            name="colorName"
            label="Tên màu"
            rules={[{ required: true, message: 'Vui lòng nhập tên màu!' }]}
          >
            <Input placeholder="Nhập tên màu" />
          </Form.Item>

          <Form.Item
            name="imageFile"
            label="Hình ảnh màu"
            valuePropName="fileList"
            getValueFromEvent={(e) => Array.isArray(e) ? e : e?.fileList}
            rules={[{ required: true, message: 'Vui lòng tải lên hình ảnh!' }]}
          >
            <Upload
              listType="picture"
              beforeUpload={() => false}
              maxCount={1}
            >
              <Button icon={<UploadOutlined />}>Chọn hình ảnh</Button>
            </Upload>
          </Form.Item>

          <Form.Item>
            <Button type="primary" onClick={handleAddColor}>
              Thêm màu
            </Button>
          </Form.Item>
        </Form>

        <Table
          columns={colorColumns}
          dataSource={productColors}
          rowKey="productColorId"
          pagination={false}
        />
      </div>

      {selectedColorId && (
        <>
          {/* Size Management Section */}
          <div style={{ marginBottom: 24 }}>
            <h3>Quản lý kích thước</h3>
            <Form form={sizeForm} layout="vertical">
              <Form.Item
                name="sizeValue"
                label="Kích thước"
                rules={[{ required: true, message: 'Vui lòng nhập kích thước!' }]}
              >
                <Input placeholder="Nhập kích thước" />
              </Form.Item>
              <Form.Item
                name="stockQuantity"
                label="Số lượng tồn kho"
                rules={[{ required: true, message: 'Vui lòng nhập số lượng!' }]}
              >
                <Input type="number" placeholder="Nhập số lượng" />
              </Form.Item>
              <Form.Item>
                <Button type="primary" onClick={handleAddSize}>
                  Thêm kích thước
                </Button>
              </Form.Item>
            </Form>

            <Table
              columns={sizeColumns}
              dataSource={productSizes}
              rowKey="productSizeId"
              pagination={false}
            />
          </div>

          {/* Image Management Section */}
          <div>
            <h3>Quản lý hình ảnh</h3>
            <Form form={imageForm} layout="vertical">
              <Form.Item
                name="imageFile"
                label="Hình ảnh sản phẩm"
                valuePropName="fileList"
                getValueFromEvent={(e) => Array.isArray(e) ? e : e?.fileList}
                rules={[{ required: true, message: 'Vui lòng tải lên hình ảnh!' }]}
              >
                <Upload
                  listType="picture"
                  beforeUpload={() => false}
                  maxCount={10}
                >
                  <Button icon={<UploadOutlined />}>Chọn hình ảnh</Button>
                </Upload>
              </Form.Item>

              <Form.Item>
                <Button type="primary" onClick={handleAddImage}>
                  Thêm hình ảnh
                </Button>
              </Form.Item>
            </Form>

            <Table
              columns={imageColumns}
              dataSource={productColorImages}
              rowKey="productColorImageId"
              pagination={false}
            />
          </div>
        </>
      )}
    </Modal>
  );
};

export default ProductColorModal;