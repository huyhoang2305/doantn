import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Card, Typography, Tag } from 'antd';
import { ShoppingCartOutlined } from '@ant-design/icons';

const { Text, Title } = Typography;

const styles = {
    card: {
        overflow: 'hidden',
        borderRadius: '12px',
        border: '1px solid #f0f0f0',
        transition: 'all 0.3s ease',
        cursor: 'pointer',
        height: '100%',
        display: 'flex',
        flexDirection: 'column',
    },
    cardHover: {
        transform: 'translateY(-5px)',
        boxShadow: '0 8px 20px rgba(0,0,0,0.12)',
    },
    imageContainer: {
        overflow: 'hidden',
        position: 'relative',
        paddingTop: '100%', // 1:1 Aspect ratio
    },
    image: {
        position: 'absolute',
        top: 0,
        left: 0,
        width: '100%',
        height: '100%',
        objectFit: 'cover',
        transition: 'transform 0.3s ease',
    },
    imageHover: {
        transform: 'scale(1.05)',
    },
    content: {
        padding: '16px',
        flex: 1,
        display: 'flex',
        flexDirection: 'column',
    },
    name: {
        fontSize: '16px',
        fontWeight: '600',
        marginBottom: '8px',
        color: '#001529',
        lineHeight: '1.4',
        overflow: 'hidden',
        textOverflow: 'ellipsis',
        display: '-webkit-box',
        WebkitLineClamp: 2,
        WebkitBoxOrient: 'vertical',
    },
    price: {
        fontSize: '18px',
        color: '#f50',
        fontWeight: 'bold',
        marginTop: 'auto',
    },
    priceTag: {
        background: '#fff3f0',
        border: 'none',
        borderRadius: '4px',
        padding: '4px 8px',
    },
    cartIcon: {
        marginLeft: '8px',
        fontSize: '16px',
    },
};

const ProductCard = ({ product }) => {
    const navigate = useNavigate();
    const [isHovered, setIsHovered] = React.useState(false);

    const handleMouseEnter = () => setIsHovered(true);
    const handleMouseLeave = () => setIsHovered(false);

    return (
        <Card
            style={{
                ...styles.card,
                ...(isHovered ? styles.cardHover : {})
            }}
            bodyStyle={{ padding: 0 }}
            onMouseEnter={handleMouseEnter}
            onMouseLeave={handleMouseLeave}
            onClick={() => navigate(`/product/${product.productId}`)}
            cover={
                <div style={styles.imageContainer}>
                    <img
                        src={product.imageUrl}
                        alt={product.productName}
                        style={{
                            ...styles.image,
                            ...(isHovered ? styles.imageHover : {})
                        }}
                    />
                </div>
            }
        >
            <div style={styles.content}>
                <Title level={5} style={styles.name}>
                    {product.productName}
                </Title>
                <Tag style={styles.priceTag}>
                    <Text style={styles.price}>
                        {product.unitPrice.toLocaleString('vi-VN')} VNĐ
                        <ShoppingCartOutlined style={styles.cartIcon} />
                    </Text>
                </Tag>
            </div>
        </Card>
    );
};

export default ProductCard;