// cloudfunctions/updateOrderStatus/index.js
const cloud = require('wx-server-sdk');
cloud.init({ env: cloud.DYNAMIC_CURRENT_ENV });
const db = cloud.database();

const VALID_TRANSITIONS = {
  pending: ['accepted', 'cancelled'],
  accepted: ['delivering', 'cancelled'],
  delivering: ['delivered'],
  delivered: [],
  cancelled: []
};

exports.main = async (event, context) => {
  const wxContext = cloud.getWXContext();
  const openid = wxContext.OPENID;
  const { orderId, status, deliveryPerson, deliveryPhone } = event;

  if (!orderId || !status) {
    return { success: false, message: '参数错误' };
  }

  try {
    // 获取当前订单
    const orderRes = await db.collection('orders').doc(orderId).get();
    const order = orderRes.data;

    // 权限校验：管理员可以操作所有状态，用户只能取消自己的订单
    const adminRes = await db.collection('admins').where({ openid }).limit(1).get();
    const isAdmin = adminRes.data.length > 0;

    if (!isAdmin && status !== 'cancelled') {
      return { success: false, message: '权限不足' };
    }

    if (!isAdmin && order.openid !== openid) {
      return { success: false, message: '只能操作自己的订单' };
    }

    // 检查状态流转合法性
    const validNext = VALID_TRANSITIONS[order.status] || [];
    if (!validNext.includes(status)) {
      return { success: false, message: `不能从${order.status}状态变更为${status}` };
    }

    const updateData = {
      status,
      updateTime: db.serverDate()
    };

    if (status === 'delivering' && deliveryPerson) {
      updateData.deliveryPerson = deliveryPerson;
      updateData.deliveryPhone = deliveryPhone || '';
    }

    if (status === 'delivered') {
      updateData.deliveredTime = db.serverDate();
    }

    await db.collection('orders').doc(orderId).update({ data: updateData });

    return { success: true };
  } catch (err) {
    console.error('更新订单状态失败', err);
    return { success: false, message: '更新失败' };
  }
};
