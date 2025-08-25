import React from 'react';
import { Button, Typography, Row, Col, Card, Steps, Result } from 'antd';
import { useNavigate, useLocation } from 'react-router-dom';
import CustomerLayout from '../../layouts/CustomerLayout';
import { 
    ShoppingOutlined, 
    UserOutlined, 
    CheckCircleOutlined,
    EnvironmentOutlined,
    PhoneOutlined,
    MailOutlined,
    FileTextOutlined
} from '@ant-design/icons';
import { formatPrice } from '../../utils/formatters';

const { Title, Text } = Typography;

const styles = {
    container: {
        padding: '24px',
    },
    steps: {
        marginBottom: '40px',
    },
    card: {
        borderRadius: '12px',
        boxShadow: '0 4px 12px rgba(0,0,0,0.08)',
        marginBottom: '24px',
    },
    section: {
        marginBottom: '24px',
    },
    sectionTitle: {
        fontSize: '18px',
        fontWeight: 'bold',
        color: '#001529',
        marginBottom: '16px',
        display: 'flex',
        alignItems: 'center',
        gap: '8px',
    },
    infoItem: {
        display: 'flex',
        alignItems: 'center',
        marginBottom: '12px',
        color: '#666',
    },
    icon: {
        marginRight: '8px',
        color: '#001529',
    },
    label: {
        fontWeight: 'bold',
        marginRight: '8px',
        color: '#001529',
    },
    button: {
        height: '40px',
        padding: '0 32px',
        fontSize: '16px',
        background: 'linear-gradient(135deg, #001529 0%, #003a70 100%)',
        border: 'none',
        borderRadius: '8px',
        transition: 'all 0.3s ease',
    },
    buttonHover: {
        opacity: '0.9',
        transform: 'translateY(-2px)',
    },
    result: {
        padding: '24px 0',
    },
    orderNumber: {
        fontSize: '16px',
        color: '#666',
        marginTop: '8px',
    },
};

const SuccessPage = () => {
    const navigate = useNavigate();
    const location = useLocation();
    const orderData = location.state?.orderData;
    const [hoveredButton, setHoveredButton] = React.useState(false);

    const handleContinueShopping = () => {
        navigate('/');
    };

    return (
        <CustomerLayout>
            <div style={styles.container}>
                <Steps
                    style={styles.steps}
                    items={[
                        {
                            title: 'Giỏ hàng',
                            status: 'finish',
                            icon: <ShoppingOutlined />,
                        },
                        {
                            title: 'Thông tin đặt hàng',
                            status: 'finish',
                            icon: <UserOutlined />,
                        },
                        {
                            title: 'Hoàn tất',
                            status: 'finish',
                            icon: <CheckCircleOutlined />,
                        },
                    ]}
                />

                <Result
                    status="success"
                    title="Đặt hàng thành công!"
                    subTitle={
                        <div style={styles.orderNumber}>
                            Mã đơn hàng: {orderData?.orderId || '#' + Math.random().toString(36).substr(2, 9)}
                        </div>
                    }
                    style={styles.result}
                />

                {orderData && (
                    <Row gutter={24}>
                        <Col xs={24} md={12}>
                            <Card style={styles.card}>
                                <div style={styles.section}>
                                    <div style={styles.sectionTitle}>
                                        <UserOutlined /> Thông tin khách hàng
                                    </div>
                                    <div style={styles.infoItem}>
                                        <UserOutlined style={styles.icon} />
                                        <span style={styles.label}>Họ và tên:</span>
                                        {orderData.guestDto.fullName}
                                    </div>
                                    <div style={styles.infoItem}>
                                        <MailOutlined style={styles.icon} />
                                        <span style={styles.label}>Email:</span>
                                        {orderData.guestDto.email}
                                    </div>
                                    <div style={styles.infoItem}>
                                        <PhoneOutlined style={styles.icon} />
                                        <span style={styles.label}>Số điện thoại:</span>
                                        {orderData.guestDto.phone}
                                    </div>
                                </div>

                                <div style={styles.section}>
                                    <div style={styles.sectionTitle}>
                                        <EnvironmentOutlined /> Địa chỉ giao hàng
                                    </div>
                                    <div style={styles.infoItem}>
                                        {orderData.guestDto.address}
                                        {orderData.guestDto.address2 && `, ${orderData.guestDto.address2}`}
                                        {`, ${orderData.guestDto.city}`}
                                    </div>
                                </div>
                            </Card>
                        </Col>

                        <Col xs={24} md={12}>
                            <Card style={styles.card}>
                                <div style={styles.section}>
                                    <div style={styles.sectionTitle}>
                                        <FileTextOutlined /> Chi tiết đơn hàng
                                    </div>
                                    <div style={styles.infoItem}>
                                        <span style={styles.label}>Tổng giá trị:</span>
                                        {formatPrice(orderData.orderDto.totalPrice)}
                                    </div>
                                    <div style={styles.infoItem}>
                                        <span style={styles.label}>Phương thức thanh toán:</span>
                                        Thanh toán khi nhận hàng (COD)
                                    </div>
                                    {orderData.orderDto.orderNote && (
                                        <div style={styles.infoItem}>
                                            <span style={styles.label}>Ghi chú:</span>
                                            {orderData.orderDto.orderNote}
                                        </div>
                                    )}
                                </div>
                            </Card>
                        </Col>
                    </Row>
                )}

                <div style={{ textAlign: 'center', marginTop: '24px' }}>
                    <Button
                        type="primary"
                        size="large"
                        icon={<ShoppingOutlined />}
                        onClick={handleContinueShopping}
                        style={{
                            ...styles.button,
                            ...(hoveredButton ? styles.buttonHover : {})
                        }}
                        onMouseEnter={() => setHoveredButton(true)}
                        onMouseLeave={() => setHoveredButton(false)}
                    >
                        Tiếp tục mua sắm
                    </Button>
                </div>
            </div>
        </CustomerLayout>
    );
};

export default SuccessPage;