import React, { useState, useEffect } from 'react'
import { Card, Row, Col, Statistic, Button, Space, Table, Modal, Form, Input, Select } from 'antd'
import { PlusOutlined, UserAddOutlined } from '@ant-design/icons'
import axios from 'axios'

const API_BASE_URL = 'http://localhost:3000/api'

function CustomersPage() {
  const [customers, setCustomers] = useState([])
  const [loading, setLoading] = useState(false)
  const [isModalVisible, setIsModalVisible] = useState(false)
  const [form] = Form.useForm()

  useEffect(() => {
    fetchCustomers()
  }, [])

  const fetchCustomers = async () => {
    setLoading(true)
    try {
      const response = await axios.get(`${API_BASE_URL}/customers`)
      setCustomers(response.data.data || [])
    } catch (error) {
      console.error('获取客户列表失败:', error)
    }
    setLoading(false)
  }

  const handleAddCustomer = async (values) => {
    try {
      await axios.post(`${API_BASE_URL}/customers`, values)
      setIsModalVisible(false)
      form.resetFields()
      fetchCustomers()
    } catch (error) {
      console.error('添加客户失败:', error)
    }
  }

  const columns = [
    {
      title: '客户名称',
      dataIndex: 'name',
      key: 'name',
    },
    {
      title: '手机号',
      dataIndex: 'phone',
      key: 'phone',
    },
    {
      title: '客户类型',
      dataIndex: 'type',
      key: 'type',
      render: (type) => {
        const typeMap = {
          residential: '住宅客户',
          commercial: '商业客户',
          casual: '散客',
        }
        return typeMap[type] || type
      },
    },
    {
      title: '欠桶数',
      dataIndex: 'bottleDebt',
      key: 'bottleDebt',
    },
    {
      title: '水票数',
      dataIndex: 'tickets',
      key: 'tickets',
    },
    {
      title: '创建时间',
      dataIndex: 'createdAt',
      key: 'createdAt',
      render: (date) => new Date(date).toLocaleDateString(),
    },
  ]

  return (
    <div>
      <Card style={{ marginBottom: '20px' }}>
        <Row gutter={16}>
          <Col xs={24} sm={12} md={6}>
            <Statistic title="总客户数" value={customers.length} />
          </Col>
          <Col xs={24} sm={12} md={6}>
            <Statistic
              title="住宅客户"
              value={customers.filter(c => c.type === 'residential').length}
            />
          </Col>
          <Col xs={24} sm={12} md={6}>
            <Statistic
              title="商业客户"
              value={customers.filter(c => c.type === 'commercial').length}
            />
          </Col>
          <Col xs={24} sm={12} md={6}>
            <Statistic
              title="散客"
              value={customers.filter(c => c.type === 'casual').length}
            />
          </Col>
        </Row>
      </Card>

      <Card title="客户列表">
        <Space style={{ marginBottom: '16px' }}>
          <Button
            type="primary"
            icon={<UserAddOutlined />}
            onClick={() => setIsModalVisible(true)}
          >
            添加客户
          </Button>
        </Space>

        <Table
          columns={columns}
          dataSource={customers}
          loading={loading}
          rowKey="_id"
          pagination={{ pageSize: 10 }}
        />
      </Card>

      <Modal
        title="添加客户"
        visible={isModalVisible}
        onCancel={() => {
          setIsModalVisible(false)
          form.resetFields()
        }}
        onOk={() => form.submit()}
      >
        <Form
          form={form}
          layout="vertical"
          onFinish={handleAddCustomer}
        >
          <Form.Item
            label="客户名称"
            name="name"
            rules={[{ required: true, message: '请输入客户名称' }]}
          >
            <Input />
          </Form.Item>

          <Form.Item
            label="手机号"
            name="phone"
            rules={[
              { required: true, message: '请输入手机号' },
              { pattern: /^1[3-9]\d{9}$/, message: '请输入有效的手机号' },
            ]}
          >
            <Input />
          </Form.Item>

          <Form.Item
            label="客户类型"
            name="type"
            rules={[{ required: true, message: '请选择客户类型' }]}
          >
            <Select
              options={[
                { label: '住宅客户', value: 'residential' },
                { label: '商业客户', value: 'commercial' },
                { label: '散客', value: 'casual' },
              ]}
            />
          </Form.Item>
        </Form>
      </Modal>
    </div>
  )
}

export default CustomersPage
