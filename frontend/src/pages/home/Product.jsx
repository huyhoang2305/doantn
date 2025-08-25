import React, { useState, useEffect } from 'react';
import { Row, Col, Spin } from 'antd';
import CustomerLayout from '../../layouts/CustomerLayout';
import SearchBar from '../../components/product/SearchBar';
import PriceFilter from '../../components/product/PriceFilter';
import SubCategoryFilter from '../../components/product/SubCategoryFilter';
import ProductCard from '../../components/home/ProductCard';
import { getSubCategories, getAllProducts } from '../../services/home/HomeService';

const styles = {
    container: {
        padding: '20px',
    },
    sidebar: {
        position: 'sticky',
        top: '140px',
    },
    productsContainer: {
        display: 'grid',
        gap: '24px',
        gridTemplateColumns: 'repeat(auto-fill, minmax(250px, 1fr))',
    },
    spinner: {
        display: 'flex',
        justifyContent: 'center',
        padding: '40px',
    }
};

const Product = () => {
    const [products, setProducts] = useState([]);
    const [subCategories, setSubCategories] = useState([]);
    const [loading, setLoading] = useState(true);
    const [searchQuery, setSearchQuery] = useState('');
    const [selectedSubCategories, setSelectedSubCategories] = useState([]);
    const [priceRange, setPriceRange] = useState([0, 10000000]);

    useEffect(() => {
        const fetchData = async () => {
            setLoading(true);
            try {
                const [fetchedCategories, fetchedProducts] = await Promise.all([
                    getSubCategories(null, null),
                    getAllProducts(null, null, null)
                ]);
                // Filter for active subcategories and products
                const activeCategories = fetchedCategories.filter(category => category.isActive === true);
                const activeProducts = fetchedProducts.filter(product => 
                    product.imageUrl && product.isActive === true
                );
                setSubCategories(activeCategories);
                setProducts(activeProducts);
            } catch (error) {
                console.error('Error fetching data:', error);
            } finally {
                setLoading(false);
            }
        };

        fetchData();
    }, []);

    const filteredProducts = products.filter(product => {
        const matchesSearch = product.productName.toLowerCase()
            .includes(searchQuery.toLowerCase());
        const matchesCategory = selectedSubCategories.length === 0 || 
            selectedSubCategories.includes(product.subCategoryId);
        const matchesPrice = product.unitPrice >= priceRange[0] && 
            product.unitPrice <= priceRange[1];

        return matchesSearch && matchesCategory && matchesPrice;
    });

    if (loading) {
        return (
            <CustomerLayout>
                <div style={styles.spinner}>
                    <Spin size="large" />
                </div>
            </CustomerLayout>
        );
    }

    return (
        <CustomerLayout>
            <div style={styles.container}>
                <Row gutter={[24, 24]}>
                    <Col xs={24} sm={24} md={6}>
                        <div style={styles.sidebar}>
                            <SearchBar onSearch={setSearchQuery} />
                            <SubCategoryFilter
                                subCategories={subCategories}
                                selectedSubCategories={selectedSubCategories}
                                onSubCategoryChange={setSelectedSubCategories}
                            />
                            <PriceFilter onPriceChange={setPriceRange} />
                        </div>
                    </Col>
                    <Col xs={24} sm={24} md={18}>
                        <div style={styles.productsContainer}>
                            {filteredProducts.map(product => (
                                <ProductCard key={product.productId} product={product} />
                            ))}
                        </div>
                    </Col>
                </Row>
            </div>
        </CustomerLayout>
    );
};

export default Product;