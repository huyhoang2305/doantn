import React from 'react';
import { Layout, Breadcrumb } from 'antd';
import { Link, useLocation } from 'react-router-dom';
import Header from '../components/layout/Header';
import Navigation from '../components/layout/Navigation';
import Footer from '../components/layout/Footer';

const { Content } = Layout;

const styles = {
    layout: {
        minHeight: '100vh',
        background: '#f0f2f5',
    },
    content: {
        padding: '134px 50px 50px',
        background: '#f0f2f5',
        minHeight: 'calc(100vh - 64px)',
    },
    breadcrumb: {
        margin: '0 0 16px',
        fontSize: '14px',
        padding: '12px 24px',
        background: '#fff',
        borderRadius: '8px',
        boxShadow: '0 2px 8px rgba(0,0,0,0.06)',
    },
    contentArea: {
        background: '#fff',
        padding: '32px',
        minHeight: '280px',
        borderRadius: '12px',
        boxShadow: '0 4px 12px rgba(0,0,0,0.08)',
        transition: 'all 0.3s ease',
    },
};

const CustomerLayout = ({ children }) => {
    const location = useLocation();

    // Convert path into breadcrumb items
    const pathnames = location.pathname.split('/').filter((x) => x);
    const breadcrumbItems = pathnames.map((_, index) => {
        const url = `/${pathnames.slice(0, index + 1).join('/')}`;
        return (
            <Breadcrumb.Item key={url}>
                <Link to={url}>{pathnames[index]}</Link>
            </Breadcrumb.Item>
        );
    });

    // Add home as the first breadcrumb
    breadcrumbItems.unshift(
        <Breadcrumb.Item key="/">
            <Link to="/">Trang Chủ</Link>
        </Breadcrumb.Item>
    );

    return (
        <Layout style={styles.layout}>
            <Header />
            <Navigation />
            <Content style={styles.content}>
                <Breadcrumb style={styles.breadcrumb}>
                    {breadcrumbItems}
                </Breadcrumb>
                <div style={styles.contentArea}>{children}</div>
            </Content>
            <Footer />
        </Layout>
    );
};

export default CustomerLayout;
