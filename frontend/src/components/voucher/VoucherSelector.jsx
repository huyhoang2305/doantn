import React, { useState, useEffect } from 'react';
import { 
    Card, 
    Button, 
    Input, 
    Tag, 
    Space, 
    message, 
    Collapse, 
    Typography,
    Row,
    Col,
    Divider
} from 'antd';
import { 
    GiftOutlined, 
    CheckCircleOutlined, 
    CloseCircleOutlined,
    PercentageOutlined,
    DollarOutlined
} from '@ant-design/icons';
import { getAvailableVouchersForCustomer, applyVoucher } from '../../services/admin/VoucherService';
import { formatPrice } from '../../utils/formatters';

const { Text, Title } = Typography;
const { Panel } = Collapse;

const styles = {
    container: {
        marginBottom: '16px',
    },
    voucherCard: {
        borderRadius: '8px',
        border: '1px solid #f0f0f0',
        marginBottom: '8px',
        cursor: 'pointer',
        transition: 'all 0.3s ease',
    },
    selectedVoucherCard: {
        border: '2px solid #52c41a',
        backgroundColor: '#f6ffed',
    },
    voucherHeader: {
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: '8px',
    },
    voucherCode: {
        fontWeight: 'bold',
        color: '#001529',
        fontSize: '16px',
    },
    discountBadge: {
        borderRadius: '12px',
        padding: '4px 12px',
        fontWeight: 'bold',
    },
    voucherDescription: {
        color: '#666',
        fontSize: '14px',
        marginBottom: '8px',
    },
    voucherCondition: {
        color: '#999',
        fontSize: '12px',
        fontStyle: 'italic',
    },
    inputSection: {
        marginBottom: '16px',
    },
    applyButton: {
        background: 'linear-gradient(135deg, #52c41a 0%, #73d13d 100%)',
        border: 'none',
        borderRadius: '6px',
    },
    removeButton: {
        background: 'linear-gradient(135deg, #ff4d4f 0%, #ff7875 100%)',
        border: 'none',
        borderRadius: '6px',
    },
    discountSummary: {
        background: '#f6ffed',
        border: '1px solid #b7eb8f',
        borderRadius: '8px',
        padding: '12px',
        marginTop: '12px',
    },
};

