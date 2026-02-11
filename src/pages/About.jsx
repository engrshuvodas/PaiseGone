import React from 'react';
import { Card, Typography, Space, Divider, Row, Col, Tag, Button, Progress, Tooltip, Badge } from 'antd';
import {
    InfoCircleOutlined,
    GlobalOutlined,
    GithubOutlined,
    LinkedinOutlined,
    YoutubeOutlined,
    TwitterOutlined,
    FacebookOutlined,
    WhatsAppOutlined,
    MailOutlined,
    PhoneOutlined,
    RocketOutlined,
    UserOutlined,
    CodeOutlined
} from '@ant-design/icons';

const { Title, Text, Paragraph } = Typography;

const About = () => {
    const socialLinks = [
        { icon: <WhatsAppOutlined />, label: 'WhatsApp', url: 'https://wa.me/+8801765245872', color: '#25D366' },
        { icon: <LinkedinOutlined />, label: 'LinkedIn', url: 'https://www.linkedin.com/in/engrshuvoda/', color: '#0077B5' },
        { icon: <GithubOutlined />, label: 'GitHub', url: 'https://github.com/engrshuvodas', color: '#181717' },
        { icon: <YoutubeOutlined />, label: 'YouTube', url: 'https://www.youtube.com/channel/UCEJ0R871tF2PLT27q9azYWg', color: '#FF0000' },
        { icon: <TwitterOutlined />, label: 'X (Twitter)', url: 'https://x.com/engrshuvodas', color: '#1DA1F2' },
        { icon: <FacebookOutlined />, label: 'Facebook', url: 'https://www.facebook.com/engr.shuvo74886/', color: '#1877F2' },
        { icon: <GlobalOutlined />, label: 'Portfolio', url: 'https://engrshuvodas.github.io/me/', color: '#4A90E2' },
        { icon: <MailOutlined />, label: 'Email', url: 'mailto:engrshuvoda@gmail.com', color: '#EA4335' },
    ];

    return (
        <div style={{ padding: '24px', maxWidth: '1000px', margin: '0 auto' }}>
            <Card
                className="premium-card"
                style={{
                    borderRadius: '24px',
                    overflow: 'hidden',
                    border: 'none',
                    boxShadow: '0 15px 35px rgba(0,0,0,0.05)'
                }}
            >
                <div style={{ textAlign: 'center', marginBottom: '40px' }}>
                    <Title level={2} style={{ margin: 0, color: '#ff4d4f' }}>
                        Software Details
                    </Title>
                    <Divider />
                    <Space direction="vertical" size="middle" style={{ width: '100%' }}>
                        <div>
                            <Text strong style={{ fontSize: '18px' }}>Software Name: </Text>
                            <Text style={{ fontSize: '18px' }}>MessMate (PaiseGone)</Text>
                        </div>
                        <div>
                            <Tag color="red" style={{ padding: '4px 12px', fontSize: '14px', borderRadius: '8px' }}>
                                Version 2.3
                            </Tag>
                        </div>
                        <div>
                            <Text type="secondary">Latest Update Date: </Text>
                            <Text strong>February 10, 2026</Text>
                        </div>
                    </Space>
                </div>

                <Divider orientation="left">What's New in Version 2.3</Divider>
                <div style={{ marginBottom: '40px' }}>
                    <Space direction="vertical" size="small">
                        <Text><RocketOutlined style={{ color: '#ff4d4f', marginRight: 8 }} /> **Advanced Meal Management System** added.</Text>
                        <Text><RocketOutlined style={{ color: '#ff4d4f', marginRight: 8 }} /> **Category-based Expense Tracking** (Rent, Utilities, etc.).</Text>
                        <Text><RocketOutlined style={{ color: '#ff4d4f', marginRight: 8 }} /> **Premium Dark Mode** fully optimized for all containers.</Text>
                        <Text><RocketOutlined style={{ color: '#ff4d4f', marginRight: 8 }} /> Monthly Settlement archives and reset functionality.</Text>
                        <Text><RocketOutlined style={{ color: '#ff4d4f', marginRight: 8 }} /> Enhanced PDF & Excel reports with meal rate calculation.</Text>
                    </Space>
                </div>

                <Divider orientation="left">What's New in Version 2.2</Divider>
                <div style={{ marginBottom: '40px' }}>
                    <Space direction="vertical" size="small">
                        <Text><RocketOutlined style={{ color: '#ff4d4f', marginRight: 8 }} /> Added **Settlement Summary** with WhatsApp Automation.</Text>
                        <Text><RocketOutlined style={{ color: '#ff4d4f', marginRight: 8 }} /> personalized WhatsApp messaging for member dues.</Text>
                        <Text><RocketOutlined style={{ color: '#ff4d4f', marginRight: 8 }} /> Added phone number management for mess members.</Text>
                        <Text><RocketOutlined style={{ color: '#ff4d4f', marginRight: 8 }} /> Real-time message preview before sending.</Text>
                        <Text><RocketOutlined style={{ color: '#ff4d4f', marginRight: 8 }} /> Integrated profile photos in member lists.</Text>
                    </Space>
                </div>

                <Divider orientation="left">What's New in Version 2.1</Divider>
                <div style={{ marginBottom: '40px' }}>
                    <Space direction="vertical" size="small">
                        <Text><RocketOutlined style={{ color: '#ff4d4f', marginRight: 8 }} /> Added dedicated About Section with creator details.</Text>
                        <Text><RocketOutlined style={{ color: '#ff4d4f', marginRight: 8 }} /> Modernized UI components for a more premium feel.</Text>
                        <Text><RocketOutlined style={{ color: '#ff4d4f', marginRight: 8 }} /> Optimized expense calculation algorithms.</Text>
                        <Text><RocketOutlined style={{ color: '#ff4d4f', marginRight: 8 }} /> Enhanced mobile responsiveness and navigation.</Text>
                        <Text><RocketOutlined style={{ color: '#ff4d4f', marginRight: 8 }} /> Updated software version tracking across the project.</Text>
                    </Space>
                </div>

                <Divider orientation="left">How It Works</Divider>
                <Paragraph style={{ fontSize: '16px', lineHeight: '1.8' }}>
                    MessMate (PaiseGone) is a comprehensive expense management solution designed specifically for shared living spaces (messes) and student hostels.
                    It simplifies the complex process of tracking daily "bajar" (grocery shopping), monthly utility expenses, and Individual member contributions.
                    The software automatically calculates total costs, meal rates, and individual balances, ensuring transparency and reducing conflicts within the mess.
                    With its intuitive dashboard, members can easily see who owes what and track their spending habits over time.
                </Paragraph>

                <Divider orientation="left">Technology Statistics</Divider>
                <div style={{ marginBottom: '40px', padding: '0 20px' }}>
                    <Text type="secondary" style={{ display: 'block', marginBottom: '20px' }}>
                        This project is built using modern web standards. Here is the language breakdown:
                    </Text>

                    {/* Premium Animated Progress Bar */}
                    <div className="progress-container" style={{
                        height: '14px',
                        width: '100%',
                        borderRadius: '10px',
                        display: 'flex',
                        overflow: 'hidden',
                        marginBottom: '25px'
                    }}>
                        <Tooltip title="JavaScript (JSX): 88.5%">
                            <div style={{
                                width: '88.5%',
                                height: '100%',
                                backgroundColor: '#f1e05a',
                                transition: 'width 1.5s ease-in-out',
                                position: 'relative'
                            }}>
                                <div className="bar-glow" style={{ position: 'absolute', top: 0, left: 0, right: 0, bottom: 0, background: 'linear-gradient(90deg, transparent, rgba(255,255,255,0.3), transparent)', animation: 'glow 2s infinite' }} />
                            </div>
                        </Tooltip>
                        <Tooltip title="CSS: 8.2%">
                            <div style={{
                                width: '8.2%',
                                height: '100%',
                                backgroundColor: '#563d7c',
                                transition: 'width 1.5s ease-in-out 0.2s'
                            }} />
                        </Tooltip>
                        <Tooltip title="HTML / Others: 3.3%">
                            <div style={{
                                width: '3.3%',
                                height: '100%',
                                backgroundColor: '#e34c26',
                                transition: 'width 1.5s ease-in-out 0.4s'
                            }} />
                        </Tooltip>
                    </div>

                    <Row gutter={[24, 16]} justify="center">
                        <Col>
                            <Space align="center" style={{ padding: '4px 12px', background: '#f1e05a15', borderRadius: '8px' }}>
                                <Badge color="#f1e05a" />
                                <Text strong style={{ color: '#857a1e' }}>JavaScript</Text>
                                <Text type="secondary">88.5%</Text>
                            </Space>
                        </Col>
                        <Col>
                            <Space align="center" style={{ padding: '4px 12px', background: '#563d7c15', borderRadius: '8px' }}>
                                <Badge color="#563d7c" />
                                <Text strong style={{ color: '#563d7c' }}>CSS</Text>
                                <Text type="secondary">8.2%</Text>
                            </Space>
                        </Col>
                        <Col>
                            <Space align="center" style={{ padding: '4px 12px', background: '#e34c2615', borderRadius: '8px' }}>
                                <Badge color="#e34c26" />
                                <Text strong style={{ color: '#e34c26' }}>HTML</Text>
                                <Text type="secondary">3.3%</Text>
                            </Space>
                        </Col>
                    </Row>
                </div>

                <style>{`
                    @keyframes glow {
                        0% { transform: translateX(-100%); }
                        100% { transform: translateX(100%); }
                    }
                `}</style>

                <Divider orientation="left">About the Creator</Divider>
                <Row gutter={[24, 24]} align="middle">
                    <Col xs={24} md={6} style={{ textAlign: 'center' }}>
                        <div className="profile-avatar-container" style={{
                            width: '120px',
                            height: '120px',
                            borderRadius: '50%',
                            overflow: 'hidden',
                            margin: '0 auto',
                        }}>
                            <img
                                src="/engr_shuvo.jpg"
                                alt="Engr Shuvo Das"
                                style={{
                                    width: '100%',
                                    height: '100%',
                                    objectFit: 'cover'
                                }}
                            />
                        </div>
                    </Col>
                    <Col xs={24} md={18}>
                        <Title level={3} style={{ marginBottom: '8px' }}>Engr Shuvo Das</Title>
                        <Paragraph>
                            Software Engineer & Creative Developer. I build modern, high-performance web applications that solve real-world problems with elegant design and robust architecture.
                        </Paragraph>

                        <Space wrap size="middle">
                            {socialLinks.map((link, index) => (
                                <Button
                                    key={index}
                                    type="default"
                                    icon={link.icon}
                                    href={link.url}
                                    target="_blank"
                                    shape="round"
                                    style={{
                                        color: link.color,
                                        borderColor: link.color + '40',
                                        background: link.color + '08',
                                        display: 'flex',
                                        alignItems: 'center'
                                    }}
                                >
                                    {link.label}
                                </Button>
                            ))}
                        </Space>
                    </Col>
                </Row>

                <div style={{ marginTop: '40px', textAlign: 'center' }}>
                    <Text type="secondary">
                        Need professional services? Find me on <a href="https://www.fiverr.com/shuvo_das74886" target="_blank" rel="noopener noreferrer" style={{ color: '#1dbf73', fontWeight: 600 }}>Fiverr</a>
                    </Text>
                </div>
            </Card>
        </div>
    );
};

export default About;
