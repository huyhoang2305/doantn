// src/pages/admin/OrderPage.js
import React from 'react';
import AdminLayout from '../../layouts/AdminLayout';
import OrderList from '../../components/admin/OrderList';

const OrderPage = () => {
  return (
    <AdminLayout>
      <OrderList />
    </AdminLayout>
  );
};

export default OrderPage;
