/** Software Version: 2.3 | Dev: Engr Shuvo Das **/
import React, { useState, useEffect, useContext } from 'react';
import { Card, Form, Select, Typography, Row, Col, Divider, Space, notification, Button, Radio } from 'antd';
import { SettingOutlined, GlobalOutlined, TransactionOutlined, SaveOutlined, TeamOutlined } from '@ant-design/icons';
import { AppContext } from '../context/AppContext';

const { Title, Text } = Typography;
const { Option } = Select;

const Settings = () => {
    const { settings, updateSettings } = useContext(AppContext);
    const [form] = Form.useForm();

    const onFinish = (values) => {
        updateSettings(values);
        notification.success({
            message: 'Theme updated!',
            description: 'Your preferences have been applied successfully.',
            placement: 'bottomRight',
        });
    };

    // Common timezones list
    const timezones = [
        { label: 'India (IST)', value: 'Asia/Kolkata' },
        { label: 'Bangladesh (BST)', value: 'Asia/Dhaka' },
        { label: 'UTC', value: 'UTC' },
        { label: 'London (GMT/BST)', value: 'Europe/London' },
        { label: 'New York (EST/EDT)', value: 'America/New_York' },
        { label: 'Dubai (GST)', value: 'Asia/Dubai' },
        { label: 'Singapore (SGT)', value: 'Asia/Singapore' },
    ];

    const currentTz = Intl.DateTimeFormat().resolvedOptions().timeZone;
    if (!timezones.find(tz => tz.value === currentTz)) {
        timezones.push({ label: `Auto: ${currentTz}`, value: currentTz });
    }

    return (
        <div className="fade-in-up" style={{ maxWidth: 800, margin: '0 auto' }}>
            <Title level={2} style={{ marginBottom: 24 }}>
                <SettingOutlined /> App Settings
            </Title>

            <Card className="premium-card">
                <Form
                    form={form}
                    layout="vertical"
                    initialValues={settings}
                    onFinish={onFinish}
                    size="large"
                >
                    <Row gutter={[32, 32]}>
                        <Col xs={24} md={12}>
                            <Title level={5}>
                                <TransactionOutlined style={{ color: '#ff5f6d' }} /> Currency Configuration
                            </Title>
                            <Text type="secondary">Choose how monetary values are displayed across the app.</Text>

                            <Form.Item
                                name="currency"
                                label="Primary Currency Symbol"
                                style={{ marginTop: 16 }}
                            >
                                <Select style={{ borderRadius: 10 }} variant="filled">
                                    <Option value="₹">Rupee (₹)</Option>
                                    <Option value="৳">Taka (৳)</Option>
                                    <Option value="$">Dollar ($)</Option>
                                </Select>
                            </Form.Item>
                        </Col>

                        <Col xs={24} md={12}>
                            <Title level={5}>
                                <TeamOutlined style={{ color: '#ff5f6d' }} /> Appearance
                            </Title>
                            <Text type="secondary">Customize the interface theme.</Text>

                            <Form.Item
                                name="theme"
                                label="Interface Theme"
                                style={{ marginTop: 16 }}
                            >
                                <Radio.Group optionType="button" buttonStyle="solid" style={{ width: '100%', display: 'flex' }}>
                                    <Radio.Button value="light" style={{ flex: 1, textAlign: 'center' }}>Light</Radio.Button>
                                    <Radio.Button value="dark" style={{ flex: 1, textAlign: 'center' }}>Dark</Radio.Button>
                                    <Radio.Button value="system" style={{ flex: 1, textAlign: 'center' }}>System</Radio.Button>
                                </Radio.Group>
                            </Form.Item>
                        </Col>

                        <Col xs={24} md={12}>
                            <Title level={5}>
                                <GlobalOutlined style={{ color: '#ff5f6d' }} /> Localization
                            </Title>
                            <Text type="secondary">Set your local timezone for accurate tracking.</Text>

                            <Form.Item
                                name="timezone"
                                label="Current Timezone"
                                style={{ marginTop: 16 }}
                                help="By default, this matches your location."
                            >
                                <Select
                                    showSearch
                                    style={{ borderRadius: 10 }}
                                    variant="filled"
                                    placeholder="Select timezone"
                                >
                                    {timezones.map(tz => (
                                        <Option key={tz.value} value={tz.value}>{tz.label}</Option>
                                    ))}
                                </Select>
                            </Form.Item>
                        </Col>
                    </Row>

                    <Divider style={{ margin: '32px 0' }} />

                    <Form.Item style={{ marginBottom: 0, textAlign: 'right' }}>
                        <Button
                            type="primary"
                            htmlType="submit"
                            icon={<SaveOutlined />}
                            style={{ height: 48, padding: '0 40px', borderRadius: 12 }}
                        >
                            Save Preferences
                        </Button>
                    </Form.Item>
                </Form>
            </Card>

            <Card className="premium-card info-box" style={{ marginTop: 24, border: 'none' }}>
                <Space direction="vertical">
                    <Text strong className="info-box-title">Advanced Info</Text>
                    <Text type="secondary" style={{ fontSize: 13 }}>
                        Current System Timezone: <Text strong>{currentTz}</Text>
                    </Text>
                    <Text type="secondary" style={{ fontSize: 13 }}>
                        All data is stored locally in your browser and synced with your chosen settings.
                    </Text>
                </Space>
            </Card>
        </div>
    );
};

export default Settings;
