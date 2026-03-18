import React from 'react'
import { Outlet, useNavigate } from 'react-router-dom'
import { Layout, Menu, Dropdown, Avatar, Space } from 'antd'
import {
  DashboardOutlined,
  UserOutlined,
  FileTextOutlined,
  BarChartOutlined,
  LogoutOutlined,
} from '@ant-design/icons'
import { useAuthStore } from '../store/authStore'

const { Header, Sider, Content } = Layout

function LayoutComponent() {
  const navigate = useNavigate()
  const { user, logout } = useAuthStore()

  const menuItems = [
    {
      key: '/',
      icon: <DashboardOutlined />,
      label: '仪表板',
      onClick: () => navigate('/'),
    },
    {
      key: '/customers',
      icon: <UserOutlined />,
      label: '客户管理',
      onClick: () => navigate('/customers'),
    },
    {
      key: '/tasks',
      icon: <FileTextOutlined />,
      label: '任务管理',
      onClick: () => navigate('/tasks'),
    },
    {
      key: '/stats',
      icon: <BarChartOutlined />,
      label: '统计分析',
      onClick: () => navigate('/stats'),
    },
  ]

  const userMenuItems = [
    {
      key: 'logout',
      icon: <LogoutOutlined />,
      label: '退出登录',
      onClick: () => {
        logout()
        navigate('/login')
      },
    },
  ]

  return (
    <Layout style={{ minHeight: '100vh' }}>
      <Sider theme="light" width={200}>
        <div style={{ padding: '20px', textAlign: 'center' }}>
          <h2 style={{ margin: 0, color: '#0EA5E9' }}>桶装水配送</h2>
        </div>
        <Menu items={menuItems} mode="inline" />
      </Sider>

      <Layout>
        <Header
          style={{
            background: '#fff',
            padding: '0 20px',
            boxShadow: '0 2px 4px rgba(0,0,0,0.1)',
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
          }}
        >
          <div />
          <Dropdown menu={{ items: userMenuItems }}>
            <Space style={{ cursor: 'pointer' }}>
              <Avatar icon={<UserOutlined />} />
              <span>{user?.name || '管理员'}</span>
            </Space>
          </Dropdown>
        </Header>

        <Content style={{ padding: '20px' }}>
          <Outlet />
        </Content>
      </Layout>
    </Layout>
  )
}

export default LayoutComponent
