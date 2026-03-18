// Mock 内存数据库 - 用于快速测试，无需 MongoDB
// 数据存储在内存中，重启后丢失

class MockDB {
  constructor() {
    this.collections = {
      users: [],
      customers: [],
      tasks: [],
      orders: [],
      waterTickets: []
    }
    this.initSampleData()
  }

  // 初始化示例数据
  initSampleData() {
    // 示例用户
    this.collections.users = [
      {
        _id: '1',
        phone: '13800000000',
        password: '$2b$10$yQ7...encrypted', // 密码：123456
        role: 'admin',
        name: '管理员',
        createdAt: new Date()
      },
      {
        _id: '2',
        phone: '13800000001',
        password: '$2b$10$yQ7...encrypted', // 密码：123456
        role: 'delivery',
        name: '送水工-张三',
        createdAt: new Date()
      }
    ]

    // 示例客户
    this.collections.customers = [
      {
        _id: '101',
        name: '张家大宅',
        phone: '18600000001',
        address: '北京市朝阳区建国路1号',
        customerType: 'business',
        waterTickets: 50,
        emptyBuckets: 2,
        lastOrder: new Date('2026-03-15'),
        createdAt: new Date('2026-01-01')
      },
      {
        _id: '102',
        name: '李家住宅',
        phone: '18600000002',
        address: '北京市朝阳区建国路2号',
        customerType: 'residential',
        waterTickets: 20,
        emptyBuckets: 1,
        lastOrder: new Date('2026-03-14'),
        createdAt: new Date('2026-02-01')
      }
    ]

    // 示例订单
    this.collections.tasks = [
      {
        _id: '201',
        customerId: '101',
        customerName: '张家大宅',
        address: '北京市朝阳区建国路1号',
        waterBrand: '娃哈哈',
        capacity: 19,
        quantity: 2,
        status: 'pending',
        assignedTo: '2',
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        _id: '202',
        customerId: '102',
        customerName: '李家住宅',
        address: '北京市朝阳区建国路2号',
        waterBrand: '农夫山泉',
        capacity: 19,
        quantity: 1,
        status: 'completed',
        assignedTo: '2',
        createdAt: new Date(Date.now() - 86400000), // 1 天前
        updatedAt: new Date(Date.now() - 86400000)
      }
    ]
  }

  // 获取集合
  collection(name) {
    if (!this.collections[name]) {
      this.collections[name] = []
    }
    return new MockCollection(name, this.collections[name])
  }

  // 获取数据库
  db(name) {
    return this
  }
}

class MockCollection {
  constructor(name, data) {
    this.name = name
    this.data = data
  }

  // 创建索引（模拟）
  async createIndex(fields, options) {
    console.log(`✓ 创建索引: ${this.name} [Mock Mode]`)
    return this
  }

  // 查找单个文档
  async findOne(query) {
    return this.data.find(item => this.matchQuery(item, query)) || null
  }

  // 查找多个文档
  async find(query) {
    return {
      toArray: async () => {
        return this.data.filter(item => this.matchQuery(item, query))
      }
    }
  }

  // 插入一个
  async insertOne(doc) {
    if (!doc._id) {
      doc._id = Date.now().toString()
    }
    doc.createdAt = new Date()
    this.data.push(doc)
    return { insertedId: doc._id }
  }

  // 插入多个
  async insertMany(docs) {
    docs.forEach(doc => {
      if (!doc._id) {
        doc._id = Date.now().toString() + Math.random()
      }
      doc.createdAt = new Date()
      this.data.push(doc)
    })
    return { insertedIds: docs.map(d => d._id) }
  }

  // 更新一个
  async updateOne(query, update) {
    const index = this.data.findIndex(item => this.matchQuery(item, query))
    if (index !== -1) {
      const updateOp = update.$set || update
      Object.assign(this.data[index], updateOp)
      this.data[index].updatedAt = new Date()
      return { modifiedCount: 1 }
    }
    return { modifiedCount: 0 }
  }

  // 删除一个
  async deleteOne(query) {
    const index = this.data.findIndex(item => this.matchQuery(item, query))
    if (index !== -1) {
      this.data.splice(index, 1)
      return { deletedCount: 1 }
    }
    return { deletedCount: 0 }
  }

  // 计数
  async countDocuments(query) {
    return this.data.filter(item => this.matchQuery(item, query)).length
  }

  // 查询匹配
  matchQuery(item, query) {
    for (const key in query) {
      if (item[key] !== query[key]) {
        return false
      }
    }
    return true
  }
}

// 导出
export { MockDB, MockCollection }
