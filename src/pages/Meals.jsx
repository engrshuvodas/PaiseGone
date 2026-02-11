/** Software Version: 2.3 | Dev: Engr Shuvo Das **/
import React, { useState, useContext, useMemo } from 'react';
import { Card, Table, Typography, Space, Button, DatePicker, InputNumber, Row, Col, notification, Divider, Tag, Empty } from 'antd';
import {
    CoffeeOutlined,
    FireOutlined,
    MoonOutlined,
    SaveOutlined,
    HistoryOutlined,
    CalendarOutlined,
    UserOutlined,
    ArrowLeftOutlined
} from '@ant-design/icons';
import { AppContext } from '../context/AppContext';
import dayjs from 'dayjs';

const { Title, Text } = Typography;

const Meals = () => {
    const { members, meals, addMeal, deleteMeal } = useContext(AppContext);
    const [selectedDate, setSelectedDate] = useState(dayjs());
    const [mealData, setMealData] = useState({});

    // Load existing meals for the selected date
    const existingMeal = useMemo(() => {
        const dateStr = selectedDate.format('YYYY-MM-DD');
        return meals.find(m => m.date === dateStr);
    }, [meals, selectedDate]);

    // Update internal mealData state when date or existingMeal changes
    React.useEffect(() => {
        if (existingMeal) {
            setMealData(existingMeal.meals || {});
        } else {
            // Reset to 0 for all members
            const reset = {};
            members.forEach(m => {
                reset[m.id] = { breakfast: 0, lunch: 0, dinner: 0 };
            });
            setMealData(reset);
        }
    }, [existingMeal, members, selectedDate]);

    const handleMealChange = (memberId, type, value) => {
        setMealData(prev => ({
            ...prev,
            [memberId]: {
                ...(prev[memberId] || { breakfast: 0, lunch: 0, dinner: 0 }),
                [type]: value || 0
            }
        }));
    };

    const handleSave = async () => {
        try {
            await addMeal(selectedDate.format('YYYY-MM-DD'), mealData);
            notification.success({
                message: 'Meals Updated',
                description: `Successfully saved meals for ${selectedDate.format('DD MMM YYYY')}`,
                placement: 'bottomRight'
            });
        } catch (e) {
            notification.error({ message: 'Error saving meals' });
        }
    };

    const columns = [
        {
            title: 'Member Name',
            key: 'name',
            render: (_, record) => (
                <Space>
                    <div style={{ background: 'rgba(24, 144, 255, 0.1)', padding: '6px', borderRadius: '50%', display: 'flex' }}>
                        <UserOutlined style={{ color: '#1890ff' }} />
                    </div>
                    <Text strong>{record.name}</Text>
                </Space>
            )
        },
        {
            title: <><CoffeeOutlined /> Breakfast</>,
            key: 'breakfast',
            align: 'center',
            render: (_, record) => (
                <InputNumber
                    min={0}
                    step={0.5}
                    value={mealData[record.id]?.breakfast}
                    onChange={(val) => handleMealChange(record.id, 'breakfast', val)}
                    style={{ borderRadius: 8, width: '100%' }}
                />
            )
        },
        {
            title: <><FireOutlined /> Lunch</>,
            key: 'lunch',
            align: 'center',
            render: (_, record) => (
                <InputNumber
                    min={0}
                    step={0.5}
                    value={mealData[record.id]?.lunch}
                    onChange={(val) => handleMealChange(record.id, 'lunch', val)}
                    style={{ borderRadius: 8, width: '100%' }}
                />
            )
        },
        {
            title: <><MoonOutlined /> Dinner</>,
            key: 'dinner',
            align: 'center',
            render: (_, record) => (
                <InputNumber
                    min={0}
                    step={0.5}
                    value={mealData[record.id]?.dinner}
                    onChange={(val) => handleMealChange(record.id, 'dinner', val)}
                    style={{ borderRadius: 8, width: '100%' }}
                />
            )
        },
        {
            title: 'Daily Total',
            key: 'total',
            align: 'right',
            render: (_, record) => {
                const m = mealData[record.id] || { breakfast: 0, lunch: 0, dinner: 0 };
                const total = (m.breakfast || 0) + (m.lunch || 0) + (m.dinner || 0);
                return <Text strong style={{ color: '#ff4d4f' }}>{total}</Text>;
            }
        }
    ];

    const totalMealsToday = useMemo(() => {
        return Object.values(mealData).reduce((sum, member) => {
            return sum + (member.breakfast || 0) + (member.lunch || 0) + (member.dinner || 0);
        }, 0);
    }, [mealData]);

    return (
        <div className="fade-in-up" style={{ maxWidth: 1000, margin: '0 auto' }}>
            <Row gutter={[24, 24]} align="middle" style={{ marginBottom: 24 }}>
                <Col xs={24} md={12}>
                    <Space size="middle">
                        <div style={{ background: 'var(--primary-gradient)', padding: 10, borderRadius: 12, display: 'flex' }}>
                            <HistoryOutlined style={{ color: 'white', fontSize: 20 }} />
                        </div>
                        <div>
                            <Title level={4} style={{ margin: 0 }}>Daily Meal Tracker</Title>
                            <Text type="secondary">Record breakfast, lunch and dinner</Text>
                        </div>
                    </Space>
                </Col>
                <Col xs={24} md={12} style={{ textAlign: 'right' }}>
                    <DatePicker
                        value={selectedDate}
                        onChange={setSelectedDate}
                        style={{ borderRadius: 10, height: 48, minWidth: 200 }}
                        variant="filled"
                        allowClear={false}
                    />
                </Col>
            </Row>

            <Card
                className="premium-card"
                title={
                    <Space>
                        <CalendarOutlined style={{ color: '#ff5f6d' }} />
                        <span>Attendance for {selectedDate.format('DD MMMM YYYY')}</span>
                        {existingMeal && <Tag color="success">Recorded</Tag>}
                    </Space>
                }
                extra={
                    <Space>
                        <Text type="secondary">Total Meals:</Text>
                        <Tag color="orange" style={{ fontSize: 16, padding: '4px 12px' }}>{totalMealsToday}</Tag>
                    </Space>
                }
            >
                <Table
                    columns={columns}
                    dataSource={members}
                    rowKey="id"
                    pagination={false}
                    className="meals-table"
                />

                <Divider />

                <div style={{ textAlign: 'right' }}>
                    <Button
                        type="primary"
                        size="large"
                        icon={<SaveOutlined />}
                        onClick={handleSave}
                        style={{ padding: '0 40px', height: 50, borderRadius: 12 }}
                    >
                        Save Today's Meals
                    </Button>
                </div>
            </Card>

            <Card className="premium-card info-box" style={{ marginTop: 24, border: 'none' }}>
                <Space>
                    <FireOutlined className="info-box-title" />
                    <Text className="info-box-title" strong>Note:</Text>
                    <Text type="secondary">You can enter partial segments (e.g. 0.5) if someone skips a partial meal or shares.</Text>
                </Space>
            </Card>
        </div>
    );
};

export default Meals;
