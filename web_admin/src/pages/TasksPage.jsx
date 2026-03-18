import React, { useState, useEffect } from 'react'
import { Card, Row, Col, Statistic, Button, Space, Table, Modal, Form, Input, Select, DatePicker } from 'antd'
import { PlusOutlined } from '@ant-design/icons'
import axios from 'axios'

const API_BASE_URL = 'http://localhost:3000/api'

function TasksPage() {
  const [tasks, setTasks] = useState([])
  const [loading, setLoading] = useState(false)
  const [isModalVisible, setIsModalVisible] = useState(false)
  const [form] = Form.useForm()
  const [filters, setFilters] = useState({})

  useEffect(() => {
    fetchTasks()
  }, [])

  const fetchTasks = async () => {
    setLoading(true)
    try {
      const response = await axios.get(`${API_BASE_URL}/tasks`, { params: filters })
      setTasks(response.data.data || [])
    } catch (error) {
      console.error('获取任务列表失败:', error)
    }
    setLoading(false)
  }

  const handleCreateTask = async (values) => {
    try {
      await axios.post(`${API_BASE_URL}/tasks`, values)
      setIsModalVisible(false)
      form.resetFields()
      fetchTasks()
    } catch (error) {
      console.error('创建任务失败:', error)
    }
  }

  const columns = [
    {
      title: '客户名称',
      dataIndex: 'customerName',
      key: 'customerName',
    },
    {
      title: '手机号',
      dataIndex: 'customerPhone',
      key: 'customerPhone',
    },
    {
      title: '收货地址',
      dataIndex: 'address',
      key: 'address',
      width: 200,
    },
    {
      title: '品牌',
      dataIndex: 'productBrand',
      key: 'productBrand',
    },
    {
      title: '数量',
      dataIndex: 'quantity',
      key: 'quantity',
    },
    {
      title: '金额',
      dataIndex: 'price',
      key: 'price',
      render: (price) => `¥${price.toFixed(2)}`,
    },
    {
      title: '状态',
      dataIndex: 'status',
      key: 'status',
      render: (status) => {
        const statusMap = {
          pending: '待接单',
          accepted: '进行中',
          completed: '已完成',
          cancelled: '已取消',
        }
        return statusMap[status] || status
      },
    },
    {
      title: '创建时间',
      dataIndex: 'createdAt',
      key: 'createdAt',
      render: (date) => new Date(date).toLocaleString(),
    },
  ]

  const statusStats = {
    pending: tasks.filter(t => t.status === 'pending').length,
    accepted: tasks.filter(t => t.status === 'accepted').length,
    completed: tasks.filter(t => t.status === 'completed').length,
    totalPrice: tasks.reduce((sum, t) => sum + t.price, 0),
  }

  return (
    <div>
      <Card style={{ marginBottom: '20px' }}>
        <Row gutter={16}>
          <Col xs={24} sm={12} md={6}>
            <Statistic title="待接单" value={statusStats.pending} />
          </Col>
          <Col xs={24} sm={12} md={6}>
            <Statistic title="进行中" value={statusStats.accepted} />
          </Col>
          <Col xs={24} sm={12} md={6}>
            <Statistic title="已完成" value={statusStats.completed} />
          </Col>
          <Col xs={24} sm={12} md={6}>
            <Statistic
              title="总金额"
              value={statusStats.totalPrice}
              precision={2}
              prefix="¥"
            />
          </Col>
        </Row>
      </Card>

      <Card title="任务列表">
        <Space style={{ marginBottom: '16px' }}>
          <Button
            type="primary"
            icon={<PlusOutlined />}
            onClick={() => setIsModalVisible(true)}
          >
            发布任务
          </Button>
          <Select
            style={{ width: 120 }}
            placeholder="筛选状态"
            onChange={(status) => {
              setFilters({ ...filters, status: status || undefined })
            }}
            options={[
              { label: '全部', value: undefined },
              { label: '待接单', value: 'pending' },
              { label: '进行中', value: 'accepted' },
              { label: '已完成', value: 'completed' },
            ]}
          />
        </Space>

        <Table
          columns={columns}
          dataSource={tasks}
          loading={loading}
          rowKey="_id"
          pagination={{ pageSize: 10 }}
          scroll={{ x: true }}
        />
      </Card>

      <Modal
        title="发布任务"
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
          onFinish={handleCreateTask}
        >
          <Form.Item
            label="客户名称"
            name="customerName"
            rules={[{ required: true }]}
          >
            <Input />
          </Form.Item>

          <Form.Item
            label="客户手机号"
            name="customerPhone"
            rules={[{ required: true }]}
          >
            <Input />
          </Form.Item>

          <Form.Item
            label="收货地址"
            name="address"
            rules={[{ required: true }]}
          >
            <Input.TextArea rows={2} />
          </Form.Item>

          <Form.Item
            label="品牌"
            name="productBrand"
            rules={[{ required: true }]}
          >
            <Input />
          </Form.Item>

          <Form.Item
            label="数量"
            name="quantity"
            rules={[{ required: true }]}
          >
            <Input type="number" />
          </Form.Item>

          <Form.Item
            label="金额"
            name="price"
            rules={[{ required: true }]}
          >
            <Input type="number" step="0.01" />
          </Form.Item>

          <Form.Item label="备注" name="notes">
            <Input.TextArea rows={2} />
          </Form.Item>
        </Form>
      </Modal>
    </div>
  )
}

export default TasksPage
