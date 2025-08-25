import React, { useEffect, useState } from 'react';
import { 
    Button, 
    Typography, 
    Row, 
    Col, 
    Divider, 
    message, 
    Modal, 
    Card,
    InputNumber,
    Spin
} from 'antd';
import { 
    DeleteOutlined, 
    ShoppingCartOutlined, 
    ShoppingOutlined 
} from '@ant-design/icons';
import CustomerLayout from '../../layouts/CustomerLayout';
import { useNavigate } from 'react-router-dom';
import { 
    getProductById,
    getProductColorsByProductId,
    getSizesByProductColorId,
    getImagesByProductColorId
} from '../../services/home/HomeService';

const { Title, Text } = Typography;

const styles = {
    container: {
        padding: '24px',
    },
    header: {
        marginBottom: '24px',
        display: 'flex',
        alignItems: 'center',
        gap: '12px',
    },
    headerIcon: {
        fontSize: '28px',
        color: '#001529',
    },
    cartEmpty: {
        textAlign: 'center',
        padding: '48px 0',
    },
    emptyText: {
        color: '#666',
        fontSize: '16px',
        marginTop: '16px',
    },
    shopNowButton: {
        marginTop: '24px',
        height: '40px',
        fontSize: '16px',
        background: 'linear-gradient(135deg, #001529 0%, #003a70 100%)',
        border: 'none',
        borderRadius: '8px',
        padding: '0 32px',
    },
    cartItem: {
        marginBottom: '16px',
        borderRadius: '12px',
        overflow: 'hidden',
        boxShadow: '0 2px 8px rgba(0,0,0,0.06)',
        border: 'none',
        transition: 'all 0.3s ease',
    },
    cartItemHover: {
        transform: 'translateY(-2px)',
        boxShadow: '0 4px 12px rgba(0,0,0,0.1)',
    },
    itemImage: {
        width: '120px',
        height: '120px',
        objectFit: 'cover',
        borderRadius: '8px',
    },
    itemDetails: {
        padding: '16px',
    },
    itemName: {
        fontSize: '18px',
        fontWeight: 'bold',
        color: '#001529',
        marginBottom: '8px',
    },
    itemInfo: {
        color: '#666',
        marginBottom: '4px',
    },
    itemPrice: {
        fontSize: '16px',
        color: '#f50',
        fontWeight: 'bold',
    },
    quantityControl: {
        display: 'flex',
        alignItems: 'center',
        gap: '12px',
        marginTop: '12px',
    },
    deleteButton: {
        color: '#ff4d4f',
        border: '1px solid #ff4d4f',
        borderRadius: '6px',
        transition: 'all 0.3s ease',
    },
    deleteButtonHover: {
        background: '#fff1f0',
        borderColor: '#ff7875',
        color: '#ff7875',
    },
    summary: {
        background: '#fff',
        padding: '24px',
        borderRadius: '12px',
        boxShadow: '0 2px 8px rgba(0,0,0,0.06)',
        position: 'sticky',
        top: '140px',
    },
    summaryTitle: {
        fontSize: '20px',
        marginBottom: '16px',
        color: '#001529',
    },
    summaryItem: {
        display: 'flex',
        justifyContent: 'space-between',
        marginBottom: '12px',
    },
    summaryTotal: {
        fontWeight: 'bold',
        fontSize: '20px',
        color: '#f50',
    },
    checkoutButton: {
        width: '100%',
        height: '48px',
        fontSize: '16px',
        background: 'linear-gradient(135deg, #001529 0%, #003a70 100%)',
        border: 'none',
        borderRadius: '8px',
        marginTop: '24px',
        transition: 'all 0.3s ease',
    },
    checkoutButtonHover: {
        opacity: '0.9',
        transform: 'translateY(-2px)',
    },
    inputNumber: {
        width: '100px',
    },
};

