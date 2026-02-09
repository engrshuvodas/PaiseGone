import React, { useContext, useState } from 'react';
import { Table, Button, Card, Modal, Form, Input, Space, Typography, notification, Popconfirm, Avatar } from 'antd';
import { UserAddOutlined, EditOutlined, DeleteOutlined, UserOutlined, TeamOutlined } from '@ant-design/icons';
import { AppContext } from '../context/AppContext';

const { Title, Text } = Typography;

const ManageMembers = () => {
    const { members, addMember, updateMember, deleteMember } = useContext(AppContext);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [editingMember, setEditingMember] = useState(null);
    const [form] = Form.useForm();

    const handleAdd = () => {
        setEditingMember(null);
        form.resetFields();
        setIsModalOpen(true);
    };

    const handleEdit = (record) => {
        setEditingMember(record);
        form.setFieldsValue({ name: record.name });
        setIsModalOpen(true);
    };

    const handleDelete = async (id) => {
        try {
            await deleteMember(id);
            notification.success({
                message: 'Member Removed',
                description: 'The member has been removed from calculations.',
            });
        } catch (e) {
            notification.error({ message: 'Error removing member' });
        }
    };

    const handleOk = async () => {
        try {
            const values = await form.validateFields();
            if (editingMember) {
                await updateMember(editingMember.id, values.name);
                notification.success({ message: 'Member updated successfully' });
            } else {
                await addMember(values.name);
                notification.success({ message: 'New member added to the mess' });
            }
            setIsModalOpen(false);
            form.resetFields();
        } catch (error) {
            // Validation handled by form
        }
    };

    const columns = [
        {
            title: 'No.',
            key: 'index',
            render: (text, record, index) => <Text type="secondary">{index + 1}</Text>,
            width: 60,
        },
        {
            title: 'Member Name',
            dataIndex: 'name',
            key: 'name',
            render: (name) => (
                <Space>
                    <Avatar icon={<UserOutlined />} style={{ backgroundColor: '#1890ff' }} />
                    <Text strong>{name}</Text>
                </Space>
            )
        },
        {
            title: 'Actions',
            key: 'action',
            align: 'right',
            render: (_, record) => (
                <Space size="middle">
                    <Button
                        type="text"
                        icon={<EditOutlined />}
                        onClick={() => handleEdit(record)}
                    >
                        Edit
                    </Button>
                    <Popconfirm
                        title="Remove Member?"
                        description="All future calculations will split by the remaining members. Are you sure?"
                        onConfirm={() => handleDelete(record.id)}
                        okText="Yes"
                        cancelText="No"
                        okButtonProps={{ danger: true }}
                    >
                        <Button
                            type="text"
                            danger
                            icon={<DeleteOutlined />}
                        >
                            Delete
                        </Button>
                    </Popconfirm>
                </Space>
            ),
        },
    ];

    return (
        <Card
            bordered={false}
            className="shadow-sm"
            title={<Title level={3} style={{ margin: 0 }}><TeamOutlined /> Mess Members</Title>}
            extra={
                <Button
                    type="primary"
                    icon={<UserAddOutlined />}
                    onClick={handleAdd}
                    size="large"
                >
                    Add New Brother
                </Button>
            }
        >
            <Text type="secondary" style={{ display: 'block', marginBottom: '24px' }}>
                Manage the group of members sharing the mess. Currently: {members.length} members.
            </Text>

            <Table
                columns={columns}
                dataSource={members}
                rowKey="id"
                pagination={false}
                className="custom-table"
            />

            <Modal
                title={editingMember ? "Edit Member Details" : "Add New Brother"}
                open={isModalOpen}
                onOk={handleOk}
                onCancel={() => setIsModalOpen(false)}
                okText={editingMember ? "Update Name" : "Add Member"}
                destroyOnClose
            >
                <Form form={form} layout="vertical" style={{ marginTop: '16px' }}>
                    <Form.Item
                        name="name"
                        label="Full Name"
                        rules={[
                            { required: true, message: 'Name is required' },
                            { min: 3, message: 'Name too short' }
                        ]}
                    >
                        <Input placeholder="e.g. Shuvo Das" prefix={<UserOutlined />} />
                    </Form.Item>
                </Form>
            </Modal>
        </Card>
    );
};

export default ManageMembers;
