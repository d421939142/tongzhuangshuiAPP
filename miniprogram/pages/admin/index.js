// pages/admin/index.js
const app = getApp();

Page({
  data: {
    stats: {
      pending: 0,
      delivering: 0,
      todayDelivered: 0,
      todayRevenue: '0'
    }
  },

  onShow() {
    // 检查是否管理员
    if (!app.globalData.isAdmin) {
      wx.showModal({
        title: '无权限',
        content: '您没有管理员权限',
        showCancel: false,
        success: () => wx.navigateBack()
      });
      return;
    }
    this.loadStats();
  },

  loadStats() {
    wx.cloud.callFunction({
      name: 'getAdminStats',
      success: res => {
        if (res.result.success) {
          this.setData({ stats: res.result.stats });
        }
      }
    });
  },

  goOrders(e) {
    const tab = e.currentTarget.dataset.tab;
    wx.navigateTo({ url: `/pages/admin/orders?tab=${tab}` });
  },

  goGoods() {
    wx.navigateTo({ url: '/pages/admin/goods' });
  }
});
