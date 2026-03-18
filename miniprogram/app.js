// app.js
App({
  globalData: {
    userInfo: null,
    openid: null,
    isAdmin: false,
    envId: 'your-env-id', // 请替换为你的CloudBase环境ID
    cartItems: [],
    defaultAddress: null
  },

  onLaunch() {
    if (!wx.cloud) {
      console.error('请使用 2.2.3 或以上的基础库以使用云能力');
      return;
    }
    wx.cloud.init({
      env: this.globalData.envId,
      traceUser: true
    });

    // 获取用户信息和openid
    this.getUserInfo();
  },

  getUserInfo() {
    wx.cloud.callFunction({
      name: 'getUserInfo',
      success: res => {
        this.globalData.openid = res.result.openid;
        this.globalData.isAdmin = res.result.isAdmin || false;
        console.log('用户openid:', res.result.openid, '是否管理员:', res.result.isAdmin);
      },
      fail: err => {
        console.error('获取用户信息失败', err);
      }
    });
  }
});
