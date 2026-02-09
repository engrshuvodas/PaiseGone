import React, { useContext } from 'react';
import { Form, Input, InputNumber, DatePicker, Select, Button, Card, Typography, notification, Row, Col, Space } from 'antd';
import { SaveOutlined, ArrowLeftOutlined, ShoppingCartOutlined, TeamOutlined } from '@ant-design/icons';
import { useNavigate } from 'react-router-dom';
import { AppContext } from '../context/AppContext';
import dayjs from 'dayjs';

const { Title, Paragraph } = Typography;
const { TextArea } = Input;
const { Option } = Select;

const AddExpense = () => {
    const { members, addExpense } = useContext(AppContext);
    const [form] = Form.useForm();
    const navigate = useNavigate();

    const onFinish = async (values) => {
        try {
            const formattedExpense = {
                ...values,
                date: values.date.format('YYYY-MM-DD'),
            };

            await addExpense(formattedExpense);

            notification.success({
                message: 'Expense Added',
                description: 'Your bajar record has been saved and shared costs updated.',
                placement: 'topRight',
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
        <div style={{ maxWidth: 700, margin: '0 auto' }}>
            <Button
                type="link"
                icon={<ArrowLeftOutlined />}
                onClick={() => navigate('/')}
                style={{ marginBottom: 16, paddingLeft: 0 }}
            >
                Back to Dashboard
            </Button>

            <Card
                bordered={false}
                className="shadow-sm"
                title={
                    <Space>
                        <ShoppingCartOutlined style={{ color: '#1890ff' }} />
                        <span style={{ fontSize: '20px' }}>Add Bajar Expense</span>
                    </Space>
                }
            >
                <Paragraph type="secondary">
                    Recording daily bazaar expenses? Enter details below to automatically split the cost among all mess members.
                </Paragraph>

                <Form
                    form={form}
                    layout="vertical"
                    onFinish={onFinish}
                    initialValues={{
                        date: dayjs(),
                    }}
                    size="large"
                >
                    <Row gutter={16}>
                        <Col xs={24} sm={12}>
                            <Form.Item
                                name="date"
                                label="Date of Purchase"
                                rules={[{ required: true, message: 'Select date' }]}
                            >
                                <DatePicker style={{ width: '100%' }} />
                            </Form.Item>
                        </Col>
                        <Col xs={24} sm={12}>
                            <Form.Item
                                name="cost"
                                label="Total Costing (৳)"
                                rules={[
                                    { required: true, message: 'Enter amount' },
                                    { type: 'number', min: 1, message: 'Invalid amount' }
                                ]}
                            >
                                <InputNumber
                                    style={{ width: '100%' }}
                                    placeholder="Total Amount"
                                    formatter={value => `৳ ${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, ',')}
                                    parser={value => value.replace(/৳\s?|(,*)/g, '')}
                                />
                            </Form.Item>
                        </Col>
                    </Row>

                    <Form.Item
                        name="details"
                        label="Bajar Details (Items bought)"
                        rules={[{ required: true, message: 'Please describe the items' }]}
                    >
                        <TextArea rows={3} placeholder="e.g. Rice, Potatoes, Chicken, Onion" />
                    </Form.Item>

                    <Form.Item
                        name="addedBy"
                        label="Paid By (Who contributed money?)"
                        rules={[{ required: true, message: 'Select at least one member' }]}
                        tooltip="If multiple people paid, the cost will be divided among them for records."
                    >
                        <Select
                            mode="multiple"
                            placeholder="Select members who paid"
                            style={{ width: '100%' }}
                            allowClear
                        >
                            {members.map(member => (
                                <Option key={member.id} value={member.name}>{member.name}</Option>
                            ))}
                        </Select>
                    </Form.Item>

                    <Form.Item style={{ marginBottom: 0 }}>
                        <Button type="primary" htmlType="submit" icon={<SaveOutlined />} block>
                            Save Record
                        </Button>
                    </Form.Item>
                </Form>
            </Card>
        </div>
    );
};

export default AddExpense;
