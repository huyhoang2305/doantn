import React from 'react';
import AdminLayout from '../../layouts/AdminLayout';  // Assuming AdminLayout is used for layout consistency
import BannerList from '../../components/admin/BannerList';  // Reuse the BannerList component

const BannerPage = () => {
  return (
    <AdminLayout>
        <BannerList />
    </AdminLayout>
  );
};

export default BannerPage;
