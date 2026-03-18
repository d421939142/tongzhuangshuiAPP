// pages/history/history.js
const app = getApp();

const STATUS_MAP = {
  pending:    { label: '待接单', cls: 'tag-orange' },
  accepted:   { label: '已接单', cls: 'tag-blue' },
  delivering: { label: '配送中', cls: 'tag-blue' },
  delivered:  { label: '已送达', cls: 'tag-green' },
  cancelled:  { label: '已取消', cls: 'tag-gray' }
};

Page({
  data: {
    activeTab: 'all',
    tabs: [
      { label: '全部', value: 'all' },
      { label: '待接单', value: 'pending' },
      { label: '配送中', value: 'delivering' },
      { label: '已完成', value: 'delivered' },
      { label: '已取消', value: 'cancelled' }
    ],
    tabLabelMap: {
      all: '全部',
      pending: '待接单',
      delivering: '配送中',
      delivered: '已完成',
      cancelled: '已取消'
    },
    orders: [],
    loading: true
  },

  onLoad() {
    this.loadOrders();
  },

  onShow() {
    this.loadOrders();
  },

  loadOrders() {
    this.setData({ loading: true });
    const db = wx.cloud.database();
    let query = db.collection('orders');

    if (this.data.activeTab !== 'all') {
      query = query.where({ status: this.data.activeTab });
    }

    query.orderBy('createTime', 'desc').limit(50).get()
      .then(res => {
        const orders = res.data.map(o => ({
          ...o,
          statusLabel: STATUS_MAP[o.status]?.label || o.status,
          statusClass: STATUS_MAP[o.status]?.cls || 'tag-gray',
          createTimeStr: this.formatDate(o.createTime)
        }));
        this.setData({ orders, loading: false });
      })
      .catch(err => {
        console.error('加载订单失败', err);
        this.setData({ loading: false });
      });
  },

  switchTab(e) {
    const value = e.currentTarget.dataset.value;
    this.setData({ activeTab: value });
    this.loadOrders();
  },

  goDetail(e) {
    const id = e.currentTarget.dataset.id;
    wx.navigateTo({ url: `/pages/history/detail?id=${id}` });
  },

  cancelOrder(e) {
    const id = e.currentTarget.dataset.id;
    wx.showModal({
      title: '取消订单',
      content: '确定要取消该订单吗？',
      success: res => {
        if (res.confirm) {
          wx.cloud.callFunction({
            name: 'updateOrderStatus',
            data: { orderId: id, status: 'cancelled' }
          }).then(() => {
            wx.showToast({ title: '已取消', icon: 'success' });
            this.loadOrders();
          });
        }
      }
    });
  },

  reorder(e) {
    const order = e.currentTarget.dataset.order;
    app.globalData.cartItems = order.items.map(i => ({ ...i }));
    wx.navigateTo({ url: '/pages/order/order' });
  },

  formatDate(date) {
    if (!date) return '';
    const d = new Date(date);
    return `${d.getMonth() + 1}/${d.getDate()} ${String(d.getHours()).padStart(2,'0')}:${String(d.getMinutes()).padStart(2,'0')}`;
  }
});
