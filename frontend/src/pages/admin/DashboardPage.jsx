import React, { useState, useEffect } from 'react';
import { Row, Col, Card, DatePicker, Spin, Alert, List, Typography, Tag } from 'antd';
import { Area } from '@ant-design/plots';
import { 
  DollarCircleOutlined, 
  ShoppingOutlined, 
  UserOutlined, 
  RiseOutlined,
  ShopOutlined,
  TagsOutlined,
  PictureOutlined,
  TrophyOutlined 
} from '@ant-design/icons';
import { useNavigate } from 'react-router-dom';
import AdminLayout from '../../layouts/AdminLayout';
import StatisticService from '../../services/admin/StatisticService';
import moment from 'moment';

const { Text } = Typography;

const styles = {
  alert: {
    marginBottom: '24px'
  },
  card: {
    borderRadius: '12px',
    boxShadow: '0 2px 8px rgba(0,0,0,0.1)',
    transition: 'all 0.3s ease',
    height: '100%'
  },
  icon: {
    fontSize: '24px',
    padding: '12px',
    borderRadius: '12px',
    marginRight: '16px'
  },
  statContainer: {
    display: 'flex',
    alignItems: 'center'
  },
  statLabel: {
    color: '#8c8c8c',
    fontSize: '14px',
    marginBottom: '4px'
  },
  statValue: {
    fontSize: '24px',
    fontWeight: 'bold',
    color: '#001529'
  },
  bestSellingCard: {
    height: '100%'
  }
};

const StatisticCard = ({ icon: Icon, iconStyle, label, value, onClick, clickable = false }) => (
  <Card 
    style={{
      ...styles.card,
      cursor: clickable ? 'pointer' : 'default'
    }} 
    hoverable={clickable}
    onClick={clickable ? onClick : undefined}
  >
    <div style={styles.statContainer}>
      <Icon style={{ ...styles.icon, ...iconStyle }} />
      <div>
        <div style={styles.statLabel}>{label}</div>
        <div style={styles.statValue}>{value}</div>
      </div>
    </div>
  </Card>
);

