import React, { useEffect, useState } from 'react';
import { 
    Form, 
    Input, 
    Button, 
    Card, 
    Typography, 
    Row, 
    Col, 
    message, 
    Spin, 
    Divider,
    Modal 
} from 'antd';
import { 
    UserOutlined, 
    MailOutlined, 
    PhoneOutlined, 
    HomeOutlined, 
    LockOutlined,
    EditOutlined,
    SaveOutlined 
} from '@ant-design/icons';
import CustomerLayout from '../../layouts/CustomerLayout';
import { getCustomerByEmail } from '../../services/home/HomeService';
import { jwtDecode } from 'jwt-decode';
import { useNavigate } from 'react-router-dom';

const { Title, Text } = Typography;

const styles = {
    container: {
        padding: '24px',
        minHeight: '70vh',
    },
    header: {
        marginBottom: '32px',
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
        marginBottom: '24px',
    },
    cardTitle: {
        color: '#001529',
        marginBottom: '16px',
        fontSize: '18px',
    },
    formItem: {
        marginBottom: '16px',
    },
    input: {
        borderRadius: '8px',
        height: '40px',
    },
    button: {
        height: '40px',
        borderRadius: '8px',
        fontSize: '16px',
    },
    primaryButton: {
        background: 'linear-gradient(135deg, #001529 0%, #003a70 100%)',
        border: 'none',
    },
    dangerButton: {
        background: 'linear-gradient(135deg, #ff4d4f 0%, #ff7875 100%)',
        border: 'none',
    },
    spinner: {
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        minHeight: '400px',
    },
    infoText: {
        color: '#666',
        fontSize: '14px',
        fontStyle: 'italic',
        marginTop: '8px',
    },
};

