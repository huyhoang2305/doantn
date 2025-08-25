import React from 'react';
import { Menu } from 'antd';
import { Link, useLocation } from 'react-router-dom';

const styles = {
    menu: {
        display: 'flex',
        justifyContent: 'center',
        background: '#001529',
        borderBottom: '1px solid rgba(255, 255, 255, 0.1)',
        padding: '0 50px',
        position: 'fixed',
        width: '100%',
        top: '64px',
        zIndex: 999,
    },
    menuItem: {
        color: '#fff',
        fontSize: '16px',
        padding: '0 30px',
        margin: '0 5px',
        transition: 'all 0.3s ease',
        borderRadius: '4px',
    },
    link: {
        color: '#fff',
        transition: 'all 0.3s ease',
    },
};

const Navigation = () => {
    const location = useLocation();

    const menuKeyMapping = {
        '/': '1',
        '/product': '2',
        '/about': '3',
        '/contact': '4',
    };

    const selectedKey = menuKeyMapping[location.pathname] || '1';

    return (
        <Menu
            theme="dark"
            mode="horizontal"
            selectedKeys={[selectedKey]}
            style={styles.menu}
        >
            <Menu.Item key="1" style={styles.menuItem}>
                <Link to="/" style={styles.link}>Trang Chủ</Link>
            </Menu.Item>
            <Menu.Item key="2" style={styles.menuItem}>
                <Link to="/product" style={styles.link}>Sản Phẩm</Link>
            </Menu.Item>
            <Menu.Item key="3" style={styles.menuItem}>
                <Link to="/about" style={styles.link}>Giới Thiệu</Link>
            </Menu.Item>
            <Menu.Item key="4" style={styles.menuItem}>
                <Link to="/contact" style={styles.link}>Liên Hệ</Link>
            </Menu.Item>
        </Menu>
    );
};

export default Navigation;
