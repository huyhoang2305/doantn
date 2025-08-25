import React from 'react';
import AdminLayout from '../../layouts/AdminLayout'; // Assuming AdminLayout is used for layout consistency
import BrandList from '../../components/admin/BrandList'; // Import the BrandList component

const BrandPage = () => {
  return (
    <AdminLayout>
      <BrandList />
    </AdminLayout>
  );
};

export default BrandPage;
