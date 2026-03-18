// cloudfunctions/getUserInfo/index.js
const cloud = require('wx-server-sdk');
cloud.init({ env: cloud.DYNAMIC_CURRENT_ENV });
const db = cloud.database();

exports.main = async (event, context) => {
  const wxContext = cloud.getWXContext();
  const openid = wxContext.OPENID;

  try {
    // 检查用户是否是管理员（查找 admins 集合）
    const adminRes = await db.collection('admins')
      .where({ openid })
      .limit(1)
      .get();

    const isAdmin = adminRes.data.length > 0;

    return {
      openid,
      isAdmin,
      success: true
    };
  } catch (err) {
    return {
      openid,
      isAdmin: false,
      success: true
    };
  }
};
