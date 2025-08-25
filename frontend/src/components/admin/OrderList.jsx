import React, { useEffect, useState } from 'react';
import OrderService from '../../services/admin/OrderService';
import { Table, message, Button, Modal, Descriptions, List, Radio } from 'antd';
import { EyeOutlined, DeleteOutlined } from '@ant-design/icons'; // Import the icon

const OrderList = () => {
  const [orders, setOrders] = useState([]);
  const [filteredOrders, setFilteredOrders] = useState([]);
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [selectedOrder, setSelectedOrder] = useState(null);
  const [orderItems, setOrderItems] = useState([]); // To hold the order items
  const [filter, setFilter] = useState('all'); // To manage filter state (now using radio)
  const [isDeleteModalVisible, setIsDeleteModalVisible] = useState(false); // State to handle delete confirmation

  useEffect(() => {
    loadOrders();
  }, []);

  useEffect(() => {
    // Filter orders based on selected filter
    filterOrders();
  }, [filter, orders]);

  const loadOrders = () => {
    OrderService.getAllOrders()
      .then((response) => {
        setOrders(response);
      })
      .catch(() => {
        message.error("Lỗi khi tải đơn hàng");
      });
  };

  // Filter orders based on the selected filter
  const filterOrders = () => {
    let filtered;
    if (filter === 'guest') {
      filtered = orders.filter((order) => order.guestName); // Only guest orders
    } else if (filter === 'customer') {
      filtered = orders.filter((order) => order.customerName); // Only customer orders
    } else {
      filtered = orders; // All orders
    }
    setFilteredOrders(filtered);
  };

  // Define the columns based on OrderResponse properties
  const columns = [
    {
      title: 'ID',
      dataIndex: 'orderId',
      key: 'orderId',
    },
    {
      title: 'Tổng giá',
      dataIndex: 'totalPrice',
      key: 'totalPrice',
      render: (totalPrice) => `${totalPrice.toLocaleString()} VND`, // Format as currency
    },
    {
      title: 'Tên khách (khách mời)',
      dataIndex: 'guestName',
      key: 'guestName',
    },
    {
      title: 'Tên khách hàng',
      dataIndex: 'customerName',
      key: 'customerName',
    },
    {
      title: 'Hành động',
      key: 'action',
      render: (text, record) => (
        <div>
          <Button 
            type="link" // Outline style
            icon={<EyeOutlined />} // Add the icon
            onClick={() => handleViewDetails(record)} // Open the view details modal
          />
          <Button
            type="link"
            danger
            icon={<DeleteOutlined />} // Delete icon
            onClick={() => handleDeleteOrder(record)} // Trigger delete function
          />
        </div>
      ),
    },
  ];

  const handleViewDetails = (order) => {
    setSelectedOrder(order);
    // Fetch the order items by orderId
    OrderService.getOrderItemsByOrderId(order.orderId)
      .then((items) => {
        setOrderItems(items);
      })
      .catch(() => {
        message.error("Lỗi khi tải chi tiết đơn hàng");
      });
    setIsModalVisible(true);
  };

  const handleCancel = () => {
    setIsModalVisible(false);
    setSelectedOrder(null);
    setOrderItems([]); // Reset order items when closing modal
  };

  const handleFilterChange = (e) => {
    setFilter(e.target.value);
  };

  // Delete order function
  const handleDeleteOrder = (order) => {
    setIsDeleteModalVisible(true);
    setSelectedOrder(order); // Store the order object for deletion
  };

  const confirmDeleteOrder = () => {
    if (selectedOrder) {
      OrderService.deleteOrder(selectedOrder.orderId)
        .then(() => {
          message.success('Đơn hàng đã được xóa');
          loadOrders(); // Reload orders after deletion
        })
        .catch(() => {
          message.error("Lỗi khi xóa đơn hàng");
        })
        .finally(() => {
          setIsDeleteModalVisible(false); // Close the delete modal
          setSelectedOrder(null); // Clear selected order
        });
    }
  };

  const handleDeleteCancel = () => {
    setIsDeleteModalVisible(false); // Close the delete confirmation modal
    setSelectedOrder(null); // Clear selected order
  };

  return (
    <div>
      {/* Filter Section */}
      <div style={{ marginBottom: 16 }}>
        <Radio.Group value={filter} onChange={handleFilterChange}>
          <Radio value="all">Tất cả</Radio>
          <Radio value="guest">Chỉ khách mời</Radio>
          <Radio value="customer">Chỉ khách hàng</Radio>
        </Radio.Group>
      </div>

      {/* Table */}
      <Table 
        dataSource={filteredOrders} 
        columns={columns} 
        rowKey="orderId" 
        pagination={{ pageSize: 8 }} 
      />

      {/* Modal for order details */}
      <Modal
        title={`Chi tiết đơn hàng: ${selectedOrder?.orderId}`}
        visible={isModalVisible}
        onCancel={handleCancel}
        footer={null}
        width={800}
      >
        {selectedOrder && (
          <>
            <Descriptions bordered column={2}>
              <Descriptions.Item label="ID đơn hàng">{selectedOrder.orderId}</Descriptions.Item>
              <Descriptions.Item label="Ghi chú">{selectedOrder.orderNote || 'Không có'}</Descriptions.Item>
              <Descriptions.Item label="Phương thức thanh toán">{selectedOrder.paymentMethod}</Descriptions.Item>
              <Descriptions.Item label="Tổng giá">{`${selectedOrder.totalPrice.toLocaleString()} VND`}</Descriptions.Item>
              <Descriptions.Item label="Trạng thái đơn hàng">{selectedOrder.orderStatus}</Descriptions.Item>
              <Descriptions.Item label="Trạng thái thanh toán">{selectedOrder.isPaid ? 'Đã thanh toán' : 'Chưa thanh toán'}</Descriptions.Item>
              <Descriptions.Item label="Tên khách">{selectedOrder.guestName || 'Khách hàng đăng ký'}</Descriptions.Item>
              <Descriptions.Item label="Tên khách hàng">{selectedOrder.customerName || 'Khách hàng chưa đăng ký'}</Descriptions.Item>
            </Descriptions>

            <h3>Danh sách sản phẩm trong đơn hàng</h3>
            <List
              itemLayout="horizontal"
              dataSource={orderItems}
              renderItem={(item) => (
                <List.Item>
                  <List.Item.Meta
                    title={`${item.productName} (${item.colorName}, ${item.sizeValue})`}
                    description={`Số lượng: ${item.quantity} - Giá: ${item.unitPrice.toLocaleString()} VND`}
                  />
                </List.Item>
              )}
            />
          </>
        )}
      </Modal>

      {/* Delete Confirmation Modal */}
      <Modal
        title="Xóa đơn hàng"
        visible={isDeleteModalVisible}
        onOk={confirmDeleteOrder}
        onCancel={handleDeleteCancel}
        okText="Xóa"
        cancelText="Hủy"
      >
        <p>Bạn có chắc chắn muốn xóa đơn hàng này không?</p>
      </Modal>
    </div>
  );
};

export default OrderList;