const BestSellingProducts = ({ products = [], loading }) => {
  const getTagColor = (index) => {
    switch (index) {
      case 0: return 'gold';
      case 1: return 'silver';
      case 2: return '#cd7f32';
      default: return 'default';
    }
  };

  return (
    <Card
      title={
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
          <TrophyOutlined style={{ color: '#faad14' }} />
          <span>Sản Phẩm Bán Chạy</span>
        </div>
      }
      style={{ ...styles.card, ...styles.bestSellingCard }}
      loading={loading}
    >
      <List
        dataSource={products}
        renderItem={(item, index) => (
          <List.Item>
            <div style={{ width: '100%', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                <Tag color={getTagColor(index)} style={{ minWidth: '24px', textAlign: 'center' }}>
                  #{index + 1}
                </Tag>
                <Text ellipsis style={{ maxWidth: '200px' }}>{item.productName}</Text>
              </div>
              <Text strong>{item.totalQuantitySold} đã bán</Text>
            </div>
          </List.Item>
        )}
      />
    </Card>
  );
};

const DashboardPage = () => {
  const navigate = useNavigate();
  const [selectedDate, setSelectedDate] = useState(moment());
  const [statistics, setStatistics] = useState(null);
  const [monthlyStats, setMonthlyStats] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetchStatistics();
  }, [selectedDate]);

  const fetchStatistics = async () => {
    setLoading(true);
    try {
      const [todayStats, monthlyStats] = await Promise.all([
        StatisticService.getStatisticsToday(),
        StatisticService.getMonthlyStatisticsForYear()
      ]);

      setStatistics(todayStats);
      setMonthlyStats(monthlyStats.map((item, index) => ({
        month: moment().month(index).format('MM/YYYY'),
        value: item.totalRevenue
      })));
      setError(null);
    } catch (err) {
      setError('Không thể tải dữ liệu thống kê. Vui lòng thử lại sau.');
    } finally {
      setLoading(false);
    }
  };

  const handleRevenueClick = () => {
    navigate('/admin/revenue');
  };

  const statisticsConfig = [
    {
      icon: DollarCircleOutlined,
      iconStyle: { backgroundColor: '#e6f7ff', color: '#1890ff' },
      label: 'Doanh Thu',
      value: `${statistics?.totalRevenue?.toLocaleString('vi-VN')} ₫`,
      clickable: true,
      onClick: handleRevenueClick
    },
    {
      icon: ShoppingOutlined,
      iconStyle: { backgroundColor: '#f6ffed', color: '#52c41a' },
      label: 'Đơn Hàng',
      value: statistics?.totalOrders?.toLocaleString('vi-VN')
    },
    {
      icon: UserOutlined,
      iconStyle: { backgroundColor: '#fff7e6', color: '#fa8c16' },
      label: 'Khách Hàng',
      value: statistics?.totalCustomers?.toLocaleString('vi-VN')
    },
    {
      icon: ShopOutlined,
      iconStyle: { backgroundColor: '#f9f0ff', color: '#722ed1' },
      label: 'Thương Hiệu',
      value: statistics?.totalBrands?.toLocaleString('vi-VN')
    },
    {
      icon: TagsOutlined,
      iconStyle: { backgroundColor: '#fff2e8', color: '#fa541c' },
      label: 'Danh Mục',
      value: statistics?.totalCategories?.toLocaleString('vi-VN')
    },
    {
      icon: PictureOutlined,
      iconStyle: { backgroundColor: '#e6fffb', color: '#13c2c2' },
      label: 'Banner',
      value: statistics?.totalBanners?.toLocaleString('vi-VN')
    },
    {
      icon: ShoppingOutlined,
      iconStyle: { backgroundColor: '#fcffe6', color: '#a0d911' },
      label: 'Sản Phẩm',
      value: statistics?.totalProducts?.toLocaleString('vi-VN')
    }
  ];

  const chartConfig = {
    data: monthlyStats,
    xField: 'month',
    yField: 'value',
    smooth: true,
    areaStyle: {
      fill: 'l(270) 0:#ffffff 0.5:#7ec2f3 1:#1890ff'
    },
    line: {
      color: '#1890ff'
    },
    point: {
      size: 5,
      shape: 'diamond',
      style: {
        fill: 'white',
        stroke: '#1890ff',
        lineWidth: 2
      }
    },
    tooltip: {
      showMarkers: false,
      formatter: (datum) => ({
        name: 'Doanh Thu',
        value: `${datum.value.toLocaleString('vi-VN')} ₫`
      })
    },
    yAxis: {
      label: {
        formatter: (value) => `${(value / 1000000).toFixed(0)}M ₫`
      }
    }
  };

  return (
    <AdminLayout>
      <div>
        {error && (
          <Alert
            message="Lỗi"
            description={error}
            type="error"
            showIcon
            style={styles.alert}
          />
        )}

        <Spin spinning={loading}>
          <Row gutter={[16, 16]}>
            {statisticsConfig.map((stat, index) => (
              <Col xs={24} sm={12} lg={6} key={index}>
                <StatisticCard
                  icon={stat.icon}
                  iconStyle={stat.iconStyle}
                  label={stat.label}
                  value={stat.value}
                  clickable={stat.clickable}
                  onClick={stat.onClick}
                />
              </Col>
            ))}

            <Col xs={24} lg={16}>
              <Card
                title="Doanh Thu Theo Tháng"
                style={styles.card}
                bodyStyle={{ height: '400px', padding: '20px' }}
              >
                <Area {...chartConfig} />
              </Card>
            </Col>

            <Col xs={24} lg={8}>
              <BestSellingProducts 
                products={statistics?.bestSellingProducts} 
                loading={loading}
              />
            </Col>
          </Row>
        </Spin>
      </div>
    </AdminLayout>
  );
};

export default DashboardPage;