import React, { useEffect, useState } from 'react';
import { Button, Typography, Row, Col, Card, message, Steps, Spin, Form, Input, Radio } from 'antd';
import { UserOutlined, ShoppingOutlined, CreditCardOutlined, CheckCircleOutlined, MoneyCollectOutlined, WalletOutlined } from '@ant-design/icons';
import CustomerLayout from '../../layouts/CustomerLayout';
import VoucherSelector from '../../components/voucher/VoucherSelector';
import { useNavigate } from 'react-router-dom';
import { createOrder, createVNPayPayment, getProductById, getProductColorsByProductId, getSizesByProductColorId, getImagesByProductColorId, getCustomerByEmail } from '../../services/home/HomeService';
import { formatPrice } from '../../utils/formatters';
import { jwtDecode } from 'jwt-decode';

const { Title, Text } = Typography;
const { TextArea } = Input;

const styles = {
    container: {
        padding: '24px',
    },
    steps: {
        marginBottom: '40px',
    },
    section: {
        marginBottom: '24px',
    },
    card: {
        borderRadius: '12px',
        boxShadow: '0 2px 8px rgba(0,0,0,0.06)',
    },
    title: {
        fontSize: '24px',
        marginBottom: '24px',
        color: '#001529',
        textAlign: 'center',
    },
    subtitle: {
        fontSize: '18px',
        marginBottom: '16px',
        color: '#001529',
    },
    formItem: {
        marginBottom: '16px',
    },
    input: {
        borderRadius: '8px',
    },
    orderSummary: {
        background: '#f8f9fa',
        padding: '20px',
        borderRadius: '12px',
        marginBottom: '20px',
    },
    orderItem: {
        marginBottom: '16px',
        padding: '12px',
        background: '#fff',
        borderRadius: '8px',
        boxShadow: '0 1px 3px rgba(0,0,0,0.05)',
    },
    itemImage: {
        width: '80px',
        height: '80px',
        objectFit: 'cover',
        borderRadius: '4px',
    },
    itemName: {
        fontWeight: 'bold',
        marginBottom: '4px',
    },
    itemDetails: {
        color: '#666',
        fontSize: '14px',
    },
    totalPrice: {
        fontSize: '18px',
        fontWeight: 'bold',
        color: '#f50',
        textAlign: 'right',
        marginTop: '16px',
    },
    submitButton: {
        width: '100%',
        height: '48px',
        fontSize: '16px',
        background: 'linear-gradient(135deg, #001529 0%, #003a70 100%)',
        border: 'none',
        borderRadius: '8px',
        marginTop: '24px',
    },
    emptyCart: {
        textAlign: 'center',
        padding: '40px',
    },
    note: {
        fontSize: '14px',
        color: '#666',
        fontStyle: 'italic',
        marginTop: '8px',
    },
    loadingContainer: {
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        height: '400px',
    },
};

