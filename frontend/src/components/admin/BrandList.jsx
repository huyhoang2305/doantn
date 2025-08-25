import React, { useEffect, useState } from "react";
import { Table, Button, message, Modal, Form, Input, Tag } from "antd";
import { EditOutlined, PoweroffOutlined } from "@ant-design/icons"; // Import icons
import BrandService from "../../services/admin/BrandService"; // Import the BrandService

const BrandList = () => {
  const [brands, setBrands] = useState([]);
  const [loading, setLoading] = useState(false);
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [currentBrand, setCurrentBrand] = useState(null);
  const [form] = Form.useForm();
  const [imageFile, setImageFile] = useState(null);
  const [loadingButton, setLoadingButton] = useState(false);

  useEffect(() => {
    fetchBrands();
  }, []);

  const fetchBrands = async () => {
    setLoading(true);
    try {
      const response = await BrandService.getAllBrands();
      setBrands(response);
    } catch (error) {
      message.error("Lỗi khi tải danh sách thương hiệu");
    } finally {
      setLoading(false);
    }
  };

  const handleToggleStatus = async (id) => {
    try {
      await BrandService.toggleBrandStatus(id);
      message.success("Cập nhật trạng thái thương hiệu thành công");
      fetchBrands();
    } catch (error) {
      console.error("Error toggling brand status:", error);
      
      // Since BaseService interceptor already extracts error.response.data
      // The error here is already the message string
      let errorMessage = "Lỗi khi cập nhật trạng thái thương hiệu";
      
      if (typeof error === 'string') {
        errorMessage = error;
      } else if (error && error.message) {
        errorMessage = error.message;
      }
      
      message.error(errorMessage);
    }
  };

  const showModal = (brand) => {
    setCurrentBrand(brand);
    form.setFieldsValue(brand);
    setIsModalVisible(true);
    setImageFile(null); // Reset the file input when opening the modal
  };

  const handleOk = async () => {
    try {
      const values = await form.validateFields();
      const data = { ...values }; // Create a base data object
      setLoadingButton(true); // Set loading state for the button

      if (imageFile) {
        data.imageFile = imageFile; // Include the file only if it exists
      }

      if (currentBrand) {
        // Update existing brand
        await BrandService.updateBrand(currentBrand.brandId, data);
        message.success("Cập nhật thương hiệu thành công");
      } else {
        // Create new brand
        await BrandService.createBrand(data);
        message.success("Tạo thương hiệu thành công");
      }
      setIsModalVisible(false);
      fetchBrands();
    } catch (errorInfo) {
      console.log("Failed:", errorInfo);
    } finally {
      setLoadingButton(false); // Reset loading state for the button
    }
  };

  const handleCancel = () => {
    setIsModalVisible(false);
    setCurrentBrand(null);
    form.resetFields();
    setImageFile(null); // Reset the image file
  };

  const handleFileChange = (e) => {
    const file = e.target.files[0]; // Store the selected file
    if (file) {
      setImageFile(file); // Update state with the file
    }
  };

  const columns = [
    {
      title: "ID",
      dataIndex: "brandId", // Match the API response
      key: "brandId",
    },
    {
      title: "Tên Thương Hiệu",
      dataIndex: "brandName", // Match the API response
      key: "brandName",
    },
    {
      title: "Hình Ảnh",
      dataIndex: "imageUrl", // Match the API response
      key: "imageUrl",
      render: (imageUrl) => (
        <img
          width={150}
          src={imageUrl}
          alt="Hình ảnh thương hiệu"
          style={{ objectFit: "cover" }}
        />
      ),
    },
    {
      title: "Trạng thái",
      dataIndex: "isActive",
      key: "isActive",
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
      title: "Hành động",
      key: "actions",
      render: (text, record) => (
        <span>
          <Button
            type="link"
            icon={<EditOutlined />} // Using edit icon
            onClick={() => showModal(record)}
          />
          <Button
            type="link"
            icon={<PoweroffOutlined />}
            onClick={() => handleToggleStatus(record.brandId)}
            title={record.isActive ? "Ngừng hoạt động" : "Kích hoạt"}
            style={{ color: record.isActive ? '#ff4d4f' : '#52c41a' }}
          />
        </span>
      ),
    },
  ];

  return (
    <>
      <Button
        type="primary"
        onClick={() => showModal(null)}
        style={{ marginBottom: 16 }}
      >
        Thêm Thương Hiệu
      </Button>
      <Table
        dataSource={brands}
        columns={columns}
        rowKey="brandId" // Match the API response
        loading={loading}
        pagination={{ pageSize: 8 }} 
      />
      <Modal
        title={currentBrand ? "Chỉnh sửa Thương Hiệu" : "Thêm Thương Hiệu"}
        visible={isModalVisible}
        onOk={handleOk}
        onCancel={handleCancel}
        confirmLoading={loadingButton} // Show loading state on OK button
      >
        <Form form={form} layout="vertical">
          <Form.Item
            name="brandName"
            label="Tên Thương Hiệu"
            rules={[{ required: true, message: "Vui lòng nhập tên thương hiệu!" }]}
          >
            <Input />
          </Form.Item>
          <Form.Item label="Hình Ảnh">
            <Input type="file" accept="image/*" onChange={handleFileChange} />
            {imageFile && <p style={{ marginTop: 10 }}>Tệp đã chọn: {imageFile.name}</p>}
          </Form.Item>
        </Form>
      </Modal>
    </>
  );
};

export default BrandList;
