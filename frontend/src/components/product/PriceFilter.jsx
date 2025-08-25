import React from 'react';
import { Slider, Typography } from 'antd';

const { Title } = Typography;

const styles = {
    container: {
        marginBottom: '24px',
        padding: '16px',
        background: '#fff',
        borderRadius: '8px',
        boxShadow: '0 2px 8px rgba(0,0,0,0.06)',
    },
    title: {
        marginBottom: '16px',
        fontSize: '16px',
        fontWeight: 'bold',
    },
    priceRange: {
        marginTop: '8px',
        color: '#666',
        fontSize: '14px',
    }
};

const PriceFilter = ({ onPriceChange }) => {
    const [range, setRange] = React.useState([0, 10000000]);

    const handleChange = (value) => {
        setRange(value);
        onPriceChange(value);
    };

    return (
        <div style={styles.container}>
            <Title level={5} style={styles.title}>Khoảng Giá</Title>
            <Slider
                range
                min={0}
                max={10000000}
                step={100000}
                value={range}
                onChange={handleChange}
            />
            <div style={styles.priceRange}>
                {range[0].toLocaleString('vi-VN')} VNĐ - {range[1].toLocaleString('vi-VN')} VNĐ
            </div>
        </div>
    );
};

export default PriceFilter;