import React from 'react';
import { Checkbox, Typography, Space } from 'antd';

const { Title } = Typography;

const styles = {
    container: {
        marginBottom: '24px',
        padding: '16px',
        background: '#fff',
        borderRadius: '8px',
        boxShadow: '0 2px 8px rgba(0,0,0,0.06)',
    },
    title: {
        marginBottom: '16px',
        fontSize: '16px',
        fontWeight: 'bold',
    },
    checkboxGroup: {
        display: 'flex',
        flexDirection: 'column',
        gap: '8px',
    }
};

const SubCategoryFilter = ({ subCategories, selectedSubCategories, onSubCategoryChange }) => {
    return (
        <div style={styles.container}>
            <Title level={5} style={styles.title}>Danh Mục</Title>
            <Checkbox.Group 
                value={selectedSubCategories}
                onChange={onSubCategoryChange}
                style={styles.checkboxGroup}
            >
                <Space direction="vertical">
                    {subCategories.map(category => (
                        <Checkbox 
                            key={category.subCategoryId} 
                            value={category.subCategoryId}
                        >
                            {category.subCategoryName}
                        </Checkbox>
                    ))}
                </Space>
            </Checkbox.Group>
        </div>
    );
};

export default SubCategoryFilter;