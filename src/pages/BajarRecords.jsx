/** Software Version: 2.3 | Dev: Engr Shuvo Das **/
import React, { useState, useEffect, useContext, useMemo } from 'react';
import { Table, Card, Button, Typography, Space, Tag, Input, Modal, Form, DatePicker, InputNumber, notification, Popconfirm, Divider, Row, Col, Tooltip, Select } from 'antd';
import {
    ShoppingCartOutlined,
    PlusOutlined,
    SearchOutlined,
    EditOutlined,
    DeleteOutlined,
    TransactionOutlined,
    CalendarOutlined,
    InfoCircleOutlined,
    UserOutlined,
    FileExcelOutlined,
    FilterOutlined
} from '@ant-design/icons';
import { AppContext } from '../context/AppContext';
import { useNavigate } from 'react-router-dom';
import dayjs from 'dayjs';
import isBetween from 'dayjs/plugin/isBetween';
import * as XLSX from 'xlsx';

dayjs.extend(isBetween);

const { Title, Text } = Typography;
const { TextArea } = Input;
const { RangePicker } = DatePicker;

const BajarRecords = () => {
    const { expenses, members, settings, updateExpense, deleteExpense, categories } = useContext(AppContext);
    const [searchText, setSearchText] = useState('');
    const [dateRange, setDateRange] = useState([dayjs().startOf('month'), dayjs().endOf('month')]);
    const [isEditModalOpen, setIsEditModalOpen] = useState(false);
    const [editingRecord, setEditingRecord] = useState(null);
    const [form] = Form.useForm();
    const navigate = useNavigate();
    const currency = settings?.currency || '₹';

    const filteredData = useMemo(() => {
        return expenses.filter(item => {
            const matchesSearch = (item.details || "").toLowerCase().includes(searchText.toLowerCase()) ||
                dayjs(item.date).format('DD MMM YYYY').toLowerCase().includes(searchText.toLowerCase());

            const itemDate = dayjs(item.date);
            const matchesDate = !dateRange || itemDate.isBetween(dateRange[0], dateRange[1], 'day', '[]');

            return matchesSearch && matchesDate;
        });
    }, [expenses, searchText, dateRange]);

    const handleExportExcel = () => {
        try {
            const exportData = filteredData.map(item => {
                const row = {
                    'Date': dayjs(item.date).format('YYYY-MM-DD'),
                    'Bajar Details': item.details,
                    'Total Cost': item.cost
                };

                // Add columns for each member's contribution
                members.forEach(member => {
                    row[member.name] = item.paidBy[member.id] || 0;
                });

                return row;
            });

            const ws = XLSX.utils.json_to_sheet(exportData);
            const wb = XLSX.utils.book_new();
            XLSX.utils.book_append_sheet(wb, ws, "Bajar Records");

            const fileName = `Bajar_Records_${dayjs().format('YYYY-MM-DD')}.xlsx`;
            XLSX.writeFile(wb, fileName);

            notification.success({
                message: 'Export Successful',
                description: `Records have been exported to ${fileName}`,
            });
        } catch (error) {
            notification.error({
                message: 'Export Failed',
                description: 'An error occurred while generating the Excel file.',
            });
        }
    };

    const handleEdit = (record) => {
        setEditingRecord(record);
        form.setFieldsValue({
            date: dayjs(record.date),
            details: record.details,
            cost: record.cost,
            category: record.category || 'bajar',
            contributions: record.paidBy || {}
        });
        setIsEditModalOpen(true);
    };

    const handleDelete = async (id) => {
        try {
            await deleteExpense(id);
            notification.success({
                message: 'Record Deleted',
                description: 'The bajar record has been removed successfully.',
            });
        } catch (error) {
            notification.error({ message: 'Error deleting record' });
        }
    };

    const handleUpdate = async () => {
        try {
            const values = await form.validateFields();

            const cleanPaidBy = {};
            Object.entries(values.contributions || {}).forEach(([memberId, amount]) => {
                if (amount && amount > 0) {
                    cleanPaidBy[memberId] = amount;
                }
            });

            const actualTotal = Object.values(cleanPaidBy).reduce((sum, val) => sum + val, 0);

            const updatedExpense = {
                ...editingRecord,
                date: values.date.format('YYYY-MM-DD'),
                details: values.details,
                cost: actualTotal,
                category: values.category || 'bajar',
                paidBy: cleanPaidBy
            };

            await updateExpense(updatedExpense);
            setIsEditModalOpen(false);
            notification.success({
                message: 'Record Updated',
                description: 'Bajar record has been updated successfully.',
            });
        } catch (error) {
            console.error('Update failed:', error);
        }
    };

    const columns = [
        {
            title: 'Date',
            dataIndex: 'date',
            key: 'date',
            width: 120,
            render: (date) => (
                <Space direction="vertical" size={0}>
                    <Text strong style={{ fontSize: 13 }}>{dayjs(date).format('DD MMM')}</Text>
                    <Text type="secondary" style={{ fontSize: 11 }}>{dayjs(date).format('YYYY')}</Text>
                </Space>
            ),
            sorter: (a, b) => dayjs(a.date).unix() - dayjs(b.date).unix(),
        },
        {
            title: 'Details',
            dataIndex: 'details',
            key: 'details',
            render: (text) => (
                <div style={{ maxWidth: 300 }}>
                    <Text strong style={{ display: 'block' }}>{text}</Text>
                </div>
            ),
        },
        {
            title: 'Category',
            dataIndex: 'category',
            key: 'category',
            render: (catId) => {
                const cat = categories.find(c => c.id === catId) || categories[0];
                return (
                    <Tag bordered={false} style={{ background: `${cat.color}15`, color: cat.color, borderRadius: 6 }}>
                        {cat.icon} {cat.name}
                    </Tag>
                );
            }
        },
        {
            title: 'Paid By',
            key: 'paidBy',
            render: (_, record) => (
                <Space wrap size={[0, 4]}>
                    {Object.entries(record.paidBy || {}).map(([memberId, amount]) => {
                        const member = members.find(m => m.id === memberId);
                        return (
                            <Tag key={memberId} color="default" className="pill-badge" style={{ fontSize: 11, background: 'var(--bg-secondary)' }}>
                                <Text style={{ fontSize: 11 }}>{member ? member.name : 'Unknown'}: </Text>
                                <Text strong style={{ fontSize: 11 }}>{currency}{amount}</Text>
                            </Tag>
                        );
                    })}
                </Space>
            ),
        },
        {
            title: 'Total Cost',
            dataIndex: 'cost',
            key: 'cost',
            align: 'right',
            render: (cost) => <Text strong style={{ color: 'var(--text-main)', fontSize: 15 }}>{currency}{cost.toLocaleString()}</Text>,
            sorter: (a, b) => a.cost - b.cost,
        },
        {
            title: 'Actions',
            key: 'action',
            align: 'right',
            render: (_, record) => (
                <Space>
                    <Tooltip title="Edit">
                        <Button
                            type="text"
                            icon={<EditOutlined style={{ color: '#1890ff' }} />}
                            onClick={() => handleEdit(record)}
                        />
                    </Tooltip>
                    <Popconfirm
                        title="Delete record?"
                        onConfirm={() => handleDelete(record.id)}
                        okText="Delete"
                        cancelText="Cancel"
                        okButtonProps={{ danger: true }}
                    >
                        <Tooltip title="Delete">
                            <Button
                                type="text"
                                danger
                                icon={<DeleteOutlined />}
                            />
                        </Tooltip>
                    </Popconfirm>
                </Space>
            ),
        },
    ];

    return (
        <div className="fade-in-up">
            <Row gutter={[24, 24]} align="middle" style={{ marginBottom: 24 }}>
                <Col xs={24} md={12}>
                    <Space size="middle">
                        <div style={{ background: 'var(--primary-gradient)', padding: 10, borderRadius: 12, display: 'flex' }}>
                            <TransactionOutlined style={{ color: 'white', fontSize: 20 }} />
                        </div>
                        <div>
                            <Title level={3} style={{ margin: 0 }}>Bajar Records</Title>
                            <Text type="secondary">Historical expense management</Text>
                        </div>
                    </Space>
                </Col>
                <Col xs={24} md={12} style={{ textAlign: 'right' }}>
                    <Space size="middle" wrap>
                        <Button
                            icon={<FileExcelOutlined />}
                            onClick={handleExportExcel}
                            disabled={filteredData.length === 0}
                            style={{ borderRadius: 10, height: 48 }}
                        >
                            Export Excel
                        </Button>
                        <Button
                            type="primary"
                            icon={<PlusOutlined />}
                            size="large"
                            onClick={() => navigate('/add-expense')}
                            style={{ borderRadius: 12, height: 48, padding: '0 24px' }}
                        >
                            Add New Bajar
                        </Button>
                    </Space>
                </Col>
            </Row>

            <Card className="premium-card">
                <div style={{
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'center',
                    flexWrap: 'wrap',
                    gap: '12px',
                    marginBottom: 20
                }}>
                    <div style={{ display: 'flex', gap: '8px', flex: 1, minWidth: '300px' }}>
                        <Input
                            prefix={<SearchOutlined style={{ color: '#bfbfbf' }} />}
                            placeholder="Search records..."
                            allowClear
                            value={searchText}
                            onChange={e => setSearchText(e.target.value)}
                            style={{ borderRadius: 10, height: 40, flex: 1 }}
                            variant="filled"
                        />
                        <RangePicker
                            style={{ borderRadius: 10, height: 40, flex: 1.5 }}
                            value={dateRange}
                            onChange={(dates) => setDateRange(dates)}
                            variant="filled"
                            separator={<span style={{ color: '#bfbfbf' }}>→</span>}
                        />
                    </div>
                </div>

                <div style={{ marginBottom: 12, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <Text type="secondary" style={{ fontSize: 13 }}>
                        Showing <Text strong>{filteredData.length}</Text> of {expenses.length} records
                    </Text>
                    {dateRange && (
                        <Tag
                            closable
                            onClose={() => setDateRange(null)}
                            className="info-box"
                            style={{ borderRadius: 6, margin: 0, padding: '2px 10px', border: '1px solid var(--border-main)' }}
                        >
                            <CalendarOutlined style={{ marginRight: 4 }} className="info-box-title" />
                            <Text className="info-box-title">{dateRange[0] && dateRange[1] ? `${dateRange[0].format('DD MMM')} - ${dateRange[1].format('DD MMM')}` : 'Full Records'}</Text>
                        </Tag>
                    )}
                </div>

                <Table
                    columns={columns}
                    dataSource={filteredData}
                    rowKey="id"
                    pagination={{ pageSize: 10, showSizeChanger: true }}
                    className="records-table"
                />
            </Card>

            <Modal
                title={
                    <Space>
                        <EditOutlined style={{ color: '#1890ff' }} />
                        <span>Edit Bajar Record</span>
                    </Space>
                }
                open={isEditModalOpen}
                onOk={handleUpdate}
                onCancel={() => setIsEditModalOpen(false)}
                okText="Save Changes"
                cancelText="Cancel"
                width={600}
                destroyOnClose
                centered
            >
                <Form form={form} layout="vertical" style={{ marginTop: 20 }}>
                    <Row gutter={16}>
                        <Col span={12}>
                            <Form.Item name="date" label={<Text strong><CalendarOutlined /> Date</Text>} rules={[{ required: true }]}>
                                <DatePicker style={{ width: '100%', borderRadius: 8 }} />
                            </Form.Item>
                        </Col>
                        <Col span={12}>
                            <Form.Item name="category" label={<Text strong>Category</Text>} rules={[{ required: true }]}>
                                <Select style={{ width: '100%', borderRadius: 8 }}>
                                    {categories.map(cat => (
                                        <Select.Option key={cat.id} value={cat.id}>
                                            {cat.icon} {cat.name}
                                        </Select.Option>
                                    ))}
                                </Select>
                            </Form.Item>
                        </Col>
                    </Row>
                    <Form.Item name="details" label={<Text strong><InfoCircleOutlined /> Bajar Details</Text>} rules={[{ required: true }]}>
                        <TextArea rows={3} style={{ borderRadius: 8 }} />
                    </Form.Item>
                    <Divider orientation="left"><Text type="secondary" style={{ fontSize: 12 }}>Member Contributions</Text></Divider>
                    <div style={{ maxHeight: 250, overflowY: 'auto', paddingRight: 8 }}>
                        {members.map(member => (
                            <Row key={member.id} align="middle" style={{ marginBottom: 12 }}>
                                <Col span={12}>
                                    <Space><UserOutlined style={{ color: '#bfbfbf' }} /> <Text>{member.name}</Text></Space>
                                </Col>
                                <Col span={12}>
                                    <Form.Item name={['contributions', member.id]} noStyle>
                                        <InputNumber style={{ width: '100%', borderRadius: 8 }} min={0} prefix={currency} />
                                    </Form.Item>
                                </Col>
                            </Row>
                        ))}
                    </div>
                </Form>
            </Modal>
        </div>
    );
};

export default BajarRecords;
