import React, { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { Button, Form, Input, Card, Space, Alert } from 'antd'
import { LockOutlined, PhoneOutlined } from '@ant-design/icons'
import { useAuthStore } from '../store/authStore'
import styles from './LoginPage.module.css'

function LoginPage() {
  const navigate = useNavigate()
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const { login } = useAuthStore()

  const onFinish = async (values) => {
    setLoading(true)
    setError('')

    const success = await login(values.phone, values.password)
    
    setLoading(false)
    
    if (success) {
      navigate('/')
    } else {
      setError('登录失败，请检查手机号和密码')
    }
  }

  return (
    <div className={styles.container}>
      <Card className={styles.card} title="桶装水配送管理系统">
        <Space direction="vertical" size="large" style={{ width: '100%' }}>
          {error && <Alert message={error} type="error" showIcon />}
          
          <Form
            layout="vertical"
            onFinish={onFinish}
            autoComplete="off"
          >
            <Form.Item
              label="手机号"
              name="phone"
              rules={[
                { required: true, message: '请输入手机号' },
                { pattern: /^1[3-9]\d{9}$/, message: '请输入有效的手机号' },
              ]}
            >
              <Input
                prefix={<PhoneOutlined />}
                placeholder="请输入手机号"
                size="large"
              />
            </Form.Item>

            <Form.Item
              label="密码"
              name="password"
              rules={[
                { required: true, message: '请输入密码' },
              ]}
            >
              <Input.Password
                prefix={<LockOutlined />}
                placeholder="请输入密码"
                size="large"
              />
            </Form.Item>

            <Form.Item>
              <Button
                type="primary"
                htmlType="submit"
                size="large"
                block
                loading={loading}
              >
                登 录
              </Button>
            </Form.Item>
          </Form>

          <div style={{ textAlign: 'center', color: '#999' }}>
            <p>演示账号：13800000000 / 123456</p>
          </div>
        </Space>
      </Card>
    </div>
  )
}

export default LoginPage
