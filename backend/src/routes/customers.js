import express from 'express';
import { ObjectId } from 'mongodb';
import { verifyToken } from './auth.js';
import { v4 as uuidv4 } from 'uuid';

const router = express.Router();

// 获取客户列表
router.get('/', verifyToken, async (req, res) => {
  try {
    const { type, status, search } = req.query;
    
    let query = {};
    
    if (type) {
      query.type = type;
    }
    
    if (status) {
      query.status = status;
    }
    
    if (search) {
      query.$or = [
        { name: { $regex: search, $options: 'i' } },
        { phone: { $regex: search, $options: 'i' } },
      ];
    }
    
    const customers = await req.db
      .collection('customers')
      .find(query)
      .sort({ createdAt: -1 })
      .toArray();
    
    res.json({
      success: true,
      data: customers,
      count: customers.length,
    });
  } catch (error) {
    console.error('获取客户列表失败:', error);
    res.status(500).json({ error: '获取客户列表失败' });
  }
});

// 获取客户详情
router.get('/:id', verifyToken, async (req, res) => {
  try {
    const customer = await req.db
      .collection('customers')
      .findOne({ _id: new ObjectId(req.params.id) });
    
    if (!customer) {
      return res.status(404).json({ error: '客户不存在' });
    }
    
    res.json({ success: true, data: customer });
  } catch (error) {
    console.error('获取客户详情失败:', error);
    res.status(500).json({ error: '获取客户详情失败' });
  }
});

// 创建客户（仅管理员）
router.post('/', verifyToken, async (req, res) => {
  try {
    if (req.user.role !== 'admin') {
      return res.status(403).json({ error: '权限不足' });
    }
    
    const { name, phone, type, addresses } = req.body;
    
    // 检查手机号是否已存在
    const existingCustomer = await req.db
      .collection('customers')
      .findOne({ phone });
    
    if (existingCustomer) {
      return res.status(400).json({ error: '该手机号客户已存在' });
    }
    
    // 创建客户
    const customer = {
      _id: new ObjectId(),
      customerId: `CUST-${Date.now()}`,
      name,
      phone,
      type: type || 'residential', // residential, commercial, casual
      status: 'active',
      addresses: addresses || [],
      defaultAddressId: null,
      bottleDebt: 0,
      tickets: 0,
      createdAt: new Date(),
      lastOrderAt: null,
    };
    
    const result = await req.db.collection('customers').insertOne(customer);
    
    res.json({
      success: true,
      data: { ...customer, _id: result.insertedId },
      message: '客户创建成功',
    });
  } catch (error) {
    console.error('创建客户失败:', error);
    res.status(500).json({ error: '创建客户失败' });
  }
});

// 更新客户信息
router.put('/:id', verifyToken, async (req, res) => {
  try {
    if (req.user.role !== 'admin') {
      return res.status(403).json({ error: '权限不足' });
    }
    
    const { name, phone, type, addresses } = req.body;
    
    const updateData = {};
    if (name) updateData.name = name;
    if (type) updateData.type = type;
    if (addresses) updateData.addresses = addresses;
    
    const result = await req.db.collection('customers').updateOne(
      { _id: new ObjectId(req.params.id) },
      { $set: updateData }
    );
    
    if (result.matchedCount === 0) {
      return res.status(404).json({ error: '客户不存在' });
    }
    
    res.json({
      success: true,
      message: '客户信息已更新',
    });
  } catch (error) {
    console.error('更新客户失败:', error);
    res.status(500).json({ error: '更新客户失败' });
  }
});

// 更新水票
router.post('/:id/update-tickets', verifyToken, async (req, res) => {
  try {
    if (req.user.role !== 'admin' && req.user.role !== 'delivery') {
      return res.status(403).json({ error: '权限不足' });
    }
    
    const { amount, operation } = req.body; // operation: 'add', 'subtract'
    
    const updateValue = operation === 'add' ? amount : -amount;
    
    const result = await req.db.collection('customers').updateOne(
      { _id: new ObjectId(req.params.id) },
      { $inc: { tickets: updateValue } }
    );
    
    if (result.matchedCount === 0) {
      return res.status(404).json({ error: '客户不存在' });
    }
    
    res.json({
      success: true,
      message: '水票已更新',
    });
  } catch (error) {
    console.error('更新水票失败:', error);
    res.status(500).json({ error: '更新水票失败' });
  }
});

// 更新欠桶
router.post('/:id/update-bottle-debt', verifyToken, async (req, res) => {
  try {
    if (req.user.role !== 'admin' && req.user.role !== 'delivery') {
      return res.status(403).json({ error: '权限不足' });
    }
    
    const { amount, operation } = req.body; // operation: 'add', 'subtract'
    
    const updateValue = operation === 'add' ? amount : -amount;
    
    const result = await req.db.collection('customers').updateOne(
      { _id: new ObjectId(req.params.id) },
      { $inc: { bottleDebt: updateValue } }
    );
    
    if (result.matchedCount === 0) {
      return res.status(404).json({ error: '客户不存在' });
    }
    
    res.json({
      success: true,
      message: '欠桶已更新',
    });
  } catch (error) {
    console.error('更新欠桶失败:', error);
    res.status(500).json({ error: '更新欠桶失败' });
  }
});

export default router;
