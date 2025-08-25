import React, { useState, useEffect } from 'react';
import {
    Table,
    Button,
    Modal,
    Form,
    Input,
    Select,
    DatePicker,
    InputNumber,
    Switch,
    Space,
    Popconfirm,
    message,
    Tag,
    Card,
    Typography,
    Row,
    Col,
    Divider
} from 'antd';
import {
    PlusOutlined,
    EditOutlined,
    DeleteOutlined,
    GiftOutlined,
    PoweroffOutlined,
    EyeOutlined
} from '@ant-design/icons';
import AdminLayout from '../../layouts/AdminLayout';
import { formatPrice } from '../../utils/formatters';
import dayjs from 'dayjs';

const { Title } = Typography;
const { Option } = Select;
const { RangePicker } = DatePicker;
const { TextArea } = Input;

const styles = {
    container: {
        padding: '24px',
    },
    header: {
        marginBottom: '24px',
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
    addButton: {
        background: 'linear-gradient(135deg, #52c41a 0%, #73d13d 100%)',
        border: 'none',
        borderRadius: '8px',
        height: '40px',
    },
    actionButton: {
        marginRight: '8px',
        borderRadius: '6px',
    },
    statusTag: {
        borderRadius: '12px',
        padding: '2px 8px',
    },
    discountTag: {
        borderRadius: '8px',
        fontWeight: 'bold',
    },
    conditionText: {
        fontSize: '12px',
        color: '#666',
        fontStyle: 'italic',
    },
};

const VoucherPage = () => {
    const [vouchers, setVouchers] = useState([]);
    const [loading, setLoading] = useState(false);
    const [modalVisible, setModalVisible] = useState(false);
    const [editingVoucher, setEditingVoucher] = useState(null);
    const [form] = Form.useForm();

    // Mock data - replace with API calls
    useEffect(() => {
        fetchVouchers();
    }, []);

    const fetchVouchers = async () => {
        setLoading(true);
        try {
            // TODO: Replace with actual API call
            const mockVouchers = [
                {
                    voucherId: 1,
                    code: 'NEWUSER10',
                    name: 'Voucher khách hàng mới',
                    description: 'Giảm 10% cho khách hàng chưa từng mua hàng',
                    discountType: 'percentage',
                    discountValue: 10,
                    maxDiscount: 50000,
                    minOrderValue: 200000,
                    conditionType: 'first_order',
                    conditionValue: null,
                    startDate: '2024-01-01',
                    endDate: '2024-12-31',
                    usageLimit: 100,
                    usedCount: 25,
                    isActive: true,
                },
                {
                    voucherId: 2,
                    code: 'VIP500K',
                    name: 'Voucher khách VIP',
                    description: 'Giảm 50,000đ cho khách đã mua tổng >= 2,000,000đ',
                    discountType: 'fixed',
                    discountValue: 50000,
                    maxDiscount: null,
                    minOrderValue: 300000,
                    conditionType: 'total_purchased',
                    conditionValue: 2000000,
                    startDate: '2024-01-01',
                    endDate: '2024-12-31',
                    usageLimit: 50,
                    usedCount: 12,
                    isActive: true,
                },
            ];
            setVouchers(mockVouchers);
        } catch (error) {
            message.error('Không thể tải danh sách voucher');
        } finally {
            setLoading(false);
        }
    };

    const handleAddVoucher = () => {
        setEditingVoucher(null);
        form.resetFields();
        setModalVisible(true);
    };

    const handleEditVoucher = (voucher) => {
        setEditingVoucher(voucher);
        form.setFieldsValue({
            ...voucher,
            dateRange: [dayjs(voucher.startDate), dayjs(voucher.endDate)],
        });
        setModalVisible(true);
    };

    const handleDeleteVoucher = async (voucherId) => {
        try {
            // TODO: Implement delete API call
            message.success('Đã xóa voucher thành công');
            fetchVouchers();
        } catch (error) {
            message.error('Không thể xóa voucher');
        }
    };

    const handleToggleStatus = async (voucherId, currentStatus) => {
        try {
            // TODO: Implement toggle status API call
            message.success(`Đã ${currentStatus ? 'tắt' : 'bật'} voucher thành công`);
            fetchVouchers();
        } catch (error) {
            message.error('Không thể thay đổi trạng thái voucher');
        }
    };

    const handleSubmit = async (values) => {
        try {
            const voucherData = {
                ...values,
                startDate: values.dateRange[0].format('YYYY-MM-DD'),
                endDate: values.dateRange[1].format('YYYY-MM-DD'),
            };
            delete voucherData.dateRange;

            if (editingVoucher) {
                // TODO: Implement update API call
                message.success('Cập nhật voucher thành công');
            } else {
                // TODO: Implement create API call
                message.success('Tạo voucher thành công');
            }

            setModalVisible(false);
            fetchVouchers();
        } catch (error) {
            message.error('Có lỗi xảy ra khi lưu voucher');
        }
    };

    const getConditionTypeText = (type, value) => {
        switch (type) {
            case 'first_order':
                return 'Khách hàng chưa từng mua hàng';
            case 'total_purchased':
                return `Tổng đã mua >= ${formatPrice(value)}`;
            case 'order_value':
                return `Giá trị đơn hàng >= ${formatPrice(value)}`;
            case 'specific_date':
                return `Áp dụng ngày ${dayjs(value).format('DD/MM/YYYY')}`;
            case 'all_customers':
                return 'Tất cả khách hàng';
            default:
                return 'Không xác định';
        }
    };

    const getDiscountText = (type, value, maxDiscount) => {
        if (type === 'percentage') {
            return (
                <Tag color="blue" style={styles.discountTag}>
                    -{value}%
                    {maxDiscount && ` (Tối đa ${formatPrice(maxDiscount)})`}
                </Tag>
            );
        } else {
            return (
                <Tag color="green" style={styles.discountTag}>
                    -{formatPrice(value)}
                </Tag>
            );
        }
    };

    const columns = [
        {
            title: 'Mã voucher',
            dataIndex: 'code',
            key: 'code',
            render: (text) => <strong style={{ color: '#001529' }}>{text}</strong>,
        },
        {
            title: 'Tên voucher',
            dataIndex: 'name',
            key: 'name',
        },
        {
            title: 'Giảm giá',
            key: 'discount',
            render: (_, record) => getDiscountText(record.discountType, record.discountValue, record.maxDiscount),
        },
        {
            title: 'Điều kiện áp dụng',
            key: 'condition',
            render: (_, record) => (
                <div>
                    <div>{getConditionTypeText(record.conditionType, record.conditionValue)}</div>
                    {record.minOrderValue && (
                        <div style={styles.conditionText}>
                            Đơn tối thiểu: {formatPrice(record.minOrderValue)}
                        </div>
                    )}
                </div>
            ),
        },
        {
            title: 'Thời gian',
            key: 'dateRange',
            render: (_, record) => (
                <div>
                    <div>{dayjs(record.startDate).format('DD/MM/YYYY')}</div>
                    <div>đến {dayjs(record.endDate).format('DD/MM/YYYY')}</div>
                </div>
            ),
        },
        {
            title: 'Sử dụng',
            key: 'usage',
            render: (_, record) => (
                <div>
                    <div>{record.usedCount}/{record.usageLimit}</div>
                    <div style={styles.conditionText}>
                        Còn lại: {record.usageLimit - record.usedCount}
                    </div>
                </div>
            ),
        },
        {
            title: 'Trạng thái',
            dataIndex: 'isActive',
            key: 'isActive',
            render: (isActive) => (
                <Tag 
                    color={isActive ? 'success' : 'default'} 
                    style={styles.statusTag}
                >
                    {isActive ? 'Hoạt động' : 'Tạm dừng'}
                </Tag>
            ),
        },
        {
            title: 'Thao tác',
            key: 'actions',
            render: (_, record) => (
                <Space>
                    <Button
                        type="primary"
                        size="small"
                        icon={<EyeOutlined />}
                        style={styles.actionButton}
                        onClick={() => handleEditVoucher(record)}
                    >
                        Xem
                    </Button>
                    <Button
                        type="default"
                        size="small"
                        icon={<EditOutlined />}
                        style={styles.actionButton}
                        onClick={() => handleEditVoucher(record)}
                    >
                        Sửa
                    </Button>
                    <Button
                        type={record.isActive ? 'default' : 'primary'}
                        size="small"
                        icon={<PoweroffOutlined />}
                        style={{
                            ...styles.actionButton,
                            color: record.isActive ? '#ff4d4f' : '#52c41a',
                            borderColor: record.isActive ? '#ff4d4f' : '#52c41a',
                        }}
                        onClick={() => handleToggleStatus(record.voucherId, record.isActive)}
                    >
                        {record.isActive ? 'Tắt' : 'Bật'}
                    </Button>
                    <Popconfirm
                        title="Bạn có chắc chắn muốn xóa voucher này?"
                        onConfirm={() => handleDeleteVoucher(record.voucherId)}
                        okText="Xóa"
                        cancelText="Hủy"
                        okType="danger"
                    >
                        <Button
                            type="primary"
                            danger
                            size="small"
                            icon={<DeleteOutlined />}
                            style={styles.actionButton}
                        >
                            Xóa
                        </Button>
                    </Popconfirm>
                </Space>
            ),
        },
    ];

    return (
        <AdminLayout>
            <div style={styles.container}>
                <div style={styles.header}>
                    <Row justify="space-between" align="middle">
                        <Col>
                            <Title level={2} style={styles.title}>
                                <GiftOutlined style={{ marginRight: '12px' }} />
                                Quản lý Voucher
                            </Title>
                            <div style={styles.subtitle}>
                                Tạo và quản lý các voucher giảm giá cho khách hàng
                            </div>
                        </Col>
                        <Col>
                            <Button
                                type="primary"
                                icon={<PlusOutlined />}
                                style={styles.addButton}
                                onClick={handleAddVoucher}
                            >
                                Thêm voucher mới
                            </Button>
                        </Col>
                    </Row>
                </div>

                <Card style={styles.card}>
                    <Table
                        columns={columns}
                        dataSource={vouchers}
                        rowKey="voucherId"
                        loading={loading}
                        pagination={{
                            pageSize: 10,
                            showSizeChanger: true,
                            showQuickJumper: true,
                            showTotal: (total, range) =>
                                `${range[0]}-${range[1]} của ${total} voucher`,
                        }}
                        scroll={{ x: 1200 }}
                    />
                </Card>

                <Modal
                    title={editingVoucher ? 'Cập nhật voucher' : 'Thêm voucher mới'}
                    open={modalVisible}
                    onCancel={() => setModalVisible(false)}
                    footer={null}
                    width={800}
                    destroyOnClose
                >
                    <Form
                        form={form}
                        layout="vertical"
                        onFinish={handleSubmit}
                    >
                        <Row gutter={16}>
                            <Col xs={24} md={12}>
                                <Form.Item
                                    label="Mã voucher"
                                    name="code"
                                    rules={[
                                        { required: true, message: 'Vui lòng nhập mã voucher!' },
                                        { pattern: /^[A-Z0-9]+$/, message: 'Mã chỉ chứa chữ hoa và số!' }
                                    ]}
                                >
                                    <Input placeholder="VD: NEWUSER10" />
                                </Form.Item>
                            </Col>
                            <Col xs={24} md={12}>
                                <Form.Item
                                    label="Tên voucher"
                                    name="name"
                                    rules={[{ required: true, message: 'Vui lòng nhập tên voucher!' }]}
                                >
                                    <Input placeholder="Tên hiển thị của voucher" />
                                </Form.Item>
                            </Col>
                        </Row>

                        <Form.Item
                            label="Mô tả"
                            name="description"
                            rules={[{ required: true, message: 'Vui lòng nhập mô tả!' }]}
                        >
                            <TextArea rows={2} placeholder="Mô tả chi tiết về voucher" />
                        </Form.Item>

                        <Divider>Cài đặt giảm giá</Divider>

                        <Row gutter={16}>
                            <Col xs={24} md={8}>
                                <Form.Item
                                    label="Loại giảm giá"
                                    name="discountType"
                                    rules={[{ required: true, message: 'Vui lòng chọn loại giảm giá!' }]}
                                >
                                    <Select placeholder="Chọn loại giảm giá">
                                        <Option value="percentage">Phần trăm (%)</Option>
                                        <Option value="fixed">Số tiền cố định (VNĐ)</Option>
                                    </Select>
                                </Form.Item>
                            </Col>
                            <Col xs={24} md={8}>
                                <Form.Item
                                    label="Giá trị giảm"
                                    name="discountValue"
                                    rules={[{ required: true, message: 'Vui lòng nhập giá trị giảm!' }]}
                                >
                                    <InputNumber
                                        style={{ width: '100%' }}
                                        min={0}
                                        placeholder="Nhập giá trị"
                                        formatter={value => `${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, ',')}
                                        parser={value => value.replace(/\$\s?|(,*)/g, '')}
                                    />
                                </Form.Item>
                            </Col>
                            <Col xs={24} md={8}>
                                <Form.Item
                                    label="Giảm tối đa (VNĐ)"
                                    name="maxDiscount"
                                    tooltip="Áp dụng cho voucher phần trăm"
                                >
                                    <InputNumber
                                        style={{ width: '100%' }}
                                        min={0}
                                        placeholder="Không giới hạn"
                                        formatter={value => `${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, ',')}
                                        parser={value => value.replace(/\$\s?|(,*)/g, '')}
                                    />
                                </Form.Item>
                            </Col>
                        </Row>

                        <Form.Item
                            label="Giá trị đơn hàng tối thiểu (VNĐ)"
                            name="minOrderValue"
                        >
                            <InputNumber
                                style={{ width: '100%' }}
                                min={0}
                                placeholder="Không yêu cầu tối thiểu"
                                formatter={value => `${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, ',')}
                                parser={value => value.replace(/\$\s?|(,*)/g, '')}
                            />
                        </Form.Item>

                        <Divider>Điều kiện áp dụng</Divider>

                        <Row gutter={16}>
                            <Col xs={24} md={12}>
                                <Form.Item
                                    label="Loại điều kiện"
                                    name="conditionType"
                                    rules={[{ required: true, message: 'Vui lòng chọn điều kiện áp dụng!' }]}
                                >
                                    <Select placeholder="Chọn điều kiện">
                                        <Option value="all_customers">Tất cả khách hàng</Option>
                                        <Option value="first_order">Khách hàng chưa từng mua</Option>
                                        <Option value="total_purchased">Tổng đã mua từ trước đến nay</Option>
                                        <Option value="order_value">Giá trị đơn hàng hiện tại</Option>
                                        <Option value="specific_date">Ngày cụ thể</Option>
                                    </Select>
                                </Form.Item>
                            </Col>
                            <Col xs={24} md={12}>
                                <Form.Item
                                    label="Giá trị điều kiện"
                                    name="conditionValue"
                                    tooltip="Giá trị cụ thể cho điều kiện đã chọn"
                                >
                                    <InputNumber
                                        style={{ width: '100%' }}
                                        min={0}
                                        placeholder="Nhập giá trị (nếu cần)"
                                        formatter={value => `${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, ',')}
                                        parser={value => value.replace(/\$\s?|(,*)/g, '')}
                                    />
                                </Form.Item>
                            </Col>
                        </Row>

                        <Divider>Thời gian và giới hạn</Divider>

                        <Row gutter={16}>
                            <Col xs={24} md={12}>
                                <Form.Item
                                    label="Thời gian áp dụng"
                                    name="dateRange"
                                    rules={[{ required: true, message: 'Vui lòng chọn thời gian áp dụng!' }]}
                                >
                                    <RangePicker style={{ width: '100%' }} />
                                </Form.Item>
                            </Col>
                            <Col xs={24} md={12}>
                                <Form.Item
                                    label="Giới hạn sử dụng"
                                    name="usageLimit"
                                    rules={[{ required: true, message: 'Vui lòng nhập giới hạn sử dụng!' }]}
                                >
                                    <InputNumber
                                        style={{ width: '100%' }}
                                        min={1}
                                        placeholder="Số lần sử dụng tối đa"
                                    />
                                </Form.Item>
                            </Col>
                        </Row>

                        <Form.Item
                            label="Trạng thái"
                            name="isActive"
                            valuePropName="checked"
                            initialValue={true}
                        >
                            <Switch checkedChildren="Hoạt động" unCheckedChildren="Tạm dừng" />
                        </Form.Item>

                        <Form.Item style={{ marginBottom: 0, textAlign: 'right' }}>
                            <Space>
                                <Button onClick={() => setModalVisible(false)}>
                                    Hủy
                                </Button>
                                <Button type="primary" htmlType="submit">
                                    {editingVoucher ? 'Cập nhật' : 'Tạo voucher'}
                                </Button>
                            </Space>
                        </Form.Item>
                    </Form>
                </Modal>
            </div>
        </AdminLayout>
    );
};

export default VoucherPage;
