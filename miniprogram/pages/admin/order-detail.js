// pages/admin/order-detail.js
const STATUS_MAP = {
  pending: '待接单', accepted: '已接单', delivering: '配送中',
  delivered: '已送达', cancelled: '已取消'
};

Page({
  data: { order: null },

  onLoad(options) {
    this.orderId = options.id;
    this.loadOrder();
  },

  onShow() {
    if (this.orderId) this.loadOrder();
  },

  loadOrder() {
    wx.cloud.database().collection('orders').doc(this.orderId).get()
      .then(res => {
        const o = res.data;
        this.setData({
          order: {
            ...o,
            statusLabel: STATUS_MAP[o.status] || o.status,
            createTimeStr: new Date(o.createTime).toLocaleString('zh-CN')
          }
        });
      });
  },

  updateStatus(status, label) {
    wx.showLoading({ title: '处理中...' });
    wx.cloud.callFunction({
      name: 'updateOrderStatus',
      data: { orderId: this.orderId, status }
    }).then(res => {
      wx.hideLoading();
      if (res.result.success) {
        wx.showToast({ title: label, icon: 'success' });
        this.loadOrder();
      }
    }).catch(() => { wx.hideLoading(); });
  },

  acceptOrder() { this.updateStatus('accepted', '已接单'); },
  startDelivery() { this.updateStatus('delivering', '配送中'); },
  confirmDelivered() { this.updateStatus('delivered', '已送达'); },
  rejectOrder() {
    wx.showModal({ title: '拒绝订单', content: '确认拒绝？', success: r => r.confirm && this.updateStatus('cancelled', '已拒绝') });
  }
});
