// pages/goods/goods.js
const app = getApp();

Page({
  data: {
    goodsList: [],
    filteredGoods: [],
    categories: ['全部'],
    activeCategory: '全部',
    keyword: '',
    loading: true,
    cartCount: 0,
    cartTotal: '0.00'
  },

  onLoad() {
    this.loadGoods();
  },

  onShow() {
    this.updateCart();
  },

  loadGoods() {
    const db = wx.cloud.database();
    db.collection('goods')
      .where({ status: 'active' })
      .orderBy('sortOrder', 'asc')
      .get()
      .then(res => {
        const goods = res.data;
        // 提取分类
        const cats = ['全部', ...new Set(goods.map(g => g.category).filter(Boolean))];
        this.setData({
          goodsList: goods,
          filteredGoods: goods,
          categories: cats,
          loading: false
        });
      })
      .catch(() => { this.setData({ loading: false }); });
  },

  filterCategory(e) {
    const cat = e.currentTarget.dataset.cat;
    this.setData({ activeCategory: cat });
    this.applyFilter(cat, this.data.keyword);
  },

  onSearch(e) {
    const keyword = e.detail.value;
    this.setData({ keyword });
    this.applyFilter(this.data.activeCategory, keyword);
  },

  applyFilter(category, keyword) {
    let list = this.data.goodsList;
    if (category && category !== '全部') {
      list = list.filter(g => g.category === category);
    }
    if (keyword) {
      list = list.filter(g => g.name.includes(keyword) || (g.description || '').includes(keyword));
    }
    this.setData({ filteredGoods: list });
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
    this.updateCart();
    wx.showToast({ title: '已加入购物车', icon: 'success' });
  },

  updateCart() {
    const cartItems = app.globalData.cartItems || [];
    const count = cartItems.reduce((s, i) => s + i.quantity, 0);
    const total = cartItems.reduce((s, i) => s + i.price * i.quantity, 0);
    this.setData({ cartCount: count, cartTotal: total.toFixed(2) });
  },

  goOrder() {
    wx.navigateTo({ url: '/pages/order/order' });
  },

  goDetail(e) {
    // 跳转到商品详情（当前版本复用 goods 页，可扩展）
  }
});
