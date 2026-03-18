import React from 'react'
import { Card, Row, Col, Statistic } from 'antd'

function StatsPage() {
  return (
    <div>
      <Card title="统计分析">
        <Row gutter={16}>
          <Col xs={24} sm={12} md={8}>
            <Statistic title="待开发" value="功能开发中" />
          </Col>
        </Row>
        
        <div style={{ marginTop: '20px', padding: '20px', backgroundColor: '#f0f9ff', borderRadius: '8px' }}>
          <h3>预计功能：</h3>
          <ul>
            <li>客户用水量统计（按天/月/年）</li>
            <li>销量统计与趋势分析</li>
            <li>批量导入导出客户资料</li>
            <li>订单频率统计</li>
            <li>上次订水时间统计</li>
            <li>图片识别 OCR（纸质存票）</li>
          </ul>
        </div>
      </Card>
    </div>
  )
}

export default StatsPage
