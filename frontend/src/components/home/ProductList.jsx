import React from 'react';
import { Row, Col, Typography } from 'antd';
import ProductCard from './ProductCard';

const { Title } = Typography;

const styles = {
    container: {
        marginBottom: '40px',
        background: '#fff',
        padding: '24px',
        borderRadius: '12px',
        boxShadow: '0 2px 8px rgba(0,0,0,0.06)',
    },
    title: {
        marginBottom: '24px',
        position: 'relative',
        paddingBottom: '12px',
        color: '#001529',
    },
    titleUnderline: {
        content: '""',
        position: 'absolute',
        bottom: 0,
        left: 0,
        width: '60px',
        height: '3px',
        background: 'linear-gradient(90deg, #001529 0%, #003a70 100%)',
        borderRadius: '2px',
    },
    productsGrid: {
        marginTop: '20px',
    },
};

const ProductList = ({ subCategoryName, products }) => {
    return (
        <div style={styles.container}>
            <Title level={4} style={styles.title}>
                {subCategoryName}
                <div style={styles.titleUnderline} />
            </Title>
            <Row gutter={[24, 24]} style={styles.productsGrid}>
                {products.map((product) => (
                    <Col xs={24} sm={12} md={8} lg={8} xl={6} key={product.productId}>
                        <ProductCard product={product} />
                    </Col>
                ))}
            </Row>
        </div>
    );
};

export default ProductList;