import React, { useContext, useState } from 'react';
import { Layout, Menu, Button, theme, Space, Typography, Popconfirm, Avatar } from 'antd';
import {
    DashboardOutlined,
    PlusCircleOutlined,
    TeamOutlined,
    MenuFoldOutlined,
    MenuUnfoldOutlined,
    DollarOutlined,
    LogoutOutlined,
    UserOutlined
} from '@ant-design/icons';
import { useNavigate, useLocation, Outlet } from 'react-router-dom';
import dayjs from 'dayjs';
import { AppContext } from '../context/AppContext';

const { Header, Sider, Content, Footer } = Layout;
const { Title, Text } = Typography;

const AppLayout = () => {
    const [collapsed, setCollapsed] = useState(false);
    const { logout } = useContext(AppContext);
    const navigate = useNavigate();
    const location = useLocation();
    const {
        token: { colorBgContainer, borderRadiusLG },
    } = theme.useToken();

    const handleLogout = () => {
        logout();
        navigate('/login');
    };

    const menuItems = [
        {
            key: '/',
            icon: <DashboardOutlined />,
            label: 'Dashboard',
        },
        {
            key: '/add-expense',
            icon: <PlusCircleOutlined />,
            label: 'Add Bajar',
        },
        {
            key: '/members',
            icon: <TeamOutlined />,
            label: 'Mess Members',
        },
    ];

    return (
        <Layout style={{ minHeight: '100vh' }}>
            <Sider trigger={null} collapsible collapsed={collapsed} theme="light" className="shadow-sm">
                <div className="logo" style={{ background: 'linear-gradient(135deg, #1890ff 0%, #001529 100%)', color: 'white' }}>
                    {collapsed ? 'BB' : 'BajarBros 🍛'}
                </div>
                <Menu
                    mode="inline"
                    selectedKeys={[location.pathname]}
                    items={menuItems}
                    onClick={({ key }) => navigate(key)}
                    style={{ borderRight: 0 }}
                />
            </Sider>
            <Layout>
                <Header style={{
                    padding: '0 24px',
                    background: colorBgContainer,
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    borderBottom: '1px solid #f0f0f0'
                }}>
                    <Space>
                        <Button
                            type="text"
                            icon={collapsed ? <MenuUnfoldOutlined /> : <MenuFoldOutlined />}
                            onClick={() => setCollapsed(!collapsed)}
                            style={{ fontSize: '16px', width: 48, height: 48 }}
                        />
                        <Title level={4} style={{ margin: 0, display: collapsed ? 'none' : 'block' }}>
                            Mess Manager
                        </Title>
                    </Space>

                    <Space size="large">
                        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                            <DollarOutlined style={{ color: '#1890ff' }} />
                            <span style={{ fontWeight: 600 }}>{dayjs().format('MMMM, YYYY')}</span>
                        </div>

                        <Divider type="vertical" />

                        <Space>
                            <Avatar size="small" icon={<UserOutlined />} style={{ backgroundColor: '#87d068' }} />
                            <Text strong>Admin</Text>
                            <Popconfirm
                                title="Logout?"
                                description="Are you sure you want to log out?"
                                onConfirm={handleLogout}
                                okText="Yes"
                                cancelText="No"
                            >
                                <Button
                                    type="text"
                                    danger
                                    icon={<LogoutOutlined />}
                                    style={{ display: 'flex', alignItems: 'center' }}
                                >
                                    Logout
                                </Button>
                            </Popconfirm>
                        </Space>
                    </Space>
                </Header>
                <Content
                    className="fade-in-content"
                    style={{
                        margin: '24px',
                        padding: '24px',
                        minHeight: 280,
                        background: colorBgContainer,
                        borderRadius: borderRadiusLG,
                        boxShadow: '0 2px 8px rgba(0,0,0,0.04)',
                        overflowX: 'hidden'
                    }}
                >
                    <Outlet />
                </Content>
                <Footer style={{ textAlign: 'center', background: '#f0f2f5', color: '#8c8c8c' }}>
                    BajarBros Expense Tracker ©{new Date().getFullYear()} • Dev by Antigravity
                </Footer>
            </Layout>
        </Layout>
    );
};

// Add Divider to the imports
const Divider = ({ type }) => {
    if (type === 'vertical') {
        return <span style={{ borderLeft: '1px solid #d9d9d9', height: '1.5em', margin: '0 8px' }} />;
    }
    return <hr style={{ borderTop: '1px solid #d9d9d9', margin: '16px 0' }} />;
};

export default AppLayout;
