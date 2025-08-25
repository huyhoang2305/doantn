import React from 'react';
import { Layout, Row, Col, Typography, Divider } from 'antd';
import { 
    FacebookOutlined, 
    InstagramOutlined, 
    TwitterOutlined,
    EnvironmentOutlined,
    PhoneOutlined,
    MailOutlined
} from '@ant-design/icons';

const { Footer: AntFooter } = Layout;
const { Title, Text, Link } = Typography;

const styles = {
    footer: {
        textAlign: 'left',
        background: 'linear-gradient(135deg, #001529 0%, #003a70 100%)',
        color: '#fff',
        padding: '48px 50px 24px',
        fontSize: '14px',
        boxShadow: '0 -2px 8px rgba(0,0,0,0.1)',
    },
    section: {
        marginBottom: '24px',
    },
    sectionTitle: {
        color: '#fff',
        fontSize: '18px',
        marginBottom: '16px',
        fontWeight: 'bold',
    },
    text: {
        color: 'rgba(255, 255, 255, 0.85)',
        marginBottom: '8px',
        display: 'block',
    },
    icon: {
        marginRight: '8px',
        fontSize: '16px',
    },
    socialIcon: {
        fontSize: '24px',
        color: '#fff',
        marginRight: '16px',
        transition: 'all 0.3s ease',
        cursor: 'pointer',
    },
    socialIconHover: {
        transform: 'translateY(-3px)',
        color: '#1890ff',
    },
    divider: {
        background: 'rgba(255, 255, 255, 0.1)',
        margin: '24px 0',
    },
    copyright: {
        textAlign: 'center',
        color: 'rgba(255, 255, 255, 0.65)',
        marginTop: '24px',
    },
    contactItem: {
        display: 'flex',
        alignItems: 'center',
        marginBottom: '12px',
    },
    link: {
        color: 'rgba(255, 255, 255, 0.85)',
        transition: 'color 0.3s ease',
    },
    linkHover: {
        color: '#1890ff',
    }
};

const Footer = () => {
    const [hoveredIcon, setHoveredIcon] = React.useState(null);
    const [hoveredLink, setHoveredLink] = React.useState(null);

    return (
        <AntFooter style={styles.footer}>
            <Row gutter={[32, 24]}>
                <Col xs={24} sm={24} md={8}>
                    <div style={styles.section}>
                        <Title level={4} style={styles.sectionTitle}>Về ShoesShop</Title>
                        <Text style={styles.text}>
                            ShoesShop là điểm đến lý tưởng cho những người yêu thích giày dép chất lượng. 
                            Chúng tôi cam kết mang đến những sản phẩm giày dép chất lượng cao với giá cả hợp lý.
                        </Text>
                    </div>
                </Col>
                
                <Col xs={24} sm={12} md={8}>
                    <div style={styles.section}>
                        <Title level={4} style={styles.sectionTitle}>Liên Hệ</Title>
                        <div style={styles.contactItem}>
                            <EnvironmentOutlined style={styles.icon} />
                            <Text style={styles.text}>123 Đường ABC, Quận 1, TP.HCM</Text>
                        </div>
                        <div style={styles.contactItem}>
                            <PhoneOutlined style={styles.icon} />
                            <Text style={styles.text}>+84 123 456 789</Text>
                        </div>
                        <div style={styles.contactItem}>
                            <MailOutlined style={styles.icon} />
                            <Text style={styles.text}>contact@shoesshop.com</Text>
                        </div>
                    </div>
                </Col>

                <Col xs={24} sm={12} md={8}>
                    <div style={styles.section}>
                        <Title level={4} style={styles.sectionTitle}>Chính Sách</Title>
                        <Link 
                            href="#" 
                            style={{
                                ...styles.link,
                                ...(hoveredLink === 'shipping' ? styles.linkHover : {})
                            }}
                            onMouseEnter={() => setHoveredLink('shipping')}
                            onMouseLeave={() => setHoveredLink(null)}
                        >
                            <Text style={styles.text}>Chính sách vận chuyển</Text>
                        </Link>
                        <Link 
                            href="#" 
                            style={{
                                ...styles.link,
                                ...(hoveredLink === 'return' ? styles.linkHover : {})
                            }}
                            onMouseEnter={() => setHoveredLink('return')}
                            onMouseLeave={() => setHoveredLink(null)}
                        >
                            <Text style={styles.text}>Chính sách đổi trả</Text>
                        </Link>
                        <Link 
                            href="#" 
                            style={{
                                ...styles.link,
                                ...(hoveredLink === 'privacy' ? styles.linkHover : {})
                            }}
                            onMouseEnter={() => setHoveredLink('privacy')}
                            onMouseLeave={() => setHoveredLink(null)}
                        >
                            <Text style={styles.text}>Chính sách bảo mật</Text>
                        </Link>
                    </div>
                </Col>
            </Row>

            <Divider style={styles.divider} />

            <div style={styles.section}>
                <FacebookOutlined 
                    style={{
                        ...styles.socialIcon,
                        ...(hoveredIcon === 'facebook' ? styles.socialIconHover : {})
                    }}
                    onMouseEnter={() => setHoveredIcon('facebook')}
                    onMouseLeave={() => setHoveredIcon(null)}
                />
                <InstagramOutlined 
                    style={{
                        ...styles.socialIcon,
                        ...(hoveredIcon === 'instagram' ? styles.socialIconHover : {})
                    }}
                    onMouseEnter={() => setHoveredIcon('instagram')}
                    onMouseLeave={() => setHoveredIcon(null)}
                />
                <TwitterOutlined 
                    style={{
                        ...styles.socialIcon,
                        ...(hoveredIcon === 'twitter' ? styles.socialIconHover : {})
                    }}
                    onMouseEnter={() => setHoveredIcon('twitter')}
                    onMouseLeave={() => setHoveredIcon(null)}
                />
            </div>

            <div style={styles.copyright}>
                ShoesShop ©2024 Created by Your Name | All Rights Reserved
            </div>
        </AntFooter>
    );
};

export default Footer;