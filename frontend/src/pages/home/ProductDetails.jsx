import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import {
    getProductById,
    getProductColorsByProductId,
    getSizesByProductColorId,
    getImagesByProductColorId,
} from '../../services/home/HomeService';
import { 
    Spin, 
    Typography, 
    Button, 
    Row, 
    Col, 
    Carousel, 
    message,
    Tag,
    Divider,
    InputNumber
} from 'antd';
import { 
    ShoppingCartOutlined, 
    HeartOutlined,
    CheckCircleOutlined
} from '@ant-design/icons';
import CustomerLayout from '../../layouts/CustomerLayout';

const { Title, Text } = Typography;

const styles = {
    container: {
        padding: '24px',
        background: '#fff',
        borderRadius: '12px',
        boxShadow: '0 2px 8px rgba(0,0,0,0.06)',
    },
    carousel: {
        borderRadius: '12px',
        overflow: 'hidden',
        boxShadow: '0 4px 12px rgba(0,0,0,0.1)',
    },
    carouselImage: {
        width: '100%',
        height: '500px',
        objectFit: 'cover',
        borderRadius: '12px',
    },
    productInfo: {
        padding: '0 24px',
    },
    title: {
        fontSize: '28px',
        marginBottom: '16px',
        color: '#001529',
    },
    price: {
        fontSize: '24px',
        color: '#f50',
        fontWeight: 'bold',
        marginBottom: '24px',
    },
    section: {
        marginBottom: '24px',
    },
    sectionTitle: {
        fontSize: '16px',
        fontWeight: 'bold',
        marginBottom: '12px',
        color: '#001529',
    },
    colorButton: {
        height: '40px',
        minWidth: '40px',
        margin: '0 8px 8px 0',
        borderRadius: '8px',
        border: '2px solid transparent',
        transition: 'all 0.3s ease',
    },
    colorButtonSelected: {
        transform: 'scale(1.1)',
        boxShadow: '0 2px 8px rgba(0,0,0,0.15)',
    },
    sizeButton: {
        height: '40px',
        minWidth: '60px',
        margin: '0 8px 8px 0',
        borderRadius: '8px',
        transition: 'all 0.3s ease',
    },
    sizeButtonSelected: {
        background: '#001529',
        color: '#fff',
        transform: 'scale(1.1)',
    },
    addToCartButton: {
        height: '48px',
        fontSize: '16px',
        width: '100%',
        background: 'linear-gradient(135deg, #001529 0%, #003a70 100%)',
        border: 'none',
        borderRadius: '8px',
        marginTop: '24px',
    },
    stockInfo: {
        display: 'flex',
        alignItems: 'center',
        marginTop: '12px',
        color: '#52c41a',
    },
    stockIcon: {
        marginRight: '8px',
    },
    quantityContainer: {
        display: 'flex',
        alignItems: 'center',
        marginTop: '16px',
    },
    quantityLabel: {
        marginRight: '16px',
        color: '#001529',
        fontWeight: 'bold',
    },
    spinner: {
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        minHeight: '400px',
    },
    error: {
        textAlign: 'center',
        padding: '40px',
        color: '#ff4d4f',
        background: '#fff2f0',
        borderRadius: '8px',
    },
};

