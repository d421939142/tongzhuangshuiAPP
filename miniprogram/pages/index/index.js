// pages/index/index.js
const app = getApp();

Page({
  data: {
    goodsList: [],
    loading: true,
    cartItems: [],
    cartCount: 0,
    cartTotal: '0.00',
    lastOrder: null,
    isAdmin: false
  },

  onLoad() {
    this.setData({ isAdmin: app.globalData.isAdmin });
    this.loadGoods();
    this.loadLastOrder();
  },

  onShow() {
    // 刷新购物车状态
    const cartItems = app.globalData.cartItems || [];
    this.updateCart(cartItems);
    this.setData({ isAdmin: app.globalData.isAdmin });
  },

  loadGoods() {
    const db = wx.cloud.database();
    db.collection('goods')
      .where({ status: 'active' })
      .orderBy('sortOrder', 'asc')
      .get()
      .then(res => {
        this.setData({ goodsList: res.data, loading: false });
      })
      .catch(err => {
        console.error('加载商品失败', err);
        this.setData({ loading: false });
        wx.showToast({ title: '加载失败', icon: 'error' });
      });
  },

  loadLastOrder() {
    const db = wx.cloud.database();
    db.collection('orders')
      .orderBy('createTime', 'desc')
      .limit(1)
      .get()
      .then(res => {
        if (res.data.length > 0) {
          const order = res.data[0];
          this.setData({
            lastOrder: {
              ...order,
              goodsName: order.items[0]?.goodsName,
              goodsImg: order.items[0]?.goodsImg,
              quantity: order.items.reduce((s, i) => s + i.quantity, 0),
              createTime: this.formatDate(order.createTime)
            }
          });
        }
      })
      .catch(() => {});
  },

  addToCart(e) {
    const item = e.currentTarget.dataset.item;
    const cartItems = app.globalData.cartItems || [];
    const idx = cartItems.findIndex(c => c._id === item._id);
    if (idx >= 0) {
      cartItems[idx].quantity += 1;
    } else {
      cartItems.push({ ...item, quantity: 1 });
    }
    app.globalData.cartItems = cartItems;
    this.updateCart(cartItems);
    wx.showToast({ title: '已加入购物车', icon: 'success' });
  },

  updateCart(cartItems) {
    const count = cartItems.reduce((s, i) => s + i.quantity, 0);
    const total = cartItems.reduce((s, i) => s + i.price * i.quantity, 0);
    this.setData({
      cartItems,
      cartCount: count,
      cartTotal: total.toFixed(2)
    });
  },

  quickReorder(e) {
    const order = e.currentTarget.dataset.order;
    app.globalData.cartItems = order.items.map(i => ({ ...i }));
    this.updateCart(app.globalData.cartItems);
    wx.navigateTo({ url: '/pages/order/order' });
  },

  goGoods() {
    wx.navigateTo({ url: '/pages/goods/goods' });
  },

  goHistory() {
    wx.switchTab({ url: '/pages/history/history' });
  },

  goAddress() {
    wx.navigateTo({ url: '/pages/address/address' });
  },

  goOrder() {
    wx.navigateTo({ url: '/pages/order/order' });
  },

  goAdmin() {
    wx.navigateTo({ url: '/pages/admin/index' });
  },

  goGoodsDetail(e) {
    const id = e.currentTarget.dataset.id;
    wx.navigateTo({ url: `/pages/goods/goods?id=${id}` });
  },

  formatDate(date) {
    if (!date) return '';
    const d = new Date(date);
    return `${d.getMonth() + 1}月${d.getDate()}日`;
  }
});
