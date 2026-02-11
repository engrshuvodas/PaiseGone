/** Software Version: 2.3 | Dev: Engr Shuvo Das **/
import React, { useState, useEffect, useContext } from 'react';
import { Form, Input, Button, Card, Typography, message, Layout, Space } from 'antd';
import { UserOutlined, LockOutlined, ShoppingCartOutlined, ArrowRightOutlined } from '@ant-design/icons';
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
            message.success('Welcome back, Manager!');
            navigate('/');
        } else {
            message.error('Oops! Invalid credentials.');
        }
    };

    return (
        <Layout style={{ minHeight: '100vh', background: 'var(--bg-main)' }}>
            <Content style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', padding: '20px' }}>
                <div style={{ width: '100%', maxWidth: 420 }}>
                    <Card
                        className="premium-card fade-in-up"
                        style={{ padding: '20px 10px' }}
                    >
                        <div style={{ textAlign: 'center', marginBottom: '40px' }}>
                            <div style={{
                                width: '72px',
                                height: '72px',
                                background: 'var(--primary-gradient)',
                                borderRadius: '20px',
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: 'center',
                                margin: '0 auto 20px',
                                boxShadow: '0 10px 25px rgba(255, 95, 109, 0.3)',
                                transform: 'rotate(-5deg)'
                            }}>
                                <ShoppingCartOutlined style={{ fontSize: '36px', color: 'white' }} />
                            </div>
                            <Title level={1} style={{ margin: 0, letterSpacing: '-1px' }}>PaiseGone</Title>
                            <Text type="secondary" style={{ fontSize: 16 }}>Mess Expense Manager</Text>
                        </div>

                        <Form
                            name="login_form"
                            layout="vertical"
                            onFinish={onFinish}
                            size="large"
                        >
                            <Form.Item
                                name="username"
                                rules={[{ required: true, message: 'Your username please' }]}
                            >
                                <Input
                                    prefix={<UserOutlined style={{ color: '#bfbfbf' }} />}
                                    placeholder="Username"
                                    style={{ borderRadius: 12, height: 50 }}
                                    variant="filled"
                                />
                            </Form.Item>

                            <Form.Item
                                name="password"
                                rules={[{ required: true, message: 'Password is required' }]}
                            >
                                <Input.Password
                                    prefix={<LockOutlined style={{ color: '#bfbfbf' }} />}
                                    placeholder="Password"
                                    style={{ borderRadius: 12, height: 50 }}
                                    variant="filled"
                                />
                            </Form.Item>

                            <Form.Item style={{ marginTop: 32 }}>
                                <Button
                                    type="primary"
                                    htmlType="submit"
                                    block
                                    style={{ height: 54, borderRadius: 14, fontSize: 16 }}
                                >
                                    <Space>Login to Dashboard <ArrowRightOutlined /></Space>
                                </Button>
                            </Form.Item>
                        </Form>

                        <div style={{ textAlign: 'center', marginTop: 24 }}>
                            <Text type="secondary" style={{ fontSize: '13px' }}>
                                For demonstration use: <Text strong>admin / admin</Text>
                            </Text>
                        </div>
                    </Card>

                    <div style={{ textAlign: 'center', marginTop: 24 }}>
                        <Text type="secondary" style={{ fontSize: 12 }}>
                            ©{new Date().getFullYear()} PaiseGone • Developed by Engr Shuvo
                        </Text>
                    </div>
                </div>
            </Content>
        </Layout>
    );
};

export default Login;