const ProductDetails = () => {
    const { productId } = useParams();
    const [productDetails, setProductDetails] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [colors, setColors] = useState([]);
    const [selectedColorId, setSelectedColorId] = useState(null);
    const [sizes, setSizes] = useState([]);
    const [images, setImages] = useState([]);
    const [selectedSizeId, setSelectedSizeId] = useState(null);
    const [quantity, setQuantity] = useState(1);

    useEffect(() => {
        const fetchProductDetails = async () => {
            setLoading(true);
            try {
                const product = await getProductById(productId);
                
                // Check if product is active
                if (!product.isActive) {
                    setError("Sản phẩm này hiện không khả dụng.");
                    return;
                }
                
                setProductDetails(product);

                const productColors = await getProductColorsByProductId(productId);
                // Filter for active colors only
                const activeColors = productColors.filter(color => color.isActive === true);
                setColors(activeColors);

                if (activeColors && activeColors.length > 0) {
                    setSelectedColorId(activeColors[0].productColorId);
                } else {
                    setError("Sản phẩm này hiện không có màu sắc khả dụng.");
                }
            } catch (err) {
                setError("Không thể tải thông tin sản phẩm.");
                console.error(err);
            } finally {
                setLoading(false);
            }
        };

        fetchProductDetails();
    }, [productId]);

    useEffect(() => {
        const fetchColorDetails = async () => {
            if (selectedColorId) {
                try {
                    const [fetchedSizes, fetchedImages] = await Promise.all([
                        getSizesByProductColorId(selectedColorId),
                        getImagesByProductColorId(selectedColorId)
                    ]);
                    // Filter for active sizes only
                    const activeSizes = fetchedSizes.filter(size => size.isActive === true);
                    setSizes(activeSizes);
                    setImages(fetchedImages);
                    setSelectedSizeId(null); // Reset size selection when color changes
                } catch (err) {
                    console.error(err);
                }
            }
        };

        fetchColorDetails();
    }, [selectedColorId]);

    const handleAddToCart = () => {
        if (!selectedSizeId) {
            message.error('Vui lòng chọn kích cỡ.');
            return;
        }

        const cartItem = {
            productId,
            productName: productDetails.productName,
            colorId: selectedColorId,
            sizeId: selectedSizeId,
            quantity,
            unitPrice: productDetails.unitPrice,
        };

        const cart = JSON.parse(localStorage.getItem('cart')) || [];
        cart.push(cartItem);
        localStorage.setItem('cart', JSON.stringify(cart));
        
        message.success({
            content: 'Đã thêm sản phẩm vào giỏ hàng!',
            icon: <ShoppingCartOutlined />
        });
    };

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

    if (!productDetails) {
        return (
            <CustomerLayout>
                <div style={styles.error}>Không có thông tin sản phẩm.</div>
            </CustomerLayout>
        );
    }

    const selectedSize = sizes.find(size => size.productSizeId === selectedSizeId);

    return (
        <CustomerLayout>
            <div style={styles.container}>
                <Row gutter={[32, 32]}>
                    <Col xs={24} md={12}>
                        <div style={styles.carousel}>
                            <Carousel autoplay>
                                {images.map(image => (
                                    <div key={image.productColorImageId}>
                                        <img
                                            src={image.imageUrl}
                                            alt={productDetails.productName}
                                            style={styles.carouselImage}
                                        />
                                    </div>
                                ))}
                            </Carousel>
                        </div>
                    </Col>

                    <Col xs={24} md={12}>
                        <div style={styles.productInfo}>
                            <Title level={2} style={styles.title}>
                                {productDetails.productName}
                            </Title>
                            
                            <Text style={styles.price}>
                                {productDetails.unitPrice.toLocaleString('vi-VN')} VNĐ
                            </Text>

                            <Divider />

                            <div style={styles.section}>
                                <Text style={styles.sectionTitle}>Màu Sắc:</Text>
                                <div>
                                    {colors.map(color => (
                                        <Button
                                            key={color.productColorId}
                                            onClick={() => setSelectedColorId(color.productColorId)}
                                            style={{
                                                ...styles.colorButton,
                                                ...(selectedColorId === color.productColorId ? styles.colorButtonSelected : {}),
                                                border: selectedColorId === color.productColorId ? `2px solid ${color.hexCode}` : '2px solid transparent'
                                            }}
                                            
                                        >
                                               {color.colorName}
                                        </Button>
                                    ))}
                                </div>
                            </div>

                            <div style={styles.section}>
                                <Text style={styles.sectionTitle}>Kích Cỡ:</Text>
                                <div>
                                    {sizes.map(size => (
                                        <Button
                                            key={size.productSizeId}
                                            onClick={() => setSelectedSizeId(size.productSizeId)}
                                            disabled={size.stockQuantity === 0}
                                            style={{
                                                ...styles.sizeButton,
                                                ...(selectedSizeId === size.productSizeId ? styles.sizeButtonSelected : {})
                                            }}
                                        >
                                            {size.sizeValue}
                                        </Button>
                                    ))}
                                </div>
                            </div>

                            {selectedSize && selectedSize.stockQuantity > 0 && (
                                <div style={styles.stockInfo}>
                                    <CheckCircleOutlined style={styles.stockIcon} />
                                    <Text>Còn {selectedSize.stockQuantity} sản phẩm</Text>
                                </div>
                            )}

                            <div style={styles.quantityContainer}>
                                <Text style={styles.quantityLabel}>Số Lượng:</Text>
                                <InputNumber
                                    min={1}
                                    max={selectedSize ? selectedSize.stockQuantity : 1}
                                    value={quantity}
                                    onChange={setQuantity}
                                    size="large"
                                />
                            </div>

                            <Button
                                type="primary"
                                icon={<ShoppingCartOutlined />}
                                size="large"
                                onClick={handleAddToCart}
                                style={styles.addToCartButton}
                                onMouseEnter={(e) => {
                                    e.currentTarget.style.opacity = '0.9';
                                    e.currentTarget.style.transform = 'translateY(-2px)';
                                }}
                                onMouseLeave={(e) => {
                                    e.currentTarget.style.opacity = '1';
                                    e.currentTarget.style.transform = 'translateY(0)';
                                }}
                            >
                                Thêm vào giỏ hàng
                            </Button>
                        </div>
                    </Col>
                </Row>
            </div>
        </CustomerLayout>
    );
};

export default ProductDetails;