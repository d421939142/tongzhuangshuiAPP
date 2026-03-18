import express from 'express';
import { ObjectId } from 'mongodb';
import { verifyToken } from './auth.js';
import { v4 as uuidv4 } from 'uuid';

const router = express.Router();

// 获取任务列表
router.get('/', verifyToken, async (req, res) => {
  try {
    const { status, deliveryId, startDate, endDate } = req.query;
    
    let query = {};
    
    if (status) {
      query.status = status;
    }
    
    if (deliveryId) {
      query.deliveryId = deliveryId;
    }
    
    if (startDate || endDate) {
      query.createdAt = {};
      if (startDate) query.createdAt.$gte = new Date(startDate);
      if (endDate) query.createdAt.$lte = new Date(endDate);
    }
    
    const tasks = await req.db
      .collection('tasks')
      .find(query)
      .sort({ createdAt: -1 })
      .toArray();
    
    res.json({
      success: true,
      data: tasks,
      count: tasks.length,
    });
  } catch (error) {
    console.error('获取任务列表失败:', error);
    res.status(500).json({ error: '获取任务列表失败' });
  }
});

// 获取单个任务详情
router.get('/:id', verifyToken, async (req, res) => {
  try {
    const task = await req.db
      .collection('tasks')
      .findOne({ _id: new ObjectId(req.params.id) });
    
    if (!task) {
      return res.status(404).json({ error: '任务不存在' });
    }
    
    res.json({ success: true, data: task });
  } catch (error) {
    console.error('获取任务详情失败:', error);
    res.status(500).json({ error: '获取任务详情失败' });
  }
});

// 创建任务（仅管理员）
router.post('/', verifyToken, async (req, res) => {
  try {
    if (req.user.role !== 'admin') {
      return res.status(403).json({ error: '权限不足' });
    }
    
    const {
      customerId,
      customerName,
      customerPhone,
      address,
      productBrand,
      quantity,
      price,
      notes,
    } = req.body;
    
    // 创建任务
    const task = {
      _id: uuidv4(),
      customerId,
      customerName,
      customerPhone,
      address,
      productBrand,
      quantity,
      price,
      status: 'pending',
      createdAt: new Date(),
      createdBy: req.user.userId,
      notes,
    };
    
    await req.db.collection('tasks').insertOne(task);
    
    res.json({
      success: true,
      data: task,
      message: '任务创建成功',
    });
  } catch (error) {
    console.error('创建任务失败:', error);
    res.status(500).json({ error: '创建任务失败' });
  }
});

// 接受任务（送水工）
router.post('/:id/accept', verifyToken, async (req, res) => {
  try {
    if (req.user.role !== 'delivery') {
      return res.status(403).json({ error: '权限不足' });
    }
    
    const result = await req.db.collection('tasks').updateOne(
      { _id: req.params.id, status: 'pending' },
      {
        $set: {
          status: 'accepted',
          deliveryId: req.user.userId,
          acceptedAt: new Date(),
        },
      }
    );
    
    if (result.matchedCount === 0) {
      return res.status(404).json({ error: '任务不存在或已被接受' });
    }
    
    res.json({
      success: true,
      message: '任务已接受',
    });
  } catch (error) {
    console.error('接受任务失败:', error);
    res.status(500).json({ error: '接受任务失败' });
  }
});

// 完成任务（上传签收信息）
router.post('/:id/complete', verifyToken, async (req, res) => {
  try {
    if (req.user.role !== 'delivery') {
      return res.status(403).json({ error: '权限不足' });
    }
    
    const { emptyBottles, photoUrl, notes } = req.body;
    
    const result = await req.db.collection('tasks').updateOne(
      { _id: req.params.id, deliveryId: req.user.userId },
      {
        $set: {
          status: 'completed',
          completedAt: new Date(),
          emptyBottles,
          photoUrl,
          notes,
        },
      }
    );
    
    if (result.matchedCount === 0) {
      return res.status(404).json({ error: '任务不存在' });
    }
    
    res.json({
      success: true,
      message: '任务已完成',
    });
  } catch (error) {
    console.error('完成任务失败:', error);
    res.status(500).json({ error: '完成任务失败' });
  }
});

export default router;