const ProfilePage = () => {
    const [profileForm] = Form.useForm();
    const [passwordForm] = Form.useForm();
    const [loading, setLoading] = useState(true);
    const [profileLoading, setProfileLoading] = useState(false);
    const [passwordLoading, setPasswordLoading] = useState(false);
    const [customerInfo, setCustomerInfo] = useState(null);
    const [isPasswordModalVisible, setIsPasswordModalVisible] = useState(false);
    const navigate = useNavigate();

    useEffect(() => {
        const fetchCustomerInfo = async () => {
            setLoading(true);
            try {
                const token = localStorage.getItem('jwt');
                if (!token) {
                    message.error('Vui lòng đăng nhập để xem thông tin cá nhân');
                    navigate('/login');
                    return;
                }

                const decodedToken = jwtDecode(token);
                const customerData = await getCustomerByEmail(decodedToken.sub);
                
                if (customerData) {
                    setCustomerInfo(customerData);
                    profileForm.setFieldsValue({
                        fullName: customerData.fullName,
                        email: customerData.email,
                        phone: customerData.phone,
                        address: customerData.address,
                        address2: customerData.address2 || '',
                        city: customerData.city,
                    });
                }
            } catch (error) {
                console.error('Error fetching customer info:', error);
                message.error('Không thể tải thông tin khách hàng');
            } finally {
                setLoading(false);
            }
        };

        fetchCustomerInfo();
    }, [navigate, profileForm]);

    const onUpdateProfile = async (values) => {
        setProfileLoading(true);
        try {
            // TODO: Implement updateCustomerProfile API call
            // await updateCustomerProfile(customerInfo.customerId, values);
            
            // Mock success for demo
            await new Promise(resolve => setTimeout(resolve, 1000));
            
            message.success('Cập nhật thông tin cá nhân thành công!');
            
            // Update local state
            setCustomerInfo(prev => ({
                ...prev,
                ...values
            }));
        } catch (error) {
            console.error('Error updating profile:', error);
            message.error('Có lỗi xảy ra khi cập nhật thông tin');
        } finally {
            setProfileLoading(false);
        }
    };

    const onChangePassword = async (values) => {
        setPasswordLoading(true);
        try {
            // TODO: Implement changeCustomerPassword API call
            // await changeCustomerPassword(customerInfo.customerId, values);
            
            // Mock success for demo
            await new Promise(resolve => setTimeout(resolve, 1000));
            
            message.success('Đổi mật khẩu thành công!');
            setIsPasswordModalVisible(false);
            passwordForm.resetFields();
        } catch (error) {
            console.error('Error changing password:', error);
            message.error('Có lỗi xảy ra khi đổi mật khẩu');
        } finally {
            setPasswordLoading(false);
        }
    };

    const showPasswordModal = () => {
        setIsPasswordModalVisible(true);
    };

    const handlePasswordModalCancel = () => {
        setIsPasswordModalVisible(false);
        passwordForm.resetFields();
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
                        Thông tin cá nhân
                    </Title>
                    <Text style={styles.subtitle}>
                        {customerInfo ? `Xin chào ${customerInfo.fullName}, q` : 'Q'}uản lý thông tin tài khoản và bảo mật của bạn
                    </Text>
                </div>

                <Row gutter={[24, 24]}>
                    <Col xs={24} lg={16}>
                        <Card style={styles.card}>
                            <Title level={4} style={styles.cardTitle}>
                                <UserOutlined style={{ marginRight: '8px' }} />
                                Thông tin cá nhân
                            </Title>
                            
                            <Form
                                form={profileForm}
                                layout="vertical"
                                onFinish={onUpdateProfile}
                            >
                                <Row gutter={16}>
                                    <Col xs={24} md={12}>
                                        <Form.Item
                                            label="Họ và tên"
                                            name="fullName"
                                            rules={[{ required: true, message: 'Vui lòng nhập họ tên!' }]}
                                            style={styles.formItem}
                                        >
                                            <Input 
                                                prefix={<UserOutlined />}
                                                style={styles.input}
                                                placeholder="Nhập họ và tên"
                                            />
                                        </Form.Item>
                                    </Col>
                                    <Col xs={24} md={12}>
                                        <Form.Item
                                            label="Email"
                                            name="email"
                                            style={styles.formItem}
                                        >
                                            <Input 
                                                prefix={<MailOutlined />}
                                                style={styles.input}
                                                disabled
                                                placeholder="Email"
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
                                            style={styles.formItem}
                                        >
                                            <Input 
                                                prefix={<PhoneOutlined />}
                                                style={styles.input}
                                                placeholder="Nhập số điện thoại"
                                            />
                                        </Form.Item>
                                    </Col>
                                    <Col xs={24} md={12}>
                                        <Form.Item
                                            label="Thành phố"
                                            name="city"
                                            rules={[{ required: true, message: 'Vui lòng nhập thành phố!' }]}
                                            style={styles.formItem}
                                        >
                                            <Input 
                                                prefix={<HomeOutlined />}
                                                style={styles.input}
                                                placeholder="Nhập thành phố"
                                            />
                                        </Form.Item>
                                    </Col>
                                </Row>

                                <Form.Item
                                    label="Địa chỉ"
                                    name="address"
                                    rules={[{ required: true, message: 'Vui lòng nhập địa chỉ!' }]}
                                    style={styles.formItem}
                                >
                                    <Input 
                                        prefix={<HomeOutlined />}
                                        style={styles.input}
                                        placeholder="Nhập địa chỉ"
                                    />
                                </Form.Item>

                                <Form.Item
                                    label="Địa chỉ bổ sung (tùy chọn)"
                                    name="address2"
                                    style={styles.formItem}
                                >
                                    <Input 
                                        prefix={<HomeOutlined />}
                                        style={styles.input}
                                        placeholder="Nhập địa chỉ bổ sung"
                                    />
                                </Form.Item>

                                <Text style={styles.infoText}>
                                    * Email không thể thay đổi. Nếu bạn muốn thay đổi email, vui lòng liên hệ bộ phận hỗ trợ.
                                </Text>

                                <Divider />

                                <Form.Item>
                                    <Button
                                        type="primary"
                                        htmlType="submit"
                                        loading={profileLoading}
                                        style={{ ...styles.button, ...styles.primaryButton }}
                                        icon={<SaveOutlined />}
                                    >
                                        Cập nhật thông tin
                                    </Button>
                                </Form.Item>
                            </Form>
                        </Card>
                    </Col>

                    <Col xs={24} lg={8}>
                        <Card style={styles.card}>
                            <Title level={4} style={styles.cardTitle}>
                                <LockOutlined style={{ marginRight: '8px' }} />
                                Bảo mật tài khoản
                            </Title>
                            
                            <Text style={{ display: 'block', marginBottom: '16px', color: '#666' }}>
                                Đảm bảo tài khoản của bạn an toàn bằng cách sử dụng mật khẩu mạnh.
                            </Text>

                            <Button
                                type="primary"
                                danger
                                style={{ ...styles.button, ...styles.dangerButton }}
                                icon={<EditOutlined />}
                                onClick={showPasswordModal}
                                block
                            >
                                Đổi mật khẩu
                            </Button>

                            <Text style={styles.infoText}>
                                Mật khẩu nên có ít nhất 8 ký tự, bao gồm chữ hoa, chữ thường và số.
                            </Text>
                        </Card>
                    </Col>
                </Row>

                {/* Change Password Modal */}
                <Modal
                    title="Đổi mật khẩu"
                    open={isPasswordModalVisible}
                    onCancel={handlePasswordModalCancel}
                    footer={null}
                    destroyOnClose
                >
                    <Form
                        form={passwordForm}
                        layout="vertical"
                        onFinish={onChangePassword}
                    >
                        <Form.Item
                            label="Mật khẩu hiện tại"
                            name="currentPassword"
                            rules={[{ required: true, message: 'Vui lòng nhập mật khẩu hiện tại!' }]}
                        >
                            <Input.Password 
                                prefix={<LockOutlined />}
                                style={styles.input}
                                placeholder="Nhập mật khẩu hiện tại"
                            />
                        </Form.Item>

                        <Form.Item
                            label="Mật khẩu mới"
                            name="newPassword"
                            rules={[
                                { required: true, message: 'Vui lòng nhập mật khẩu mới!' },
                                { min: 8, message: 'Mật khẩu phải có ít nhất 8 ký tự!' }
                            ]}
                        >
                            <Input.Password 
                                prefix={<LockOutlined />}
                                style={styles.input}
                                placeholder="Nhập mật khẩu mới"
                            />
                        </Form.Item>

                        <Form.Item
                            label="Xác nhận mật khẩu mới"
                            name="confirmPassword"
                            dependencies={['newPassword']}
                            rules={[
                                { required: true, message: 'Vui lòng xác nhận mật khẩu mới!' },
                                ({ getFieldValue }) => ({
                                    validator(_, value) {
                                        if (!value || getFieldValue('newPassword') === value) {
                                            return Promise.resolve();
                                        }
                                        return Promise.reject(new Error('Mật khẩu xác nhận không khớp!'));
                                    },
                                }),
                            ]}
                        >
                            <Input.Password 
                                prefix={<LockOutlined />}
                                style={styles.input}
                                placeholder="Xác nhận mật khẩu mới"
                            />
                        </Form.Item>

                        <Form.Item style={{ marginBottom: 0, marginTop: '24px' }}>
                            <Row gutter={12}>
                                <Col span={12}>
                                    <Button 
                                        onClick={handlePasswordModalCancel}
                                        style={styles.button}
                                        block
                                    >
                                        Hủy
                                    </Button>
                                </Col>
                                <Col span={12}>
                                    <Button
                                        type="primary"
                                        htmlType="submit"
                                        loading={passwordLoading}
                                        style={{ ...styles.button, ...styles.primaryButton }}
                                        block
                                    >
                                        Đổi mật khẩu
                                    </Button>
                                </Col>
                            </Row>
                        </Form.Item>
                    </Form>
                </Modal>
            </div>
        </CustomerLayout>
    );
};

export default ProfilePage;
