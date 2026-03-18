// pages/admin/orders.js
const STATUS_MAP = {
  pending:    { label: '待接单', cls: 'tag-orange' },
  accepted:   { label: '已接单', cls: 'tag-blue' },
  delivering: { label: '配送中', cls: 'tag-blue' },
  delivered:  { label: '已送达', cls: 'tag-green' },
  cancelled:  { label: '已取消', cls: 'tag-gray' }
};

Page({
  data: {
    activeTab: 'pending',
    tabLabel: '待接单',
    tabs: [
      { label: '待接单', value: 'pending' },
      { label: '已接单', value: 'accepted' },
      { label: '配送中', value: 'delivering' },
      { label: '已完成', value: 'delivered' },
      { label: '全部', value: 'all' }
    ],
    orders: [],
    loading: true
  },

  onLoad(options) {
    if (options.tab) {
      this.setData({ activeTab: options.tab });
    }
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

    query.orderBy('createTime', 'desc').limit(100).get()
      .then(res => {
        const orders = res.data.map(o => ({
          ...o,
          statusLabel: STATUS_MAP[o.status]?.label || o.status,
          statusClass: STATUS_MAP[o.status]?.cls || 'tag-gray',
          createTimeStr: this.formatDateTime(o.createTime)
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
    const tabLabel = this.data.tabs.find(t => t.value === value)?.label || '';
    this.setData({ activeTab: value, tabLabel });
    this.loadOrders();
  },

  acceptOrder(e) {
    const id = e.currentTarget.dataset.id;
    wx.showModal({
      title: '接单确认',
      content: '确定接受该订单吗？',
      success: res => {
        if (res.confirm) {
          this.updateStatus(id, 'accepted', '已接单');
        }
      }
    });
  },

  rejectOrder(e) {
    const id = e.currentTarget.dataset.id;
    wx.showModal({
      title: '拒绝订单',
      content: '确定拒绝该订单吗？将通知用户订单已取消。',
      success: res => {
        if (res.confirm) {
          this.updateStatus(id, 'cancelled', '已拒绝');
        }
      }
    });
  },

  startDelivery(e) {
    const id = e.currentTarget.dataset.id;
    wx.showModal({
      title: '开始配送',
      content: '确认开始配送该订单？',
      success: res => {
        if (res.confirm) {
          this.updateStatus(id, 'delivering', '配送中');
        }
      }
    });
  },

  confirmDelivered(e) {
    const id = e.currentTarget.dataset.id;
    wx.showModal({
      title: '确认送达',
      content: '确认该订单已成功送达？',
      success: res => {
        if (res.confirm) {
          this.updateStatus(id, 'delivered', '已送达');
        }
      }
    });
  },

  updateStatus(orderId, status, label) {
    wx.showLoading({ title: '处理中...' });
    wx.cloud.callFunction({
      name: 'updateOrderStatus',
      data: { orderId, status }
    }).then(res => {
      wx.hideLoading();
      if (res.result.success) {
        wx.showToast({ title: label, icon: 'success' });
        this.loadOrders();
      } else {
        wx.showToast({ title: '操作失败', icon: 'error' });
      }
    }).catch(() => {
      wx.hideLoading();
      wx.showToast({ title: '网络错误', icon: 'error' });
    });
  },

  goDetail(e) {
    const id = e.currentTarget.dataset.id;
    wx.navigateTo({ url: `/pages/admin/order-detail?id=${id}` });
  },

  formatDateTime(date) {
    if (!date) return '';
    const d = new Date(date);
    return `${d.getMonth()+1}/${d.getDate()} ${String(d.getHours()).padStart(2,'0')}:${String(d.getMinutes()).padStart(2,'0')}`;
  }
});