const Cart = () => {
    const [cartItems, setCartItems] = useState([]);
    const [totalPrice, setTotalPrice] = useState(0);
    const [hoveredItem, setHoveredItem] = useState(null);
    const [hoveredButton, setHoveredButton] = useState(null);
    const [loading, setLoading] = useState(true);
    const [productDetails, setProductDetails] = useState({});
    const navigate = useNavigate();

    const formatPrice = (price) => {
        return new Intl.NumberFormat('vi-VN', {
            style: 'currency',
            currency: 'VND'
        }).format(price).replace('₫', 'VNĐ');
    };

    useEffect(() => {
        const fetchCartDetails = async () => {
            const cart = JSON.parse(localStorage.getItem('cart')) || [];
            const details = {};

            try {
                await Promise.all(cart.map(async (item) => {
                    const [product, colors] = await Promise.all([
                        getProductById(item.productId),
                        getProductColorsByProductId(item.productId)
                    ]);

                    const selectedColor = colors.find(color => color.productColorId === item.colorId);
                    
                    const [sizes, images] = await Promise.all([
                        getSizesByProductColorId(item.colorId),
                        getImagesByProductColorId(item.colorId)
                    ]);

                    const selectedSize = sizes.find(size => size.productSizeId === item.sizeId);
                    const mainImage = images[0]?.imageUrl;

                    details[item.productId] = {
                        ...product,
                        colorName: selectedColor?.colorName || 'N/A',
                        sizeValue: selectedSize?.sizeValue || 'N/A',
                        imageUrl: mainImage
                    };
                }));

                setProductDetails(details);
                setCartItems(cart);
                calculateTotalPrice(cart);
            } catch (error) {
                console.error('Error fetching cart details:', error);
                message.error('Không thể tải thông tin giỏ hàng');
            } finally {
                setLoading(false);
            }
        };

        fetchCartDetails();
    }, []);

    const calculateTotalPrice = (cart) => {
        const total = cart.reduce((acc, item) => acc + item.unitPrice * item.quantity, 0);
        setTotalPrice(total);
    };

    const handleQuantityChange = (index, value) => {
        const updatedCart = [...cartItems];
        updatedCart[index].quantity = value;
        setCartItems(updatedCart);
        localStorage.setItem('cart', JSON.stringify(updatedCart));
        calculateTotalPrice(updatedCart);
    };

    const handleRemoveItem = (index) => {
        const itemToRemove = cartItems[index];
        const details = productDetails[itemToRemove.productId];

        Modal.confirm({
            title: 'Xác nhận xóa',
            content: `Bạn có chắc chắn muốn xóa "${details.productName}" khỏi giỏ hàng?`,
            okText: 'Xóa',
            cancelText: 'Hủy',
            okButtonProps: { danger: true },
            onOk: () => {
                const updatedCart = cartItems.filter((_, i) => i !== index);
                setCartItems(updatedCart);
                localStorage.setItem('cart', JSON.stringify(updatedCart));
                calculateTotalPrice(updatedCart);
                message.success(`Đã xóa ${details.productName} khỏi giỏ hàng`);
            }
        });
    };

    const handleCheckout = () => {
        navigate('/checkout');
    };

    if (loading) {
        return (
            <CustomerLayout>
                <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '400px' }}>
                    <Spin size="large" />
                </div>
            </CustomerLayout>
        );
    }

    if (cartItems.length === 0) {
        return (
            <CustomerLayout>
                <div style={styles.cartEmpty}>
                    <ShoppingCartOutlined style={{ fontSize: '64px', color: '#001529' }} />
                    <Title level={3}>Giỏ hàng của bạn đang trống</Title>
                    <Text style={styles.emptyText}>
                        Hãy thêm một số sản phẩm vào giỏ hàng của bạn và quay lại đây nhé!
                    </Text>
                    <div>
                        <Button 
                            type="primary"
                            icon={<ShoppingOutlined />}
                            style={styles.shopNowButton}
                            onClick={() => navigate('/')}
                        >
                            Mua Sắm Ngay
                        </Button>
                    </div>
                </div>
            </CustomerLayout>
        );
    }

    return (
        <CustomerLayout>
            <div style={styles.container}>
                <div style={styles.header}>
                    <ShoppingCartOutlined style={styles.headerIcon} />
                    <Title level={2} style={{ margin: 0 }}>Giỏ hàng của bạn</Title>
                </div>

                <Row gutter={24}>
                    <Col xs={24} lg={16}>
                        {cartItems.map((item, index) => {
                            const details = productDetails[item.productId] || {};
                            return (
                                <Card 
                                    key={index} 
                                    style={{
                                        ...styles.cartItem,
                                        ...(hoveredItem === index ? styles.cartItemHover : {})
                                    }}
                                    onMouseEnter={() => setHoveredItem(index)}
                                    onMouseLeave={() => setHoveredItem(null)}
                                >
                                    <Row gutter={16} align="middle">
                                        <Col xs={24} sm={8}>
                                            <img
                                                src={details.imageUrl || 'placeholder.jpg'}
                                                alt={details.productName}
                                                style={styles.itemImage}
                                            />
                                        </Col>
                                        <Col xs={24} sm={16}>
                                            <div style={styles.itemDetails}>
                                                <Text style={styles.itemName}>{details.productName}</Text>
                                                <div style={styles.itemInfo}>
                                                    <Text>Màu sắc: {details.colorName}</Text>
                                                </div>
                                                <div style={styles.itemInfo}>
                                                    <Text>Kích cỡ: {details.sizeValue}</Text>
                                                </div>
                                                <Text style={styles.itemPrice}>
                                                    {formatPrice(item.unitPrice)}
                                                </Text>
                                                
                                                <div style={styles.quantityControl}>
                                                    <InputNumber
                                                        min={1}
                                                        max={10}
                                                        value={item.quantity}
                                                        onChange={(value) => handleQuantityChange(index, value)}
                                                        style={styles.inputNumber}
                                                    />
                                                    <Button
                                                        icon={<DeleteOutlined />}
                                                        onClick={() => handleRemoveItem(index)}
                                                        style={{
                                                            ...styles.deleteButton,
                                                            ...(hoveredButton === index ? styles.deleteButtonHover : {})
                                                        }}
                                                        onMouseEnter={() => setHoveredButton(index)}
                                                        onMouseLeave={() => setHoveredButton(null)}
                                                    >
                                                        Xóa
                                                    </Button>
                                                </div>
                                            </div>
                                        </Col>
                                    </Row>
                                </Card>
                            );
                        })}
                    </Col>

                    <Col xs={24} lg={8}>
                        <div style={styles.summary}>
                            <Title level={4} style={styles.summaryTitle}>Tổng đơn hàng</Title>
                            <div style={styles.summaryItem}>
                                <Text>Tạm tính:</Text>
                                <Text>{formatPrice(totalPrice)}</Text>
                            </div>
                            <div style={styles.summaryItem}>
                                <Text>Phí vận chuyển:</Text>
                                <Text>{formatPrice(0)}</Text>
                            </div>
                            <Divider />
                            <div style={styles.summaryItem}>
                                <Text strong>Tổng cộng:</Text>
                                <Text style={styles.summaryTotal}>
                                    {formatPrice(totalPrice)}
                                </Text>
                            </div>
                            <Button
                                type="primary"
                                size="large"
                                onClick={handleCheckout}
                                style={{
                                    ...styles.checkoutButton,
                                    ...(hoveredButton === 'checkout' ? styles.checkoutButtonHover : {})
                                }}
                                onMouseEnter={() => setHoveredButton('checkout')}
                                onMouseLeave={() => setHoveredButton(null)}
                                icon={<ShoppingOutlined />}
                            >
                                Tiến hành thanh toán
                            </Button>
                        </div>
                    </Col>
                </Row>
            </div>
        </CustomerLayout>
    );
};

export default Cart;