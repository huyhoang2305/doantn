import React, { useState, useEffect } from 'react';
import { 
  Row, 
  Col, 
  Card, 
  DatePicker, 
  Select, 
  Table, 
  Spin, 
  Alert, 
  Statistic,
  Typography 
} from 'antd';
import { Line, Column } from '@ant-design/plots';
import { 
  DollarCircleOutlined, 
  CalendarOutlined,
  BarChartOutlined,
  LineChartOutlined
} from '@ant-design/icons';
import AdminLayout from '../../layouts/AdminLayout';
import StatisticService from '../../services/admin/StatisticService';
import moment from 'moment';

const { RangePicker } = DatePicker;
const { Option } = Select;
const { Title } = Typography;

const RevenuePage = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [revenueData, setRevenueData] = useState([]);
  const [viewType, setViewType] = useState('day'); // day, month, year
  const [dateRange, setDateRange] = useState([
    moment().subtract(30, 'days'),
    moment()
  ]);
  const [totalRevenue, setTotalRevenue] = useState(0);

  useEffect(() => {
    fetchRevenueData();
  }, [viewType, dateRange]);

  const fetchRevenueData = async () => {
    setLoading(true);
    setError(null);
    try {
      // Gọi API lấy dữ liệu doanh thu theo khoảng thời gian
      const response = await StatisticService.getRevenueByDateRange(
        dateRange[0].format('YYYY-MM-DD'),
        dateRange[1].format('YYYY-MM-DD'),
        viewType
      );
      
      setRevenueData(response.data || []);
      setTotalRevenue(response.totalRevenue || 0);
    } catch (err) {
      setError('Không thể tải dữ liệu doanh thu');
      console.error('Error fetching revenue data:', err);
    } finally {
      setLoading(false);
    }
  };

  // Cấu hình biểu đồ đường
  const lineChartConfig = {
    data: revenueData,
    xField: 'date',
    yField: 'revenue',
    smooth: true,
    color: '#1890ff',
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
      formatter: (datum) => ({
        name: 'Doanh thu',
        value: `${datum.revenue?.toLocaleString('vi-VN')} ₫`
      })
    }
  };

  // Cấu hình biểu đồ cột
  const columnChartConfig = {
    data: revenueData,
    xField: 'date',
    yField: 'revenue',
    color: '#52c41a',
    columnWidthRatio: 0.6,
    tooltip: {
      formatter: (datum) => ({
        name: 'Doanh thu',
        value: `${datum.revenue?.toLocaleString('vi-VN')} ₫`
      })
    }
  };

  // Cấu hình bảng
  const tableColumns = [
    {
      title: 'Thời gian',
      dataIndex: 'date',
      key: 'date',
      render: (date) => {
        if (viewType === 'day') {
          return moment(date).format('DD/MM/YYYY');
        } else if (viewType === 'month') {
          return moment(date).format('MM/YYYY');
        } else {
          return moment(date).format('YYYY');
        }
      }
    },
    {
      title: 'Số đơn hàng',
      dataIndex: 'orderCount',
      key: 'orderCount',
      render: (count) => count?.toLocaleString('vi-VN')
    },
    {
      title: 'Doanh thu',
      dataIndex: 'revenue',
      key: 'revenue',
      render: (revenue) => `${revenue?.toLocaleString('vi-VN')} ₫`,
      sorter: (a, b) => a.revenue - b.revenue
    },
    {
      title: 'Doanh thu trung bình/đơn',
      key: 'averageOrder',
      render: (_, record) => {
        const avg = record.orderCount > 0 ? record.revenue / record.orderCount : 0;
        return `${avg.toLocaleString('vi-VN')} ₫`;
      }
    }
  ];

  const handleDateRangeChange = (dates) => {
    if (dates) {
      setDateRange(dates);
    }
  };

  const handleViewTypeChange = (value) => {
    setViewType(value);
  };

  return (
    <AdminLayout>
      <div style={{ padding: '24px' }}>
        <Title level={2}>
          <BarChartOutlined /> Báo cáo Doanh thu Chi tiết
        </Title>

        {error && (
          <Alert
            message="Lỗi"
            description={error}
            type="error"
            showIcon
            style={{ marginBottom: '24px' }}
          />
        )}

        <Spin spinning={loading}>
          {/* Bộ lọc */}
          <Card style={{ marginBottom: '24px' }}>
            <Row gutter={[16, 16]} align="middle">
              <Col xs={24} sm={12} md={8}>
                <div>
                  <label style={{ display: 'block', marginBottom: '8px', fontWeight: '500' }}>
                    Loại báo cáo:
                  </label>
                  <Select
                    value={viewType}
                    onChange={handleViewTypeChange}
                    style={{ width: '100%' }}
                  >
                    <Option value="day">Theo ngày</Option>
                    <Option value="month">Theo tháng</Option>
                    <Option value="year">Theo năm</Option>
                  </Select>
                </div>
              </Col>
              <Col xs={24} sm={12} md={8}>
                <div>
                  <label style={{ display: 'block', marginBottom: '8px', fontWeight: '500' }}>
                    Khoảng thời gian:
                  </label>
                  <RangePicker
                    value={dateRange}
                    onChange={handleDateRangeChange}
                    style={{ width: '100%' }}
                    format="DD/MM/YYYY"
                  />
                </div>
              </Col>
              <Col xs={24} sm={24} md={8}>
                <Card style={{ textAlign: 'center', background: '#f0f9ff' }}>
                  <Statistic
                    title="Tổng doanh thu"
                    value={totalRevenue}
                    formatter={(value) => `${value.toLocaleString('vi-VN')} ₫`}
                    prefix={<DollarCircleOutlined style={{ color: '#1890ff' }} />}
                    valueStyle={{ color: '#1890ff', fontWeight: 'bold' }}
                  />
                </Card>
              </Col>
            </Row>
          </Card>

          {/* Biểu đồ */}
          <Row gutter={[16, 16]} style={{ marginBottom: '24px' }}>
            <Col xs={24} lg={12}>
              <Card 
                title={
                  <span>
                    <LineChartOutlined /> Biểu đồ đường - Xu hướng doanh thu
                  </span>
                }
              >
                <Line {...lineChartConfig} height={300} />
              </Card>
            </Col>
            <Col xs={24} lg={12}>
              <Card 
                title={
                  <span>
                    <BarChartOutlined /> Biểu đồ cột - So sánh doanh thu
                  </span>
                }
              >
                <Column {...columnChartConfig} height={300} />
              </Card>
            </Col>
          </Row>

          {/* Bảng chi tiết */}
          <Card title={
            <span>
              <CalendarOutlined /> Chi tiết doanh thu {
                viewType === 'day' ? 'theo ngày' : 
                viewType === 'month' ? 'theo tháng' : 'theo năm'
              }
            </span>
          }>
            <Table
              columns={tableColumns}
              dataSource={revenueData}
              rowKey="date"
              pagination={{
                pageSize: 10,
                showSizeChanger: true,
                showQuickJumper: true,
                showTotal: (total, range) => 
                  `${range[0]}-${range[1]} của ${total} bản ghi`,
              }}
              scroll={{ x: 800 }}
            />
          </Card>
        </Spin>
      </div>
    </AdminLayout>
  );
};

export default RevenuePage;
