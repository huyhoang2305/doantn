import React from 'react';
import { 
    Form, 
    Input, 
    Button, 
    Row, 
    Col, 
    Typography, 
    Card,
    message
} from 'antd';
import {
    EnvironmentOutlined,
    PhoneOutlined,
    MailOutlined,
    ClockCircleOutlined,
} from '@ant-design/icons';
import CustomerLayout from '../../layouts/CustomerLayout';

const { Title, Text } = Typography;
const { TextArea } = Input;

const styles = {
    container: {
        padding: '20px',
    },
    section: {
        marginBottom: '40px',
    },
    sectionTitle: {
        position: 'relative',
        marginBottom: '24px',
        color: '#001529',
        textAlign: 'center',
    },
    titleUnderline: {
        content: '""',
        position: 'absolute',
        bottom: '-8px',
        left: '50%',
        transform: 'translateX(-50%)',
        width: '60px',
        height: '3px',
        background: 'linear-gradient(90deg, #001529 0%, #003a70 100%)',
        borderRadius: '2px',
    },
    description: {
        fontSize: '16px',
        lineHeight: '1.8',
        color: '#666',
        textAlign: 'center',
        maxWidth: '800px',
        margin: '0 auto 40px',
    },
    card: {
        height: '100%',
        borderRadius: '12px',
        boxShadow: '0 4px 12px rgba(0,0,0,0.08)',
        transition: 'all 0.3s ease',
        border: 'none',
    },
    cardHover: {
        transform: 'translateY(-5px)',
        boxShadow: '0 8px 20px rgba(0,0,0,0.12)',
    },
    infoCard: {
        padding: '24px',
        height: '100%',
    },
    icon: {
        fontSize: '24px',
        color: '#001529',
        marginRight: '12px',
    },
    infoTitle: {
        fontSize: '18px',
        fontWeight: 'bold',
        color: '#001529',
        marginBottom: '12px',
        display: 'flex',
        alignItems: 'center',
    },
    infoText: {
        color: '#666',
        fontSize: '16px',
        marginLeft: '36px',
    },
    form: {
        maxWidth: '100%',
        padding: '24px',
        background: '#fff',
        borderRadius: '12px',
        boxShadow: '0 4px 12px rgba(0,0,0,0.08)',
    },
    formTitle: {
        color: '#001529',
        marginBottom: '24px',
        textAlign: 'center',
    },
    submitButton: {
        width: '100%',
        height: '40px',
        fontSize: '16px',
        background: 'linear-gradient(135deg, #001529 0%, #003a70 100%)',
        border: 'none',
        borderRadius: '8px',
        transition: 'all 0.3s ease',
    },
    map: {
        width: '100%',
        height: '300px',
        border: 'none',
        borderRadius: '12px',
        boxShadow: '0 4px 12px rgba(0,0,0,0.08)',
    },
};

