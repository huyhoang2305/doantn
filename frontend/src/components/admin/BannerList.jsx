import React, { useState, useEffect } from 'react';
import { Table, Button, message, Image, Modal, Form, Input, Switch } from 'antd';
import { EditOutlined, PoweroffOutlined } from '@ant-design/icons';
import BannerService from '../../services/admin/BannerService';

const BannerList = () => {
  const [banners, setBanners] = useState([]);
  const [loading, setLoading] = useState(false);
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [currentBanner, setCurrentBanner] = useState(null);
  const [form] = Form.useForm();
  const [imageFile, setImageFile] = useState(null); // State for the file input
  const [loadingButton, setLoadingButton] = useState(false); // State for loading button actions

  useEffect(() => {
    loadBanners();
  }, []);

  const loadBanners = () => {
    setLoading(true);
    BannerService.getAllBanners()
      .then((response) => {
        setBanners(response);
      })
      .catch(() => {
        message.error('Lỗi khi tải danh sách banner');
      })
      .finally(() => {
        setLoading(false);
      });
  };

  const handleToggleStatus = (id) => {
    BannerService.toggleBannerStatus(id)
      .then(() => {
        message.success("Thay đổi trạng thái banner thành công");
        loadBanners();
      })
      .catch((error) => {
        if (error.response && error.response.data) {
          message.error(error.response.data);
        } else {
          message.error("Lỗi khi thay đổi trạng thái banner");
        }
      });
  };

  const showModal = (banner) => {
    setCurrentBanner(banner);
    form.setFieldsValue(banner);
    setIsModalVisible(true);
    setImageFile(null); // Reset the file input when opening the modal
  };

  const handleOk = () => {
    form
      .validateFields()
      .then((values) => {
        const data = { ...values, imageFile }; // Include the file in the request
        setLoadingButton(true); // Set loading state for the button
        if (currentBanner) {
          // Update existing banner
          BannerService.updateBanner(currentBanner.bannerId, data)
            .then(() => {
              message.success('Cập nhật banner thành công');
              setIsModalVisible(false);
              loadBanners();
            })
            .catch(() => {
              message.error('Lỗi khi cập nhật banner');
            })
            .finally(() => {
              setLoadingButton(false); // Reset loading state for the button
            });
        } else {
          // Create new banner
          BannerService.createBanner(data)
            .then(() => {
              message.success('Tạo banner thành công');
              setIsModalVisible(false);
              loadBanners();
            })
            .catch(() => {
              message.error('Lỗi khi tạo banner');
            })
            .finally(() => {
              setLoadingButton(false); // Reset loading state for the button
            });
        }
      })
      .catch((errorInfo) => {
        console.log('Failed:', errorInfo);
      });
  };

  const handleCancel = () => {
    setIsModalVisible(false);
    setCurrentBanner(null);
    form.resetFields();
    setImageFile(null); // Reset the image file
  };

  const handleFileChange = (e) => {
    setImageFile(e.target.files[0]); // Store the file
  };

  const columns = [
    {
      title: 'ID',
      dataIndex: 'bannerId',
      key: 'bannerId',
    },
    {
      title: 'Tiêu đề',
      dataIndex: 'title',
      key: 'title',
    },
    {
      title: 'Liên kết',
      dataIndex: 'link',
      key: 'link',
    },
    {
      title: 'Hình ảnh',
      dataIndex: 'imageUrl',
      key: 'imageUrl',
      render: (imageUrl) => (
        <Image
          width={150}
          src={imageUrl}
          alt="Hình ảnh banner"
          placeholder={<Image preview={false} src="loading.gif" />}
        />
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
      key: 'actions',
      render: (text, record) => (
        <span>
          <Button
            type="link"
            icon={<EditOutlined />}
            onClick={() => showModal(record)}
          >
          </Button>
          <Button 
            type="link" 
            icon={<PoweroffOutlined />}
            onClick={() => handleToggleStatus(record.bannerId)}
            style={{ color: record.isActive ? '#ff4d4f' : '#52c41a' }}
            title={record.isActive ? 'Ngừng hoạt động' : 'Kích hoạt'}
          >
          </Button>
        </span>
      ),
    },
  ];
  
  return (
    <>
      <Button type="primary" onClick={() => showModal(null)} style={{ marginBottom: 16 }}>
        Thêm Banner
      </Button>
      <Table
        dataSource={banners}
        columns={columns}
        rowKey="bannerId"
        loading={loading}
        pagination={{ pageSize: 8 }} 
      />
      <Modal
        title={currentBanner ? 'Chỉnh sửa Banner' : 'Thêm Banner'}
        visible={isModalVisible}
        onOk={handleOk}
        onCancel={handleCancel}
        confirmLoading={loadingButton} // Show loading state on OK button
      >
        <Form form={form} layout="vertical">
          <Form.Item
            name="title"
            label="Tiêu đề"
            rules={[{ required: true, message: 'Vui lòng nhập tiêu đề!' }]}
          >
            <Input />
          </Form.Item>
          <Form.Item
            name="link"
            label="Liên kết"
            rules={[{ required: true, message: 'Vui lòng nhập liên kết!' }]}
          >
            <Input />
          </Form.Item>
          <Form.Item label="Hình ảnh">
            <Input type="file" accept="image/*" onChange={handleFileChange} />
            {imageFile && <p style={{ marginTop: 10 }}>Selected file: {imageFile.name}</p>} {/* Show selected file name */}
          </Form.Item>
          <Form.Item
            name="isActive"
            label="Hiển thị"
            valuePropName="checked"
          >
            <Switch checked={form.getFieldValue('isActive')} onChange={(checked) => form.setFieldsValue({ isActive: checked })} />
          </Form.Item>
        </Form>
      </Modal>
    </>
  );
};

export default BannerList;
