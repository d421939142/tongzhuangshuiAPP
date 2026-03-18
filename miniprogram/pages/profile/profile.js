// pages/profile/profile.js
const app = getApp();

Page({
  data: {
    userInfo: {},
    isAdmin: false,
    pendingCount: 0,
    deliveringCount: 0,
    totalCount: 0
  },

  onShow() {
    this.setData({ isAdmin: app.globalData.isAdmin });
    this.getUserInfo();
    this.loadOrderStats();
  },

  getUserInfo() {
    wx.getUserProfile({
      desc: '用于显示用户信息',
      success: res => {
        this.setData({ userInfo: res.userInfo });
        app.globalData.userInfo = res.userInfo;
      },
      fail: () => {
        this.setData({ userInfo: app.globalData.userInfo || { nickName: '桶装水用户' } });
      }
    });
  },

  loadOrderStats() {
    const db = wx.cloud.database();
    const _ = db.command;
    Promise.all([
      db.collection('orders').where({ status: 'pending' }).count(),
      db.collection('orders').where({ status: 'delivering' }).count(),
      db.collection('orders').count()
    ]).then(([pending, delivering, total]) => {
      this.setData({
        pendingCount: pending.total,
        deliveringCount: delivering.total,
        totalCount: total.total
      });
    }).catch(() => {});
  },

  goOrders(e) {
    const tab = e.currentTarget.dataset.tab;
    wx.switchTab({ url: '/pages/history/history' });
    // 切换 tab 后通知页面筛选（通过全局状态）
    app.globalData.defaultOrderTab = tab;
  },

  goAddress() {
    wx.navigateTo({ url: '/pages/address/address' });
  },

  goHistory() {
    wx.switchTab({ url: '/pages/history/history' });
  },

  goAdmin() {
    wx.navigateTo({ url: '/pages/admin/index' });
  }
});
