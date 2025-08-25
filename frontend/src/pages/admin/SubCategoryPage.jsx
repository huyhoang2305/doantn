import React from 'react';
import AdminLayout from '../../layouts/AdminLayout'; 
import SubCategoryList from '../../components/admin/SubCategoryList'; // Import the SubCategoryList component

const SubCategoryPage = () => {
  return (
    <AdminLayout>
        <SubCategoryList />  {/* Use SubCategoryList component */}
    </AdminLayout>
  );
};

export default SubCategoryPage;
