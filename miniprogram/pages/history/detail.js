// pages/history/detail.js
const app = getApp();

const STATUS_MAP = {
  pending:    { label: '待接单', tip: '商家正在处理您的订单，请耐心等待' },
  accepted:   { label: '已接单', tip: '商家已确认订单，正在安排配送' },
  delivering: { label: '配送中', tip: '外卖小哥正在为您配送，请保持手机畅通' },
  delivered:  { label: '已送达', tip: '订单已完成，感谢您的惠顾！' },
  cancelled:  { label: '已取消', tip: '订单已取消' }
};

const TIME_MAP = {
  asap: '尽快送达',
  morning: '上午送',
  afternoon: '下午送',
  tomorrow: '明日送'
};

Page({
  data: { order: null },

  onLoad(options) {
    this.loadOrder(options.id);
  },

  loadOrder(id) {
    const db = wx.cloud.database();
    db.collection('orders').doc(id).get()
      .then(res => {
        const o = res.data;
        this.setData({
          order: {
            ...o,
            statusLabel: STATUS_MAP[o.status]?.label || o.status,
            statusTip: STATUS_MAP[o.status]?.tip || '',
            deliveryTimeLabel: TIME_MAP[o.deliveryTime] || ''
          }
        });
      })
      .catch(err => {
        console.error('加载订单详情失败', err);
        wx.showToast({ title: '加载失败', icon: 'error' });
      });
  },

  reorder() {
    app.globalData.cartItems = this.data.order.items.map(i => ({ ...i }));
    wx.navigateTo({ url: '/pages/order/order' });
  },

  cancelOrder() {
    wx.showModal({
      title: '取消订单',
      content: '确定要取消该订单吗？',
      success: res => {
        if (res.confirm) {
          wx.cloud.callFunction({
            name: 'updateOrderStatus',
            data: { orderId: this.data.order._id, status: 'cancelled' }
          }).then(() => {
            wx.showToast({ title: '已取消', icon: 'success' });
            this.loadOrder(this.data.order._id);
          });
        }
      }
    });
  }
});
