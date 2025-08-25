import React, { useEffect, useState } from 'react';
import { Result, Button, Spin } from 'antd';
import { useLocation, useNavigate } from 'react-router-dom';
import { verifyVNPayPayment } from '../../services/home/HomeService';
import CustomerLayout from '../../layouts/CustomerLayout';

const VNPayReturn = () => {
    const [loading, setLoading] = useState(true);
    const [success, setSuccess] = useState(false);
    const location = useLocation();
    const navigate = useNavigate();

    useEffect(() => {
        const processPayment = async () => {
            try {
                // Get URL parameters
                const params = new URLSearchParams(location.search);
                const response = await verifyVNPayPayment(Object.fromEntries(params));
                
                if (response.includes('Thanh toán thành công')) {
                    setSuccess(true);
                    localStorage.removeItem('cart');
                } else {
                    setSuccess(false);
                }
            } catch (error) {
                console.error('Payment verification error:', error);
                setSuccess(false);
            } finally {
                setLoading(false);
                localStorage.removeItem('pendingOrder');
            }
        };

        processPayment();
    }, [location.search]);

    if (loading) {
        return (
            <CustomerLayout>
                <div style={{ 
                    display: 'flex', 
                    justifyContent: 'center', 
                    alignItems: 'center', 
                    minHeight: '60vh' 
                }}>
                    <Spin size="large" />
                </div>
            </CustomerLayout>
        );
    }

    return (
        <CustomerLayout>
            <Result
                status={success ? "success" : "error"}
                title={success ? "Thanh toán thành công!" : "Thanh toán thất bại!"}
                subTitle={success 
                    ? "Cảm ơn bạn đã mua hàng. Đơn hàng của bạn sẽ được xử lý ngay lập tức."
                    : "Có lỗi xảy ra trong quá trình thanh toán. Vui lòng thử lại hoặc chọn phương thức thanh toán khác."}
                extra={[
                    <Button 
                        type="primary" 
                        key="home" 
                        onClick={() => navigate('/')}
                    >
                        Về trang chủ
                    </Button>,
                ]}
            />
        </CustomerLayout>
    );
};

export default VNPayReturn;