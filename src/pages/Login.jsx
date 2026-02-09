import React, { useContext } from 'react';
import { Form, Input, Button, Card, Typography, message, Layout } from 'antd';
import { UserOutlined, LockOutlined, ShoppingCartOutlined } from '@ant-design/icons';
import { AppContext } from '../context/AppContext';
import { useNavigate } from 'react-router-dom';

const { Title, Text } = Typography;
const { Content } = Layout;

const Login = () => {
    const { login } = useContext(AppContext);
    const navigate = useNavigate();

    const onFinish = (values) => {
        const success = login(values.username, values.password);
        if (success) {
            message.success('Login successful! Welcome back, Admin.');
            navigate('/');
        } else {
            message.error('Invalid username or password!');
        }
    };

    return (
        <Layout style={{ minHeight: '100vh', background: '#f0f2f5' }}>
            <Content style={{ display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
                <Card
                    style={{ width: 400, borderRadius: '12px', boxShadow: '0 8px 24px rgba(0,0,0,0.1)' }}
                    className="fade-in-content"
                >
                    <div style={{ textAlign: 'center', marginBottom: '24px' }}>
                        <div style={{
                            width: '64px',
                            height: '64px',
                            background: 'linear-gradient(135deg, #1890ff 0%, #001529 100%)',
                            borderRadius: '16px',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            margin: '0 auto 16px',
                            boxShadow: '0 4px 12px rgba(24, 144, 255, 0.3)'
                        }}>
                            <ShoppingCartOutlined style={{ fontSize: '32px', color: 'white' }} />
                        </div>
                        <Title level={2} style={{ margin: 0 }}>BajarBros</Title>
                        <Text type="secondary">Admin Login</Text>
                    </div>

                    <Form
                        name="login_form"
                        layout="vertical"
                        onFinish={onFinish}
                        size="large"
                    >
                        <Form.Item
                            name="username"
                            rules={[{ required: true, message: 'Please input your username!' }]}
                        >
                            <Input prefix={<UserOutlined />} placeholder="Username" />
                        </Form.Item>

                        <Form.Item
                            name="password"
                            rules={[{ required: true, message: 'Please input your password!' }]}
                        >
                            <Input.Password prefix={<LockOutlined />} placeholder="Password" />
                        </Form.Item>

                        <Form.Item>
                            <Button type="primary" htmlType="submit" block style={{ height: '48px', borderRadius: '8px' }}>
                                Login
                            </Button>
                        </Form.Item>
                    </Form>

                    <div style={{ textAlign: 'center' }}>
                        <Text type="secondary" style={{ fontSize: '12px' }}>
                            Only the Mess Manager can access this system.
                        </Text>
                    </div>
                </Card>
            </Content>
        </Layout>
    );
};

export default Login;
