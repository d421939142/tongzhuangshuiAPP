// cloudfunctions/setDefaultAddress/index.js
const cloud = require('wx-server-sdk');
cloud.init({ env: cloud.DYNAMIC_CURRENT_ENV });
const db = cloud.database();

exports.main = async (event, context) => {
  const wxContext = cloud.getWXContext();
  const openid = wxContext.OPENID;
  const { addressId } = event;

  try {
    // 先清除所有默认地址
    await db.collection('addresses')
      .where({ _openid: openid, isDefault: true })
      .update({ data: { isDefault: false } });

    // 设置新的默认地址
    await db.collection('addresses').doc(addressId).update({
      data: { isDefault: true }
    });

    return { success: true };
  } catch (err) {
    console.error('设置默认地址失败', err);
    return { success: false, message: '设置失败' };
  }
};
