// cloudfunctions/createOrder/index.js
const cloud = require('wx-server-sdk');
cloud.init({ env: cloud.DYNAMIC_CURRENT_ENV });
const db = cloud.database();

// 生成订单号
function generateOrderNo() {
  const now = new Date();
  const date = `${now.getFullYear()}${String(now.getMonth()+1).padStart(2,'0')}${String(now.getDate()).padStart(2,'0')}`;
  const random = String(Math.floor(Math.random() * 10000)).padStart(4, '0');
  return `${date}${random}`;
}

exports.main = async (event, context) => {
  const wxContext = cloud.getWXContext();
  const openid = wxContext.OPENID;

  const { items, address, deliveryTime, remark, totalAmount } = event;

  // 参数校验
  if (!items || items.length === 0) {
    return { success: false, message: '订单商品不能为空' };
  }
  if (!address) {
    return { success: false, message: '收货地址不能为空' };
  }

  try {
    const orderNo = generateOrderNo();
    const res = await db.collection('orders').add({
      data: {
        orderNo,
        openid,
        items,
        address,
        deliveryTime: deliveryTime || 'asap',
        remark: remark || '',
        totalAmount,
        status: 'pending',
        createTime: db.serverDate(),
        updateTime: db.serverDate()
      }
    });

    return {
      success: true,
      orderId: res._id,
      orderNo
    };
  } catch (err) {
    console.error('创建订单失败', err);
    return { success: false, message: '创建订单失败，请重试' };
  }
};