const ContactPage = () => {
    const [form] = Form.useForm();
    const [hoveredCard, setHoveredCard] = React.useState(null);

    const onFinish = (values) => {
        console.log('Form values:', values);
        message.success('Cảm ơn bạn đã liên hệ với chúng tôi!');
        form.resetFields();
    };

    const contactInfo = [
        {
            id: 1,
            icon: <EnvironmentOutlined style={styles.icon} />,
            title: 'Địa Chỉ',
            content: '123 Đường ABC, Quận 1, TP.HCM'
        },
        {
            id: 2,
            icon: <PhoneOutlined style={styles.icon} />,
            title: 'Điện Thoại',
            content: '+84 123 456 789'
        },
        {
            id: 3,
            icon: <MailOutlined style={styles.icon} />,
            title: 'Email',
            content: 'contact@shoesshop.com'
        },
        {
            id: 4,
            icon: <ClockCircleOutlined style={styles.icon} />,
            title: 'Giờ Làm Việc',
            content: 'Thứ 2 - Chủ Nhật: 9:00 - 21:00'
        }
    ];

    return (
        <CustomerLayout>
            <div style={styles.container}>
                <div style={styles.section}>
                    <Title level={2} style={styles.sectionTitle}>
                        Liên Hệ Với Chúng Tôi
                        <div style={styles.titleUnderline} />
                    </Title>
                    <Text style={styles.description}>
                        Chúng tôi luôn sẵn sàng lắng nghe và hỗ trợ bạn. Hãy liên hệ với chúng tôi 
                        nếu bạn có bất kỳ câu hỏi hoặc góp ý nào.
                    </Text>
                </div>

                <Row gutter={[24, 24]}>
                    <Col xs={24} md={12}>
                        <Form
                            form={form}
                            layout="vertical"
                            onFinish={onFinish}
                            style={styles.form}
                        >
                            <Title level={3} style={styles.formTitle}>
                                Gửi Tin Nhắn
                            </Title>
                            <Form.Item
                                name="name"
                                label="Họ và Tên"
                                rules={[{ required: true, message: 'Vui lòng nhập họ tên!' }]}
                            >
                                <Input size="large" placeholder="Nhập họ và tên của bạn" />
                            </Form.Item>

                            <Form.Item
                                name="email"
                                label="Email"
                                rules={[
                                    { required: true, message: 'Vui lòng nhập email!' },
                                    { type: 'email', message: 'Email không hợp lệ!' }
                                ]}
                            >
                                <Input size="large" placeholder="Nhập email của bạn" />
                            </Form.Item>

                            <Form.Item
                                name="phone"
                                label="Số Điện Thoại"
                                rules={[{ required: true, message: 'Vui lòng nhập số điện thoại!' }]}
                            >
                                <Input size="large" placeholder="Nhập số điện thoại của bạn" />
                            </Form.Item>

                            <Form.Item
                                name="message"
                                label="Nội Dung"
                                rules={[{ required: true, message: 'Vui lòng nhập nội dung!' }]}
                            >
                                <TextArea
                                    rows={4}
                                    placeholder="Nhập nội dung tin nhắn của bạn"
                                />
                            </Form.Item>

                            <Form.Item>
                                <Button 
                                    type="primary" 
                                    htmlType="submit" 
                                    style={styles.submitButton}
                                    onMouseEnter={(e) => {
                                        e.currentTarget.style.opacity = '0.9';
                                        e.currentTarget.style.transform = 'translateY(-2px)';
                                    }}
                                    onMouseLeave={(e) => {
                                        e.currentTarget.style.opacity = '1';
                                        e.currentTarget.style.transform = 'translateY(0)';
                                    }}
                                >
                                    Gửi Tin Nhắn
                                </Button>
                            </Form.Item>
                        </Form>
                    </Col>

                    <Col xs={24} md={12}>
                        <Row gutter={[0, 24]}>
                            {contactInfo.map(info => (
                                <Col xs={24} key={info.id}>
                                    <Card
                                        style={{
                                            ...styles.card,
                                            ...(hoveredCard === info.id ? styles.cardHover : {})
                                        }}
                                        onMouseEnter={() => setHoveredCard(info.id)}
                                        onMouseLeave={() => setHoveredCard(null)}
                                    >
                                        <div style={styles.infoCard}>
                                            <div style={styles.infoTitle}>
                                                {info.icon}
                                                {info.title}
                                            </div>
                                            <Text style={styles.infoText}>
                                                {info.content}
                                            </Text>
                                        </div>
                                    </Card>
                                </Col>
                            ))}
                        </Row>

                        <div style={{ marginTop: '24px' }}>
                            <iframe
                                src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3919.4241674197956!2d106.69845731533417!3d10.775681162196!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x31752f4b3330bcc7%3A0x4db964d76bf6e18e!2zVHLGsOG7nW5nIMSQ4bqhaSBI4buNYyBLaG9hIEjhu41jIFThu7Egbmhpw6puIFRQLkhDTQ!5e0!3m2!1svi!2s!4v1625647641800!5m2!1svi!2s"
                                style={styles.map}
                                allowFullScreen=""
                                loading="lazy"
                                title="Location Map"
                            />
                        </div>
                    </Col>
                </Row>
            </div>
        </CustomerLayout>
    );
};

export default ContactPage;