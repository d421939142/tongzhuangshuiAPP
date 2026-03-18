// cloudfunctions/getAdminStats/index.js
const cloud = require('wx-server-sdk');
cloud.init({ env: cloud.DYNAMIC_CURRENT_ENV });
const db = cloud.database();
const _ = db.command;

exports.main = async (event, context) => {
  const wxContext = cloud.getWXContext();
  const openid = wxContext.OPENID;

  // 验证管理员身份
  const adminRes = await db.collection('admins').where({ openid }).limit(1).get();
  if (adminRes.data.length === 0) {
    return { success: false, message: '无权限' };
  }

  try {
    // 今日开始时间
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    const [pending, delivering, todayDelivered] = await Promise.all([
      db.collection('orders').where({ status: 'pending' }).count(),
      db.collection('orders').where({ status: _.in(['accepted', 'delivering']) }).count(),
      db.collection('orders').where({
        status: 'delivered',
        deliveredTime: _.gte(today)
      }).get()
    ]);

    const todayRevenue = todayDelivered.data
      .reduce((sum, o) => sum + (o.totalAmount || 0), 0)
      .toFixed(0);

    return {
      success: true,
      stats: {
        pending: pending.total,
        delivering: delivering.total,
        todayDelivered: todayDelivered.data.length,
        todayRevenue
      }
    };
  } catch (err) {
    console.error('获取统计失败', err);
    return { success: false, message: '获取统计失败' };
  }
};