const CheckoutPage = () => {
    const [form] = Form.useForm();
    const navigate = useNavigate();
    const [loading, setLoading] = useState(true);
    const [orderItems, setOrderItems] = useState([]);
    const [totalPrice, setTotalPrice] = useState(0);
    const [productDetails, setProductDetails] = useState({});
    const [isLoggedIn, setIsLoggedIn] = useState(false);
    const [customerId, setCustomerId] = useState(null);
    const [paymentMethod, setPaymentMethod] = useState('cod');
    const [appliedVoucher, setAppliedVoucher] = useState(null);
    const [voucherDiscount, setVoucherDiscount] = useState(0);

    useEffect(() => {
        const fetchInitialData = async () => {
            const cart = JSON.parse(localStorage.getItem('cart')) || [];
            if (cart.length === 0) {
                message.warning('Giỏ hàng của bạn đang trống');
                navigate('/cart');
                return;
            }

            // Check authentication
            const token = localStorage.getItem('jwt');
            if (token) {
                try {
                    const decodedToken = jwtDecode(token);
                    setIsLoggedIn(true);
                    
                    // Fetch customer details by email
                    const customerData = await getCustomerByEmail(decodedToken.sub);
                    if (customerData) {
                        setCustomerId(customerData.customerId);
                        form.setFieldsValue({
                            fullName: customerData.fullName,
                            email: customerData.email,
                            phone: customerData.phone,
                            address: customerData.address,
                            address2: customerData.address2 || '',
                            city: customerData.city
                        });
                    }
                } catch (err) {
                    console.error('Error fetching customer data:', err);
                }
            }

            try {
                const details = {};
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
                setOrderItems(cart);
                const total = cart.reduce((acc, item) => acc + item.unitPrice * item.quantity, 0);
                setTotalPrice(total);
            } catch (error) {
                console.error('Error fetching order details:', error);
                message.error('Không thể tải thông tin đơn hàng');
            } finally {
                setLoading(false);
            }
        };

        fetchInitialData();
    }, [navigate, form]);

    const handleVoucherApplied = (voucher, discountAmount) => {
        setAppliedVoucher(voucher);
        setVoucherDiscount(discountAmount);
    };

    const onFinish = async (values) => {
        setLoading(true);
        try {
            const orderData = {
                ...(isLoggedIn ? { customerId } : {
                    guestDto: {
                        fullName: values.fullName,
                        email: values.email,
                        phone: values.phone,
                        address: values.address,
                        address2: values.address2,
                        city: values.city,
                    }
                }),
                orderDto: {
                    totalPrice: totalPrice - voucherDiscount,
                    originalPrice: totalPrice,
                    voucherDiscount: voucherDiscount,
                    voucherCode: appliedVoucher?.code || null,
                    isPaid: false,
                    orderNote: values.orderNote,
                },
                orderItemDtos: orderItems.map(item => ({
                    productSizeId: item.sizeId,
                    quantity: item.quantity,
                    price: item.unitPrice,
                })),
            };
      
            const orderResponse = await createOrder(orderData);
            
            if (values.paymentMethod === 'vnpay') {
                // Store order details temporarily for VNPay return handling
                localStorage.setItem('pendingOrder', JSON.stringify({
                    orderId: orderResponse.orderId,
                    totalPrice: totalPrice
                }));
                
                // Create VNPay payment URL and redirect
                const paymentUrl = await createVNPayPayment(orderResponse.orderId, totalPrice - voucherDiscount);
                window.location.href = paymentUrl;
            } else {
                // COD payment - order completed
                message.success('Đặt hàng thành công!');
                localStorage.removeItem('cart');
                navigate('/success');
            }
        } catch (error) {
            message.error('Có lỗi xảy ra khi đặt hàng. Vui lòng thử lại!');
            console.error('Error creating order:', error);
        } finally {
            setLoading(false);
        }
    };

    if (loading) {
        return (
            <CustomerLayout>
                <div style={styles.loadingContainer}>
                    <Spin size="large" />
                </div>
            </CustomerLayout>
        );
    }

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
                            status: 'process',
                            icon: <UserOutlined />,
                        },
                        {
                            title: 'Hoàn tất',
                            status: 'wait',
                            icon: <CheckCircleOutlined />,
                        },
                    ]}
                />

                <Row gutter={24}>
                    <Col xs={24} lg={16}>
                        <Card style={styles.card}>
                            <Title level={3} style={styles.title}>
                                Thông tin đặt hàng
                            </Title>
                            <Form
                                form={form}
                                layout="vertical"
                                onFinish={onFinish}
                            >
                                <Row gutter={16}>
                                    <Col xs={24} md={12}>
                                        <Form.Item
                                            label="Họ và tên"
                                            name="fullName"
                                            rules={[{ required: true, message: 'Vui lòng nhập họ tên!' }]}
                                        >
                                            <Input 
                                                size="large"
                                                style={styles.input}
                                                disabled={isLoggedIn}
                                                readOnly={isLoggedIn}
                                            />
                                        </Form.Item>
                                    </Col>
                                    <Col xs={24} md={12}>
                                        <Form.Item
                                            label="Email"
                                            name="email"
                                            rules={[
                                                { required: true, message: 'Vui lòng nhập email!' },
                                                { type: 'email', message: 'Email không hợp lệ!' }
                                            ]}
                                        >
                                            <Input 
                                                size="large"
                                                style={styles.input}
                                                disabled={isLoggedIn}
                                                readOnly={isLoggedIn}
                                            />
                                        </Form.Item>
                                    </Col>
                                </Row>

                                <Row gutter={16}>
                                    <Col xs={24} md={12}>
                                        <Form.Item
                                            label="Số điện thoại"
                                            name="phone"
                                            rules={[{ required: true, message: 'Vui lòng nhập số điện thoại!' }]}
                                        >
                                            <Input 
                                                size="large"
                                                style={styles.input}
                                                disabled={isLoggedIn}
                                                readOnly={isLoggedIn}
                                            />
                                        </Form.Item>
                                    </Col>
                                    <Col xs={24} md={12}>
                                        <Form.Item
                                            label="Thành phố"
                                            name="city"
                                            rules={[{ required: true, message: 'Vui lòng nhập thành phố!' }]}
                                        >
                                            <Input 
                                                size="large"
                                                style={styles.input}
                                                disabled={isLoggedIn}
                                                readOnly={isLoggedIn}
                                            />
                                        </Form.Item>
                                    </Col>
                                </Row>

                                <Form.Item
                                    label="Địa chỉ"
                                    name="address"
                                    rules={[{ required: true, message: 'Vui lòng nhập địa chỉ!' }]}
                                >
                                    <Input 
                                        size="large"
                                        style={styles.input}
                                        disabled={isLoggedIn}
                                        readOnly={isLoggedIn}
                                    />
                                </Form.Item>

                                <Form.Item
                                    label="Địa chỉ bổ sung (tùy chọn)"
                                    name="address2"
                                >
                                    <Input 
                                        size="large"
                                        style={styles.input}
                                        disabled={isLoggedIn}
                                        readOnly={isLoggedIn}
                                    />
                                </Form.Item>

                                <Form.Item
                                    label="Ghi chú đơn hàng"
                                    name="orderNote"
                                >
                                    <TextArea rows={4} style={styles.input} />
                                </Form.Item>

                                <Form.Item
                                    label="Phương thức thanh toán"
                                    name="paymentMethod"
                                    initialValue="cod"
                                    rules={[{ required: true, message: 'Vui lòng chọn phương thức thanh toán!' }]}
                                >
                                    <Radio.Group 
                                        onChange={(e) => setPaymentMethod(e.target.value)}
                                        value={paymentMethod}
                                    >
                                        <Radio value="cod" style={{ display: 'block', marginBottom: '8px' }}>
                                            <MoneyCollectOutlined style={{ marginRight: '8px' }} />
                                            Thanh toán khi nhận hàng (COD)
                                        </Radio>
                                        <Radio value="vnpay" style={{ display: 'block' }}>
                                            <WalletOutlined style={{ marginRight: '8px' }} />
                                            Thanh toán online qua VNPay
                                        </Radio>
                                    </Radio.Group>
                                </Form.Item>
                            </Form>
                        </Card>
                    </Col>

                    <Col xs={24} lg={8}>
                        <Card style={styles.card}>
                            <Title level={4} style={styles.subtitle}>
                                Đơn hàng của bạn
                            </Title>
                            
                            {/* Voucher Selector */}
                            {isLoggedIn && customerId && (
                                <VoucherSelector
                                    customerId={customerId}
                                    orderValue={totalPrice}
                                    onVoucherApplied={handleVoucherApplied}
                                    appliedVoucher={appliedVoucher}
                                />
                            )}
                            
                            <div style={styles.orderSummary}>
                                {orderItems.map((item, index) => {
                                    const details = productDetails[item.productId] || {};
                                    return (
                                        <div key={index} style={styles.orderItem}>
                                            <Row gutter={16} align="middle">
                                                <Col flex="80px">
                                                    <img
                                                        src={details.imageUrl || 'placeholder.jpg'}
                                                        alt={details.productName}
                                                        style={styles.itemImage}
                                                    />
                                                </Col>
                                                <Col flex="auto">
                                                    <div style={styles.itemName}>{details.productName}</div>
                                                    <div style={styles.itemDetails}>
                                                        Màu sắc: {details.colorName}
                                                    </div>
                                                    <div style={styles.itemDetails}>
                                                        Kích cỡ: {details.sizeValue}
                                                    </div>
                                                    <div style={styles.itemDetails}>
                                                        Số lượng: {item.quantity}
                                                    </div>
                                                    <div style={styles.itemDetails}>
                                                        {formatPrice(item.unitPrice)}
                                                    </div>
                                                </Col>
                                            </Row>
                                        </div>
                                    );
                                })}

                                <div style={styles.totalPrice}>
                                    {voucherDiscount > 0 && (
                                        <>
                                            <div style={{ fontSize: '14px', color: '#666', textDecoration: 'line-through' }}>
                                                Tạm tính: {formatPrice(totalPrice)}
                                            </div>
                                            <div style={{ fontSize: '14px', color: '#52c41a', marginBottom: '8px' }}>
                                                Giảm giá: -{formatPrice(voucherDiscount)}
                                            </div>
                                        </>
                                    )}
                                    Tổng cộng: {formatPrice(totalPrice - voucherDiscount)}
                                </div>
                            </div>

                            <Button
                                type="primary"
                                size="large"
                                onClick={() => form.submit()}
                                loading={loading}
                                style={styles.submitButton}
                                icon={<CreditCardOutlined />}
                            >
                                {paymentMethod === 'vnpay' ? 'Thanh toán VNPay' : 'Đặt hàng COD'}
                            </Button>

                            <Text style={styles.note}>
                                {paymentMethod === 'vnpay' 
                                    ? '* Bạn sẽ được chuyển đến trang thanh toán VNPay'
                                    : '* Bạn sẽ thanh toán khi nhận hàng (COD)'
                                }
                            </Text>
                        </Card>
                    </Col>
                </Row>
            </div>
        </CustomerLayout>
    );
};

export default CheckoutPage;