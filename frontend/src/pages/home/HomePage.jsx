import React, { useEffect, useState } from 'react';
import { Typography, Spin } from 'antd';
import CustomerLayout from '../../layouts/CustomerLayout';
import Banner from '../../components/home/Banner';
import ProductList from '../../components/home/ProductList';
import { getSubCategories, getAllProducts } from '../../services/home/HomeService';

const { Title } = Typography;

const styles = {
    container: {
        padding: '20px 0',
    },
    error: {
        padding: '20px',
        textAlign: 'center',
        color: '#ff4d4f',
        background: '#fff2f0',
        borderRadius: '8px',
        marginTop: '20px',
    },
    spinner: {
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        minHeight: '200px',
    }
};

const HomePage = () => {
    const [subCategories, setSubCategories] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [productsMap, setProductsMap] = useState({});

    useEffect(() => {
        const fetchData = async () => {
            setLoading(true);
            try {
                const allSubCategories = await getSubCategories(null, null);
                
                // Fetch products for each subcategory
                const productsData = {};
                await Promise.all(
                    allSubCategories.map(async (subCategory) => {
                        const products = await getAllProducts(subCategory.subCategoryId, null, null);
                        // Filter for active products with images
                        const validProducts = products.filter(product => 
                            product.imageUrl && product.isActive === true
                        );
                        if (validProducts.length > 0) {
                            productsData[subCategory.subCategoryId] = validProducts;
                        }
                    })
                );
                
                setProductsMap(productsData);
                setSubCategories(allSubCategories);
            } catch (err) {
                setError("Không thể tải dữ liệu.");
                console.error(err);
            } finally {
                setLoading(false);
            }
        };

        fetchData();
    }, []);

    if (loading) {
        return (
            <CustomerLayout>
                <div style={styles.spinner}>
                    <Spin size="large" />
                </div>
            </CustomerLayout>
        );
    }

    if (error) {
        return (
            <CustomerLayout>
                <div style={styles.error}>{error}</div>
            </CustomerLayout>
        );
    }

    const subCategoriesWithProducts = subCategories.filter(
        subCategory => productsMap[subCategory.subCategoryId]
    );

    return (
        <CustomerLayout>
            <div style={styles.container}>
                <Banner />
                {subCategoriesWithProducts.map((subCategory) => (
                    <ProductList 
                        key={subCategory.subCategoryId}
                        subCategoryId={subCategory.subCategoryId}
                        subCategoryName={subCategory.subCategoryName}
                        products={productsMap[subCategory.subCategoryId]}
                    />
                ))}
            </div>
        </CustomerLayout>
    );
};

export default HomePage;