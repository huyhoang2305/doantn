import React, { useState, useEffect } from 'react';
import CategoryService from '../../services/admin/CategoryService';
import { Table, Button, message, Modal, Form, Input } from 'antd';
import { EditOutlined, PoweroffOutlined } from '@ant-design/icons';

const CategoryList = () => {
  const [categories, setCategories] = useState([]);
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [editingCategory, setEditingCategory] = useState(null);
  const [form] = Form.useForm();

  useEffect(() => {
    loadCategories();
  }, []);

  const loadCategories = () => {
    CategoryService.getAllCategories()
      .then((response) => {
        setCategories(response);
      })
      .catch(() => {
        message.error("Lỗi khi tải danh mục");
      });
  };

  const handleToggleStatus = (id) => {
    CategoryService.toggleCategoryStatus(id)
      .then(() => {
        message.success("Thay đổi trạng thái danh mục thành công");
        loadCategories();
      })
      .catch((error) => {
        console.log('Error object:', error);
        console.log('Error response:', error.response);
        console.log('Error response data:', error.response?.data);
        
        if (error.response?.data) {
          // Nếu server trả về ErrorResponse object có message
          if (error.response.data.message) {
            message.error(error.response.data.message);
          }
          // Nếu server trả về string trực tiếp
          else if (typeof error.response.data === 'string') {
            message.error(error.response.data);
          }
          // Fallback
          else {
            message.error("Lỗi khi thay đổi trạng thái danh mục");
          }
        } else {
          message.error("Lỗi khi thay đổi trạng thái danh mục");
        }
      });
  };

  const handleAdd = () => {
    setEditingCategory(null);
    setIsModalVisible(true);
  };

  const handleEdit = (category) => {
    setEditingCategory(category);
    form.setFieldsValue({ categoryName: category.categoryName });
    setIsModalVisible(true);
  };

  const handleCancel = () => {
    setIsModalVisible(false);
    form.resetFields();
  };

  const handleOk = () => {
    form
      .validateFields()
      .then((values) => {
        if (editingCategory) {
          // Cập nhật danh mục
          CategoryService.updateCategory(editingCategory.categoryId, values)
            .then(() => {
              message.success("Cập nhật danh mục thành công");
              loadCategories();
            })
            .catch(() => {
              message.error("Tên danh mục đã tồn tại ở danh mục khác");
            });
        } else {
          // Tạo danh mục mới
          CategoryService.createCategory(values)
            .then(() => {
              message.success("Tạo danh mục mới thành công");
              loadCategories();
            })
            .catch(() => {
              message.error("Tên danh mục đã tồn tại");
            });
        }
        setIsModalVisible(false);
        form.resetFields();
      })
      .catch(() => {
        message.error("Vui lòng điền đầy đủ thông tin");
      });
  };

  const columns = [
    {
      title: 'ID',
      dataIndex: 'categoryId',
      key: 'categoryId',
    },
    {
      title: 'Tên danh mục',
      dataIndex: 'categoryName',
      key: 'categoryName',
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
      title: 'Thao tác',
      render: (text, record) => (
        <span>
          <Button type="link" icon={<EditOutlined />} onClick={() => handleEdit(record)} />
          <Button 
            type="link" 
            icon={<PoweroffOutlined />}
            onClick={() => handleToggleStatus(record.categoryId)}
            style={{ color: record.isActive ? '#ff4d4f' : '#52c41a' }}
            title={record.isActive ? 'Ngừng hoạt động' : 'Kích hoạt'}
          >
          </Button>
        </span>
      ),
      key: 'actions',
    },
  ];

  return (
    <div>
      <Button type="primary" onClick={handleAdd} style={{ marginBottom: '20px' }}>
        Thêm danh mục
      </Button>
      <Table dataSource={categories} columns={columns} rowKey="categoryId" pagination={{ pageSize: 8 }} />

      {/* Modal để thêm/sửa danh mục */}
      <Modal
        title={editingCategory ? "Sửa danh mục" : "Thêm danh mục"}
        visible={isModalVisible}
        onOk={handleOk}
        onCancel={handleCancel}
      >
        <Form form={form} layout="vertical">
          <Form.Item
            label="Tên danh mục"
            name="categoryName"
            rules={[{ required: true, message: 'Vui lòng nhập tên danh mục' }]}
          >
            <Input placeholder="Nhập tên danh mục" />
          </Form.Item>
        </Form>
      </Modal>
    </div>
  );
};

export default CategoryList;
