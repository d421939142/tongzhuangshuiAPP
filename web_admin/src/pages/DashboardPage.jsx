import React, { useState, useEffect } from 'react'
import { Card, Row, Col, Statistic } from 'antd'
import { LineChart, Line, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, PieChart, Pie, Cell } from 'recharts'
import axios from 'axios'

const API_BASE_URL = 'http://localhost:3000/api'
const COLORS = ['#0EA5E9', '#F59E0B', '#10B981', '#EF4444']

function DashboardPage() {
  const [stats, setStats] = useState({
    totalCustomers: 0,
    totalTasks: 0,
    totalRevenue: 0,
    completedTasks: 0,
    dailyData: [],
    taskStatusData: [],
  })

  useEffect(() => {
    fetchStats()
  }, [])

  const fetchStats = async () => {
    try {
      const customersRes = await axios.get(`${API_BASE_URL}/customers`)
      const tasksRes = await axios.get(`${API_BASE_URL}/tasks`)

      const customers = customersRes.data.data || []
      const tasks = tasksRes.data.data || []

      const completed = tasks.filter(t => t.status === 'completed')
      const totalRevenue = completed.reduce((sum, t) => sum + t.price, 0)

      const statusData = [
        { name: '待接单', value: tasks.filter(t => t.status === 'pending').length },
        { name: '进行中', value: tasks.filter(t => t.status === 'accepted').length },
        { name: '已完成', value: tasks.filter(t => t.status === 'completed').length },
        { name: '已取消', value: tasks.filter(t => t.status === 'cancelled').length },
      ]

      setStats({
        totalCustomers: customers.length,
        totalTasks: tasks.length,
        totalRevenue,
        completedTasks: completed.length,
        dailyData: generateDailyData(tasks),
        taskStatusData: statusData,
      })
    } catch (error) {
      console.error('获取统计数据失败:', error)
    }
  }

  const generateDailyData = (tasks) => {
    const days = 7
    const data = []
    for (let i = days - 1; i >= 0; i--) {
      const date = new Date()
      date.setDate(date.getDate() - i)
      const dateStr = date.toLocaleDateString()
      const dayTasks = tasks.filter(t => 
        new Date(t.createdAt).toLocaleDateString() === dateStr
      )
      data.push({
        date: dateStr,
        count: dayTasks.length,
        revenue: dayTasks.reduce((sum, t) => sum + t.price, 0),
      })
    }
    return data
  }

  return (
    <div>
      <Row gutter={16} style={{ marginBottom: '24px' }}>
        <Col xs={24} sm={12} md={6}>
          <Card>
            <Statistic title="总客户数" value={stats.totalCustomers} />
          </Card>
        </Col>
        <Col xs={24} sm={12} md={6}>
          <Card>
            <Statistic title="总任务数" value={stats.totalTasks} />
          </Card>
        </Col>
        <Col xs={24} sm={12} md={6}>
          <Card>
            <Statistic title="已完成任务" value={stats.completedTasks} />
          </Card>
        </Col>
        <Col xs={24} sm={12} md={6}>
          <Card>
            <Statistic
              title="总收入"
              value={stats.totalRevenue}
              precision={2}
              prefix="¥"
            />
          </Card>
        </Col>
      </Row>

      <Row gutter={16} style={{ marginBottom: '24px' }}>
        <Col xs={24} md={12}>
          <Card title="最近 7 天任务数量">
            <ResponsiveContainer width="100%" height={300}>
              <LineChart data={stats.dailyData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="date" />
                <YAxis />
                <Tooltip />
                <Legend />
                <Line type="monotone" dataKey="count" stroke="#0EA5E9" name="任务数" />
              </LineChart>
            </ResponsiveContainer>
          </Card>
        </Col>

        <Col xs={24} md={12}>
          <Card title="最近 7 天收入">
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={stats.dailyData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="date" />
                <YAxis />
                <Tooltip />
                <Legend />
                <Bar dataKey="revenue" fill="#F59E0B" name="收入（¥）" />
              </BarChart>
            </ResponsiveContainer>
          </Card>
        </Col>
      </Row>

      <Row gutter={16}>
        <Col xs={24} md={12}>
          <Card title="任务状态分布">
            <ResponsiveContainer width="100%" height={300}>
              <PieChart>
                <Pie
                  data={stats.taskStatusData}
                  cx="50%"
                  cy="50%"
                  labelLine={false}
                  label={({ name, value }) => `${name}: ${value}`}
                  outerRadius={80}
                  fill="#8884d8"
                  dataKey="value"
                >
                  {stats.taskStatusData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip />
              </PieChart>
            </ResponsiveContainer>
          </Card>
        </Col>
      </Row>
    </div>
  )
}

export default DashboardPage
