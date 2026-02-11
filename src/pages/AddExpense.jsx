/** Software Version: 2.3 | Dev: Engr Shuvo Das **/
import React, { useState, useEffect, useContext } from 'react';
import { Form, Input, InputNumber, DatePicker, Button, Card, Typography, notification, Row, Col, Space, Divider, Alert, Select } from 'antd';
import { SaveOutlined, ArrowLeftOutlined, ShoppingCartOutlined, WalletOutlined, CheckCircleOutlined } from '@ant-design/icons';
import { useNavigate } from 'react-router-dom';
import { AppContext } from '../context/AppContext';
import dayjs from 'dayjs';

const { Title, Text } = Typography;
const { TextArea } = Input;

const AddExpense = () => {
    const { members, addExpense, settings, categories } = useContext(AppContext);
    const [form] = Form.useForm();
    const navigate = useNavigate();
    const [totalEntered, setTotalEntered] = useState(0);

    const currency = settings?.currency || '₹';

    // Real-time calculation of total contributions
    const contributions = Form.useWatch('contributions', form) || {};

    useEffect(() => {
        const sum = Object.values(contributions).reduce((a, b) => (a || 0) + (b || 0), 0);
        setTotalEntered(sum);
        // Automatically sync the main Cost field with the sum of contributions
        form.setFieldsValue({ cost: sum });
    }, [contributions, form]);

    const onFinish = async (values) => {
        if (totalEntered === 0) {
            notification.error({
                message: 'Validation Error',
                description: 'At least one member must have a contribution greater than 0.',
            });
            return;
        }

        try {
            const paidBy = {};
            Object.entries(values.contributions || {}).forEach(([memberId, amount]) => {
                if (amount && amount > 0) {
                    paidBy[memberId] = amount;
                }
            });

            const formattedExpense = {
                date: values.date.format('YYYY-MM-DD'),
                details: values.details,
                cost: values.cost,
                category: values.category || 'bajar',
                paidBy: paidBy,
            };

            await addExpense(formattedExpense);

            notification.success({
                message: 'Expense Added',
                description: 'Bajar record saved successfully.',
            });

            form.resetFields();
            navigate('/');
        } catch (error) {
            notification.error({
                message: 'Error',
                description: 'Could not save record. Please check fields.',
            });
        }
    };

    return (
        <div className="fade-in-up" style={{ maxWidth: 1000, margin: '0 auto' }}>
            <Button
                type="link"
                icon={<ArrowLeftOutlined />}
                onClick={() => navigate('/')}
                style={{ marginBottom: 16, paddingLeft: 0, color: '#ff5f6d', fontWeight: 600 }}
            >
                Back to Dashboard
            </Button>

            <Card
                className="premium-card"
                title={
                    <Space>
                        <div style={{ background: 'var(--primary-gradient)', padding: 8, borderRadius: 10, display: 'flex' }}>
                            <ShoppingCartOutlined style={{ color: 'white' }} />
                        </div>
                        <span style={{ fontSize: '20px', fontWeight: 600 }}>New Bajar Entry</span>
                    </Space>
                }
            >
                <Form
                    form={form}
                    layout="vertical"
                    onFinish={onFinish}
                    initialValues={{
                        date: dayjs(),
                        cost: 0,
                        contributions: {}
                    }}
                    size="large"
                >
                    <Row gutter={32}>
                        <Col xs={24} md={12}>
                            <Form.Item
                                name="date"
                                label={<Text strong>Purchase Date</Text>}
                                rules={[{ required: true, message: 'Select date' }]}
                            >
                                <DatePicker style={{ width: '100%', borderRadius: 10 }} variant="filled" />
                            </Form.Item>

                            <Form.Item
                                name="category"
                                label={<Text strong>Expense Category</Text>}
                                rules={[{ required: true, message: 'Select category' }]}
                                initialValue="bajar"
                            >
                                <Select style={{ width: '100%', borderRadius: 10 }} variant="filled">
                                    {categories.map(cat => (
                                        <Select.Option key={cat.id} value={cat.id}>
                                            <Space>
                                                <span>{cat.icon}</span>
                                                <span>{cat.name}</span>
                                            </Space>
                                        </Select.Option>
                                    ))}
                                </Select>
                            </Form.Item>

                            <Form.Item
                                name="details"
                                label={<Text strong>Bajar Details</Text>}
                                rules={[{ required: true, message: 'Please describe the items' }]}
                            >
                                <TextArea rows={4} placeholder="e.g. Rice 25kg, Chicken 4kg, Masala..." style={{ borderRadius: 10 }} variant="filled" />
                            </Form.Item>

                            <div className="info-box" style={{ padding: '20px', borderRadius: '16px', marginTop: 24 }}>
                                <Text type="secondary" style={{ fontSize: 12, fontWeight: 600, textTransform: 'uppercase' }}>Total Calculated Cost</Text>
                                <div style={{ display: 'flex', alignItems: 'baseline', gap: 8, marginTop: 4 }}>
                                    <Title level={2} style={{ margin: 0, color: '#ff5f6d' }}>{currency}{totalEntered.toLocaleString()}</Title>
                                    <Text type="secondary">automatically updated</Text>
                                </div>

                                <Form.Item name="cost" hidden>
                                    <InputNumber />
                                </Form.Item>
                            </div>
                        </Col>

                        <Col xs={24} md={12}>
                            <div className="secondary-container" style={{ padding: '24px', borderRadius: '20px' }}>
                                <Title level={5} style={{ marginTop: 0, display: 'flex', alignItems: 'center', gap: 8 }}>
                                    <WalletOutlined style={{ color: '#ff5f6d' }} /> Member Contributions
                                </Title>
                                <Text type="secondary" style={{ fontSize: '13px', display: 'block', marginBottom: '20px' }}>
                                    Enter exactly how much each brother paid at the counter.
                                </Text>

                                <div style={{ maxHeight: '400px', overflowY: 'auto', paddingRight: '12px' }}>
                                    {members.map(member => (
                                        <Form.Item
                                            key={member.id}
                                            name={['contributions', member.id]}
                                            label={<Text strong style={{ fontSize: 13 }}>{member.name}</Text>}
                                            style={{ marginBottom: '16px' }}
                                        >
                                            <InputNumber
                                                style={{ width: '100%', borderRadius: 8 }}
                                                placeholder={`${currency} 0.00`}
                                                min={0}
                                                variant="filled"
                                                formatter={value => `${currency} ${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, ',')}
                                                parser={value => value.replace(new RegExp(`\\${currency}\\s?|(,*)`, 'g'), '')}
                                            />
                                        </Form.Item>
                                    ))}
                                </div>

                                {totalEntered > 0 && (
                                    <div style={{ marginTop: 16 }}>
                                        <Alert
                                            message={<Text strong className="success-box-text">Perfect! Total {currency}{totalEntered} will be recorded.</Text>}
                                            type="success"
                                            showIcon
                                            icon={<CheckCircleOutlined className="success-box-text" />}
                                            style={{ borderRadius: 10, border: 'none' }}
                                            className="success-box"
                                        />
                                    </div>
                                )}
                            </div>
                        </Col>
                    </Row>

                    <Divider style={{ margin: '32px 0' }} />

                    <Form.Item style={{ marginBottom: 0 }}>
                        <Button
                            type="primary"
                            htmlType="submit"
                            icon={<SaveOutlined />}
                            size="large"
                            block
                            style={{ height: 56, borderRadius: 14, fontSize: 16 }}
                            disabled={totalEntered <= 0}
                        >
                            Confirm and Save Bajar
                        </Button>
                    </Form.Item>
                </Form>
            </Card>
        </div>
    );
};

export default AddExpense;
