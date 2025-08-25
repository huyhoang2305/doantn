import React from 'react';
import { Typography, Row, Col, Card } from 'antd';
import { 
    TeamOutlined, 
    HeartOutlined, 
    EnvironmentOutlined,
    CheckCircleOutlined 
} from '@ant-design/icons';
import CustomerLayout from '../../layouts/CustomerLayout';

const { Title, Paragraph, Text } = Typography;

const styles = {
    container: {
        padding: '20px',
    },
    section: {
        marginBottom: '48px',
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
    icon: {
        fontSize: '36px',
        color: '#001529',
        marginBottom: '16px',
    },
    valueCard: {
        textAlign: 'center',
        padding: '24px',
    },
    valueTitle: {
        color: '#001529',
        marginTop: '16px',
        marginBottom: '12px',
    },
    description: {
        fontSize: '16px',
        lineHeight: '1.8',
        color: '#666',
        textAlign: 'center',
        maxWidth: '800px',
        margin: '0 auto 40px',
    },
    missionList: {
        marginTop: '24px',
    },
    missionItem: {
        display: 'flex',
        alignItems: 'flex-start',
        marginBottom: '16px',
        padding: '16px',
        background: '#f8f9fa',
        borderRadius: '8px',
        transition: 'all 0.3s ease',
    },
    missionIcon: {
        color: '#001529',
        fontSize: '20px',
        marginRight: '16px',
        marginTop: '4px',
    },
    missionText: {
        flex: 1,
        fontSize: '16px',
        color: '#444',
    },
};

const AboutPage = () => {
    const [hoveredCard, setHoveredCard] = React.useState(null);

    const values = [
        {
            id: 1,
            icon: <TeamOutlined />,
            title: 'Khách Hàng Là Trọng Tâm',
            description: 'Chúng tôi luôn đặt nhu cầu và sự hài lòng của khách hàng lên hàng đầu.'
        },
        {
            id: 2,
            icon: <HeartOutlined />,
            title: 'Chất Lượng Vượt Trội',
            description: 'Cam kết mang đến những sản phẩm chất lượng cao với giá cả hợp lý.'
        },
        {
            id: 3,
            icon: <EnvironmentOutlined />,
            title: 'Trách Nhiệm Môi Trường',
            description: 'Chúng tôi luôn quan tâm đến việc bảo vệ môi trường trong mọi hoạt động.'
        }
    ];

    const missions = [
        'Cung cấp các sản phẩm giày dép chất lượng cao với giá cả phải chăng',
        'Xây dựng môi trường mua sắm trực tuyến an toàn và thuận tiện',
        'Thúc đẩy xu hướng giày dép bền vững và thân thiện với môi trường',
        'Tạo ra trải nghiệm mua sắm độc đáo và cá nhân hóa cho khách hàng'
    ];

    return (
        <CustomerLayout>
            <div style={styles.container}>
                <div style={styles.section}>
                    <Title level={2} style={styles.sectionTitle}>
                        Về Chúng Tôi
                        <div style={styles.titleUnderline} />
                    </Title>
                    <Paragraph style={styles.description}>
                        ShoesShop là điểm đến lý tưởng cho những người yêu thích giày dép chất lượng. 
                        Với hơn 5 năm kinh nghiệm trong ngành, chúng tôi tự hào mang đến những sản phẩm giày dép 
                        chất lượng cao, thân thiện với môi trường và theo kịp xu hướng giày dép hiện đại.
                    </Paragraph>
                </div>

                <div style={styles.section}>
                    <Title level={2} style={styles.sectionTitle}>
                        Giá Trị Cốt Lõi
                        <div style={styles.titleUnderline} />
                    </Title>
                    <Row gutter={[24, 24]} style={{ marginTop: '40px' }}>
                        {values.map(value => (
                            <Col xs={24} sm={24} md={8} key={value.id}>
                                <Card
                                    style={{
                                        ...styles.card,
                                        ...(hoveredCard === value.id ? styles.cardHover : {})
                                    }}
                                    onMouseEnter={() => setHoveredCard(value.id)}
                                    onMouseLeave={() => setHoveredCard(null)}
                                >
                                    <div style={styles.valueCard}>
                                        <div style={styles.icon}>{value.icon}</div>
                                        <Title level={4} style={styles.valueTitle}>
                                            {value.title}
                                        </Title>
                                        <Text style={{ color: '#666' }}>
                                            {value.description}
                                        </Text>
                                    </div>
                                </Card>
                            </Col>
                        ))}
                    </Row>
                </div>

                <div style={styles.section}>
                    <Title level={2} style={styles.sectionTitle}>
                        Sứ Mệnh
                        <div style={styles.titleUnderline} />
                    </Title>
                    <div style={styles.missionList}>
                        {missions.map((mission, index) => (
                            <div 
                                key={index} 
                                style={styles.missionItem}
                                onMouseEnter={(e) => {
                                    e.currentTarget.style.transform = 'translateX(10px)';
                                    e.currentTarget.style.background = '#f0f2f5';
                                }}
                                onMouseLeave={(e) => {
                                    e.currentTarget.style.transform = 'translateX(0)';
                                    e.currentTarget.style.background = '#f8f9fa';
                                }}
                            >
                                <CheckCircleOutlined style={styles.missionIcon} />
                                <Text style={styles.missionText}>{mission}</Text>
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        </CustomerLayout>
    );
};

export default AboutPage;