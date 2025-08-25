import React from 'react';
import AdminLayout from '../../layouts/AdminLayout'; 
import ProductList from '../../components/admin/ProductList'; // Import the ProductList component

const ProductPage = () => {
  return (
    <AdminLayout>
        <ProductList />  {/* Use ProductList component */}
    </AdminLayout>
  );
};

export default ProductPage;
