import React, { useEffect, useState } from 'react';
import { Typography, Card, Tag, Spin, message, Row, Col, Image, Button } from 'antd';
import { ShoppingOutlined } from '@ant-design/icons';
import CustomerLayout from '../../layouts/CustomerLayout';
import { getCustomerByEmail } from '../../services/home/HomeService';
import { formatPrice } from '../../utils/formatters';
import { jwtDecode } from 'jwt-decode';
import { useNavigate } from 'react-router-dom';

const { Title, Text } = Typography;

const styles = {
    container: {
        padding: '24px',
        minHeight: '70vh',
    },
    header: {
        marginBottom: '24px',
        textAlign: 'center',
    },
    title: {
        color: '#001529',
        marginBottom: '8px',
    },
    subtitle: {
        color: '#666',
        fontSize: '16px',
    },
    card: {
        borderRadius: '12px',
        boxShadow: '0 2px 8px rgba(0,0,0,0.06)',
        marginBottom: '16px',
    },
    orderHeader: {
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: '16px',
        padding: '16px 0',
        borderBottom: '1px solid #f0f0f0',
    },
    orderInfo: {
        display: 'flex',
        flexDirection: 'column',
        gap: '4px',
    },
    orderId: {
        fontSize: '16px',
        fontWeight: 'bold',
        color: '#001529',
    },
    orderDate: {
        color: '#666',
        fontSize: '14px',
    },
    statusTag: {
        fontSize: '12px',
        padding: '4px 12px',
        borderRadius: '16px',
    },
    orderItems: {
        marginBottom: '16px',
    },
    itemRow: {
        display: 'flex',
        alignItems: 'center',
        padding: '12px 0',
        borderBottom: '1px solid #f8f9fa',
    },
    itemImage: {
        width: '60px',
        height: '60px',
        borderRadius: '8px',
        marginRight: '16px',
    },
    itemInfo: {
        flex: 1,
    },
    itemName: {
        fontWeight: 'bold',
        marginBottom: '4px',
        color: '#001529',
    },
    itemDetails: {
        color: '#666',
        fontSize: '14px',
        marginBottom: '2px',
    },
    itemPrice: {
        fontWeight: 'bold',
        color: '#f50',
    },
    orderTotal: {
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginTop: '16px',
        padding: '16px 0',
        borderTop: '1px solid #f0f0f0',
    },
    totalAmount: {
        fontSize: '18px',
        fontWeight: 'bold',
        color: '#f50',
    },
    emptyState: {
        textAlign: 'center',
        padding: '60px 20px',
        color: '#666',
    },
    emptyIcon: {
        fontSize: '64px',
        color: '#d9d9d9',
        marginBottom: '16px',
    },
    shopButton: {
        marginTop: '16px',
        background: 'linear-gradient(135deg, #001529 0%, #003a70 100%)',
        border: 'none',
        borderRadius: '8px',
        height: '40px',
    },
    spinner: {
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        minHeight: '400px',
    },
};

