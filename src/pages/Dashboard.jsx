import React, { useContext, useState, useMemo } from 'react';
import { Table, Card, Row, Col, Statistic, DatePicker, Button, Input, Space, Typography, notification, Divider, List, Tag, Badge } from 'antd';
import { SearchOutlined, DownloadOutlined, TransactionOutlined, ArrowUpOutlined, ArrowDownOutlined } from '@ant-design/icons';
import { AppContext } from '../context/AppContext';
import dayjs from 'dayjs';
import isBetween from 'dayjs/plugin/isBetween';
import * as XLSX from 'xlsx';

dayjs.extend(isBetween);

const { RangePicker } = DatePicker;
const { Title, Text } = Typography;

const Dashboard = () => {
    const { expenses, members } = useContext(AppContext);
    const [dateRange, setDateRange] = useState([dayjs().startOf('month'), dayjs().endOf('month')]);
    const [searchText, setSearchText] = useState('');

    const filteredExpenses = useMemo(() => {
        return expenses.filter(item => {
            const expenseDate = dayjs(item.date);
            const isInRange = !dateRange || expenseDate.isBetween(dateRange[0], dateRange[1], 'day', '[]');

            const searchLower = searchText.toLowerCase();
            const matchesSearch = item.details.toLowerCase().includes(searchLower) ||
                item.addedBy.some(m => m.toLowerCase().includes(searchLower));

            return isInRange && matchesSearch;
        });
    }, [expenses, dateRange, searchText]);

    const totalExpense = useMemo(() => {
        return filteredExpenses.reduce((sum, item) => sum + item.cost, 0);
    }, [filteredExpenses]);

    const perPersonShare = useMemo(() => {
        return members.length > 0 ? (totalExpense / members.length) : 0;
    }, [totalExpense, members.length]);

    // Settlement Calculations
    const settlementData = useMemo(() => {
        const data = members.map(member => {
            // Calculate how much this specific member has paid
            const paidByMember = filteredExpenses.reduce((sum, item) => {
                if (item.addedBy.includes(member.name)) {
                    // If 2 people paid, each is credited with cost/2
                    return sum + (item.cost / item.addedBy.length);
                }
                return sum;
            }, 0);

            const balance = paidByMember - perPersonShare;
            return {
                id: member.id,
                name: member.name,
                paid: paidByMember,
                shouldPay: perPersonShare,
                balance: balance
            };
        });
        return data;
    }, [members, filteredExpenses, perPersonShare]);

    const toReceive = settlementData.filter(m => m.balance > 0.01).sort((a, b) => b.balance - a.balance);
    const toPay = settlementData.filter(m => m.balance < -0.01).sort((a, b) => a.balance - b.balance);

    // Simple Greedy Settlement Matching
    const suggestions = useMemo(() => {
        const payers = toPay.map(p => ({ ...p, balance: Math.abs(p.balance) }));
        const receivers = toReceive.map(r => ({ ...r, balance: r.balance }));
        const result = [];

        let pi = 0, ri = 0;
        while (pi < payers.length && ri < receivers.length) {
            const payer = payers[pi];
            const receiver = receivers[ri];
            const amount = Math.min(payer.balance, receiver.balance);

            if (amount > 0.1) {
                result.push(`${payer.name} should give ৳${amount.toFixed(0)} to ${receiver.name}`);
            }

            payer.balance -= amount;
            receiver.balance -= amount;

            if (payer.balance <= 0.1) pi++;
            if (receiver.balance <= 0.1) ri++;
        }
        return result;
    }, [toPay, toReceive]);

    const columns = [
        {
            title: 'Date',
            dataIndex: 'date',
            key: 'date',
            sorter: (a, b) => dayjs(a.date).unix() - dayjs(b.date).unix(),
            render: (date) => dayjs(date).format('DD MMM'),
        },
        {
            title: 'Details',
            dataIndex: 'details',
            key: 'details',
            ellipsis: true,
        },
        {
            title: 'Cost (৳)',
            dataIndex: 'cost',
            key: 'cost',
            render: (cost) => <strong>{cost.toLocaleString()}</strong>,
            sorter: (a, b) => a.cost - b.cost,
        },
        {
            title: 'Payers',
            dataIndex: 'addedBy',
            key: 'addedBy',
            render: (tags) => (
                <Space size={[0, 4]} wrap>
                    {tags.map(tag => <Tag key={tag} color="blue">{tag}</Tag>)}
                </Space>
            ),
        },
    ];

    const exportToExcel = () => {
        const dataToExport = filteredExpenses.map(item => ({
            Date: dayjs(item.date).format('YYYY-MM-DD'),
            'Bajar Details': item.details,
            'Total Cost (৳)': item.cost,
            'Payers': item.addedBy.join(', ')
        }));

        dataToExport.push({});
        dataToExport.push({ Date: 'SUMMARY', 'Bajar Details': 'Total Expense', 'Total Cost (৳)': totalExpense });
        dataToExport.push({ Date: 'SUMMARY', 'Bajar Details': 'Share Per Person', 'Total Cost (৳)': perPersonShare.toFixed(2) });

        const ws = XLSX.utils.json_to_sheet(dataToExport);
        const wb = XLSX.utils.book_new();
        XLSX.utils.book_append_sheet(wb, ws, "Expenses");
        XLSX.writeFile(wb, `BajarBros_Report_${dayjs().format('MMM_YYYY')}.xlsx`);
        notification.success({ message: 'Export Successful' });
    };

    return (
        <Space direction="vertical" size="large" style={{ display: 'flex' }}>
            <Row gutter={[16, 16]}>
                <Col xs={24} md={12}>
                    <Card bordered={false} className="summary-card" gradient="linear-gradient(135deg, #e6f7ff 0%, #ffffff 100%)">
                        <Statistic
                            title="Total Mess Expense"
                            value={totalExpense}
                            precision={2}
                            prefix="৳"
                            valueStyle={{ color: '#1890ff', fontWeight: 'bold' }}
                        />
                        <Text type="secondary">{dayjs(dateRange[0]).format('MMM D')} - {dayjs(dateRange[1]).format('MMM D, YYYY')}</Text>
                    </Card>
                </Col>
                <Col xs={24} md={12}>
                    <Card bordered={false} className="summary-card">
                        <Statistic
                            title="Per Person Share"
                            value={perPersonShare}
                            precision={2}
                            prefix="৳"
                            valueStyle={{ color: '#52c41a', fontWeight: 'bold' }}
                            suffix={<Text size="small" type="secondary">/ {members.length} members</Text>}
                        />
                        <Text type="secondary">Equal split for current members</Text>
                    </Card>
                </Col>
            </Row>

            <Row gutter={[16, 16]}>
                <Col xs={24} lg={16}>
                    <Card
                        title="Recent Bajar Records"
                        extra={
                            <Space wrap>
                                <RangePicker size="small" value={dateRange} onChange={setDateRange} />
                                <Input
                                    size="small"
                                    placeholder="Search..."
                                    prefix={<SearchOutlined />}
                                    onChange={e => setSearchText(e.target.value)}
                                    style={{ width: 150 }}
                                />
                                <Button size="small" type="primary" icon={<DownloadOutlined />} onClick={exportToExcel}>Export</Button>
                            </Space>
                        }
                    >
                        <Table
                            columns={columns}
                            dataSource={filteredExpenses}
                            rowKey="id"
                            pagination={{ pageSize: 6 }}
                            size="small"
                        />
                    </Card>
                </Col>

                <Col xs={24} lg={8}>
                    <Card title={<><TransactionOutlined /> Settlement Summary</>} className="fade-in-content shadow-sm">
                        <Divider orientation="left" plain><Badge status="success" text="To Receive" /></Divider>
                        <List
                            size="small"
                            dataSource={toReceive}
                            renderItem={item => (
                                <List.Item extra={<Text type="success" strong>+৳{item.balance.toFixed(0)}</Text>}>
                                    <Space><ArrowUpOutlined style={{ color: '#52c41a' }} /> {item.name}</Space>
                                </List.Item>
                            )}
                        />

                        <Divider orientation="left" plain><Badge status="error" text="To Pay" /></Divider>
                        <List
                            size="small"
                            dataSource={toPay}
                            renderItem={item => (
                                <List.Item extra={<Text type="danger" strong>-৳{Math.abs(item.balance).toFixed(0)}</Text>}>
                                    <Space><ArrowDownOutlined style={{ color: '#f5222d' }} /> {item.name}</Space>
                                </List.Item>
                            )}
                        />

                        {suggestions.length > 0 && (
                            <>
                                <Divider orientation="left" plain><Text type="secondary">Suggestions</Text></Divider>
                                <div style={{ background: '#fafafa', padding: '12px', borderRadius: '8px' }}>
                                    {suggestions.map((s, idx) => (
                                        <div key={idx} style={{ marginBottom: '4px', fontSize: '13px' }}>
                                            <Tag color="orange" style={{ marginRight: '4px' }}>Split</Tag>
                                            {s}
                                        </div>
                                    ))}
                                </div>
                            </>
                        )}
                    </Card>
                </Col>
            </Row>
        </Space>
    );
};

export default Dashboard;