const VoucherSelector = ({ customerId, orderValue, onVoucherApplied, appliedVoucher }) => {
    const [availableVouchers, setAvailableVouchers] = useState([]);
    const [loading, setLoading] = useState(false);
    const [voucherCode, setVoucherCode] = useState('');
    const [selectedVoucher, setSelectedVoucher] = useState(appliedVoucher);

    useEffect(() => {
        if (customerId && orderValue) {
            fetchAvailableVouchers();
        }
    }, [customerId, orderValue]);

    const fetchAvailableVouchers = async () => {
        try {
            const vouchers = await getAvailableVouchersForCustomer(customerId, orderValue);
            setAvailableVouchers(vouchers);
        } catch (error) {
            console.error('Error fetching available vouchers:', error);
        }
    };

    const handleApplyVoucherCode = async () => {
        if (!voucherCode.trim()) {
            message.warning('Vui lòng nhập mã voucher');
            return;
        }

        setLoading(true);
        try {
            const result = await applyVoucher(voucherCode, customerId, orderValue);
            if (result.valid) {
                setSelectedVoucher(result.voucher);
                onVoucherApplied(result.voucher, result.discountAmount);
                message.success('Áp dụng voucher thành công!');
                setVoucherCode('');
            } else {
                message.error(result.message || 'Voucher không hợp lệ');
            }
        } catch (error) {
            message.error('Không thể áp dụng voucher');
        } finally {
            setLoading(false);
        }
    };

    const handleSelectVoucher = async (voucher) => {
        setLoading(true);
        try {
            const result = await applyVoucher(voucher.code, customerId, orderValue);
            if (result.valid) {
                setSelectedVoucher(voucher);
                onVoucherApplied(voucher, result.discountAmount);
                message.success('Áp dụng voucher thành công!');
            } else {
                message.error(result.message || 'Voucher không hợp lệ');
            }
        } catch (error) {
            message.error('Không thể áp dụng voucher');
        } finally {
            setLoading(false);
        }
    };

    const handleRemoveVoucher = () => {
        setSelectedVoucher(null);
        onVoucherApplied(null, 0);
        message.info('Đã bỏ voucher');
    };

    const getDiscountText = (voucher) => {
        if (voucher.discountType === 'percentage') {
            return (
                <Tag color="blue" style={styles.discountBadge}>
                    <PercentageOutlined /> -{voucher.discountValue}%
                    {voucher.maxDiscount && ` (Tối đa ${formatPrice(voucher.maxDiscount)})`}
                </Tag>
            );
        } else {
            return (
                <Tag color="green" style={styles.discountBadge}>
                    <DollarOutlined /> -{formatPrice(voucher.discountValue)}
                </Tag>
            );
        }
    };

    const getConditionText = (voucher) => {
        switch (voucher.conditionType) {
            case 'first_order':
                return 'Dành cho khách hàng mới';
            case 'total_purchased':
                return `Dành cho khách đã mua >= ${formatPrice(voucher.conditionValue)}`;
            case 'order_value':
                return `Áp dụng cho đơn >= ${formatPrice(voucher.conditionValue)}`;
            case 'specific_date':
                return `Chỉ áp dụng trong ngày cụ thể`;
            default:
                return 'Áp dụng cho tất cả khách hàng';
        }
    };

    const calculateDiscount = (voucher, orderValue) => {
        if (!voucher) return 0;
        
        if (voucher.discountType === 'percentage') {
            let discount = (orderValue * voucher.discountValue) / 100;
            if (voucher.maxDiscount) {
                discount = Math.min(discount, voucher.maxDiscount);
            }
            return discount;
        } else {
            return voucher.discountValue;
        }
    };

    return (
        <div style={styles.container}>
            <Card
                title={
                    <Space>
                        <GiftOutlined />
                        <span>Voucher giảm giá</span>
                    </Space>
                }
                size="small"
            >
                {/* Manual Voucher Code Input */}
                <div style={styles.inputSection}>
                    <Text strong>Nhập mã voucher:</Text>
                    <Row gutter={8} style={{ marginTop: '8px' }}>
                        <Col flex="auto">
                            <Input
                                placeholder="Nhập mã voucher"
                                value={voucherCode}
                                onChange={(e) => setVoucherCode(e.target.value.toUpperCase())}
                                onPressEnter={handleApplyVoucherCode}
                            />
                        </Col>
                        <Col>
                            <Button
                                type="primary"
                                style={styles.applyButton}
                                loading={loading}
                                onClick={handleApplyVoucherCode}
                            >
                                Áp dụng
                            </Button>
                        </Col>
                    </Row>
                </div>

                {/* Applied Voucher Display */}
                {selectedVoucher && (
                    <div style={styles.discountSummary}>
                        <div style={styles.voucherHeader}>
                            <div>
                                <CheckCircleOutlined style={{ color: '#52c41a', marginRight: '8px' }} />
                                <Text strong style={{ color: '#52c41a' }}>
                                    Đã áp dụng: {selectedVoucher.code}
                                </Text>
                            </div>
                            <Button
                                type="text"
                                size="small"
                                icon={<CloseCircleOutlined />}
                                onClick={handleRemoveVoucher}
                                style={{ color: '#ff4d4f' }}
                            >
                                Bỏ voucher
                            </Button>
                        </div>
                        <div style={styles.voucherDescription}>
                            {selectedVoucher.description}
                        </div>
                        <Text strong style={{ color: '#52c41a' }}>
                            Tiết kiệm: {formatPrice(calculateDiscount(selectedVoucher, orderValue))}
                        </Text>
                    </div>
                )}

                {/* Available Vouchers */}
                {availableVouchers.length > 0 && !selectedVoucher && (
                    <>
                        <Divider style={{ margin: '12px 0' }} />
                        <Collapse ghost>
                            <Panel header={`Voucher khả dụng (${availableVouchers.length})`} key="1">
                                {availableVouchers.map((voucher) => (
                                    <Card
                                        key={voucher.voucherId}
                                        size="small"
                                        style={styles.voucherCard}
                                        onClick={() => handleSelectVoucher(voucher)}
                                        hoverable
                                    >
                                        <div style={styles.voucherHeader}>
                                            <Text style={styles.voucherCode}>{voucher.code}</Text>
                                            {getDiscountText(voucher)}
                                        </div>
                                        <div style={styles.voucherDescription}>
                                            {voucher.description}
                                        </div>
                                        <div style={styles.voucherCondition}>
                                            {getConditionText(voucher)}
                                            {voucher.minOrderValue && (
                                                <span> • Đơn tối thiểu: {formatPrice(voucher.minOrderValue)}</span>
                                            )}
                                        </div>
                                        <Text strong style={{ color: '#52c41a', fontSize: '12px' }}>
                                            Tiết kiệm: {formatPrice(calculateDiscount(voucher, orderValue))}
                                        </Text>
                                    </Card>
                                ))}
                            </Panel>
                        </Collapse>
                    </>
                )}

                {availableVouchers.length === 0 && !selectedVoucher && (
                    <Text type="secondary" style={{ textAlign: 'center', display: 'block' }}>
                        Không có voucher khả dụng cho đơn hàng này
                    </Text>
                )}
            </Card>
        </div>
    );
};

export default VoucherSelector;
