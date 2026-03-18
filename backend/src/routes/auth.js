import express from 'express';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { ObjectId } from 'mongodb';

const router = express.Router();
const JWT_SECRET = process.env.JWT_SECRET || 'your-secret-key';

// 生成 token
function generateToken(userId, role) {
  return jwt.sign(
    { userId, role },
    JWT_SECRET,
    { expiresIn: '7d' }
  );
}

// 验证 token 中间件
export function verifyToken(req, res, next) {
  const token = req.headers.authorization?.split(' ')[1];
  
  if (!token) {
    return res.status(401).json({ error: '未提供 token' });
  }
  
  try {
    const decoded = jwt.verify(token, JWT_SECRET);
    req.user = decoded;
    next();
  } catch (error) {
    return res.status(401).json({ error: 'token 无效或已过期' });
  }
}

// 登录
router.post('/login', async (req, res) => {
  try {
    const { phone, password, role } = req.body;
    
    if (!phone || !password) {
      return res.status(400).json({ error: '手机号和密码不能为空' });
    }
    
    // 查询用户
    const user = await req.db.collection('users').findOne({ phone });
    
    if (!user) {
      return res.status(401).json({ error: '用户不存在' });
    }
    
    // 验证密码
    const isPasswordValid = await bcrypt.compare(password, user.passwordHash);
    
    if (!isPasswordValid) {
      return res.status(401).json({ error: '密码错误' });
    }
    
    // 生成 token
    const token = generateToken(user._id.toString(), user.role);
    
    res.json({
      success: true,
      token,
      user: {
        id: user._id,
        phone: user.phone,
        name: user.name,
        role: user.role,
      },
    });
  } catch (error) {
    console.error('登录失败:', error);
    res.status(500).json({ error: '登录失败' });
  }
});

// 注册（管理员创建用户）
router.post('/register', verifyToken, async (req, res) => {
  try {
    // 仅管理员可以创建用户
    if (req.user.role !== 'admin') {
      return res.status(403).json({ error: '权限不足' });
    }
    
    const { phone, password, name, role } = req.body;
    
    // 检查手机号是否已存在
    const existingUser = await req.db.collection('users').findOne({ phone });
    
    if (existingUser) {
      return res.status(400).json({ error: '手机号已被注册' });
    }
    
    // 密码加密
    const passwordHash = await bcrypt.hash(password, 10);
    
    // 创建用户
    const result = await req.db.collection('users').insertOne({
      phone,
      passwordHash,
      name,
      role: role || 'delivery',
      createdAt: new Date(),
      status: 'active',
    });
    
    res.json({
      success: true,
      userId: result.insertedId,
      message: '用户创建成功',
    });
  } catch (error) {
    console.error('注册失败:', error);
    res.status(500).json({ error: '注册失败' });
  }
});

// 修改密码
router.post('/change-password', verifyToken, async (req, res) => {
  try {
    const { oldPassword, newPassword } = req.body;
    
    // 查询用户
    const user = await req.db.collection('users').findOne({
      _id: new ObjectId(req.user.userId),
    });
    
    if (!user) {
      return res.status(404).json({ error: '用户不存在' });
    }
    
    // 验证旧密码
    const isPasswordValid = await bcrypt.compare(oldPassword, user.passwordHash);
    
    if (!isPasswordValid) {
      return res.status(401).json({ error: '旧密码错误' });
    }
    
    // 更新密码
    const newPasswordHash = await bcrypt.hash(newPassword, 10);
    
    await req.db.collection('users').updateOne(
      { _id: user._id },
      { $set: { passwordHash: newPasswordHash } }
    );
    
    res.json({
      success: true,
      message: '密码修改成功',
    });
  } catch (error) {
    console.error('修改密码失败:', error);
    res.status(500).json({ error: '修改密码失败' });
  }
});

export default router;
