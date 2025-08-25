import React from 'react';
import AdminLayout from '../../layouts/AdminLayout'; 
import CategoryList from '../../components/admin/CategoryList'; 

const CategoryPage = () => {
  return (
    <AdminLayout>
        <CategoryList />
    </AdminLayout>
  );
};

export default CategoryPage;