const OrderHistoryPage = () => {
    const [orders, setOrders] = useState([]);
    const [loading, setLoading] = useState(true);
    const [customerInfo, setCustomerInfo] = useState(null);
    const navigate = useNavigate();

    useEffect(() => {
        const fetchOrderHistory = async () => {
            setLoading(true);
            try {
                const token = localStorage.getItem('jwt');
                if (!token) {
                    message.error('Vui lòng đăng nhập để xem lịch sử đơn hàng');
                    navigate('/login');
                    return;
                }

                const decodedToken = jwtDecode(token);
                const customerData = await getCustomerByEmail(decodedToken.sub);
                
                if (customerData) {
                    setCustomerInfo(customerData);
                    // TODO: Implement getOrdersByCustomerId API call
                    // const orderHistory = await getOrdersByCustomerId(customerData.customerId);
                    // setOrders(orderHistory);
                    
                    // Mock data for demo
                    setOrders([
                        {
                            orderId: 'ORD001',
                            orderDate: '2024-12-15T10:30:00',
                            totalPrice: 2500000,
                            isPaid: true,
                            orderNote: 'Giao hàng vào buổi chiều',
                            items: [
                                {
                                    productName: 'Giày Nike Air Max',
                                    colorName: 'Đen',
                                    sizeValue: '42',
                                    quantity: 1,
                                    price: 2500000,
                                    imageUrl: 'https://via.placeholder.com/60x60'
                                }
                            ]
                        },
                        {
                            orderId: 'ORD002',
                            orderDate: '2024-12-10T14:20:00',
                            totalPrice: 1800000,
                            isPaid: false,
                            orderNote: '',
                            items: [
                                {
                                    productName: 'Giày Adidas Ultraboost',
                                    colorName: 'Trắng',
                                    sizeValue: '41',
                                    quantity: 1,
                                    price: 1800000,
                                    imageUrl: 'https://via.placeholder.com/60x60'
                                }
                            ]
                        }
                    ]);
                }
            } catch (error) {
                console.error('Error fetching order history:', error);
                message.error('Không thể tải lịch sử đơn hàng');
            } finally {
                setLoading(false);
            }
        };

        fetchOrderHistory();
    }, [navigate]);

    const getStatusTag = (isPaid) => {
        if (isPaid) {
            return <Tag color="success" style={styles.statusTag}>Đã thanh toán</Tag>;
        } else {
            return <Tag color="warning" style={styles.statusTag}>Chưa thanh toán</Tag>;
        }
    };

    const formatDate = (dateString) => {
        const date = new Date(dateString);
        return date.toLocaleDateString('vi-VN', {
            day: '2-digit',
            month: '2-digit',
            year: 'numeric',
            hour: '2-digit',
            minute: '2-digit'
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

    return (
        <CustomerLayout>
            <div style={styles.container}>
                <div style={styles.header}>
                    <Title level={2} style={styles.title}>
                        Lịch sử đơn hàng
                    </Title>
                    <Text style={styles.subtitle}>
                        {customerInfo ? `Xin chào ${customerInfo.fullName}, ` : ''}xem lại tất cả các đơn hàng bạn đã đặt
                    </Text>
                </div>

                {orders.length === 0 ? (
                    <div style={styles.emptyState}>
                        <ShoppingOutlined style={styles.emptyIcon} />
                        <Title level={4}>Chưa có đơn hàng nào</Title>
                        <Text>Bạn chưa có đơn hàng nào. Hãy bắt đầu mua sắm ngay!</Text>
                        <br />
                        <Button 
                            type="primary" 
                            style={styles.shopButton}
                            onClick={() => navigate('/product')}
                        >
                            Bắt đầu mua sắm
                        </Button>
                    </div>
                ) : (
                    <Row gutter={[0, 16]}>
                        {orders.map((order) => (
                            <Col span={24} key={order.orderId}>
                                <Card style={styles.card}>
                                    <div style={styles.orderHeader}>
                                        <div style={styles.orderInfo}>
                                            <Text style={styles.orderId}>
                                                Đơn hàng #{order.orderId}
                                            </Text>
                                            <Text style={styles.orderDate}>
                                                Đặt hàng: {formatDate(order.orderDate)}
                                            </Text>
                                        </div>
                                        {getStatusTag(order.isPaid)}
                                    </div>

                                    <div style={styles.orderItems}>
                                        {order.items.map((item, index) => (
                                            <div key={index} style={styles.itemRow}>
                                                <Image
                                                    src={item.imageUrl}
                                                    alt={item.productName}
                                                    style={styles.itemImage}
                                                    preview={false}
                                                />
                                                <div style={styles.itemInfo}>
                                                    <div style={styles.itemName}>
                                                        {item.productName}
                                                    </div>
                                                    <div style={styles.itemDetails}>
                                                        Màu sắc: {item.colorName} | Kích cỡ: {item.sizeValue}
                                                    </div>
                                                    <div style={styles.itemDetails}>
                                                        Số lượng: {item.quantity}
                                                    </div>
                                                    <div style={styles.itemPrice}>
                                                        {formatPrice(item.price)}
                                                    </div>
                                                </div>
                                            </div>
                                        ))}
                                    </div>

                                    {order.orderNote && (
                                        <div style={styles.itemDetails}>
                                            <strong>Ghi chú:</strong> {order.orderNote}
                                        </div>
                                    )}

                                    <div style={styles.orderTotal}>
                                        <Text style={{ fontWeight: 'bold' }}>Tổng cộng:</Text>
                                        <Text style={styles.totalAmount}>
                                            {formatPrice(order.totalPrice)}
                                        </Text>
                                    </div>
                                </Card>
                            </Col>
                        ))}
                    </Row>
                )}
            </div>
        </CustomerLayout>
    );
};

export default OrderHistoryPage;
