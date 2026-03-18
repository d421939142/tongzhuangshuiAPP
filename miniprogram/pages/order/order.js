// pages/order/order.js
const app = getApp();

Page({
  data: {
    cartItems: [],
    address: null,
    deliveryTime: 'asap',
    remark: '',
    goodsTotal: '0.00',
    submitting: false,
    timeOptions: [
      { label: '尽快送达', value: 'asap' },
      { label: '上午送', value: 'morning' },
      { label: '下午送', value: 'afternoon' },
      { label: '明日送', value: 'tomorrow' }
    ]
  },

  onLoad() {
    const cartItems = app.globalData.cartItems || [];
    const itemsWithSubtotal = cartItems.map(i => ({
      ...i,
      subtotal: (i.price * i.quantity).toFixed(2)
    }));
    this.setData({ cartItems: itemsWithSubtotal });
    this.calcTotal(itemsWithSubtotal);

    // 读取默认地址
    if (app.globalData.defaultAddress) {
      this.setData({ address: app.globalData.defaultAddress });
    } else {
      this.loadDefaultAddress();
    }
  },

  onShow() {
    // 从地址页返回后刷新选中地址
    if (app.globalData.selectedAddress) {
      this.setData({ address: app.globalData.selectedAddress });
      app.globalData.selectedAddress = null;
    }
  },

  loadDefaultAddress() {
    const db = wx.cloud.database();
    db.collection('addresses')
      .where({ isDefault: true })
      .limit(1)
      .get()
      .then(res => {
        if (res.data.length > 0) {
          this.setData({ address: res.data[0] });
        }
      })
      .catch(() => {});
  },

  calcTotal(items) {
    const total = items.reduce((s, i) => s + i.price * i.quantity, 0);
    this.setData({ goodsTotal: total.toFixed(2) });
  },

  increaseQty(e) {
    const id = e.currentTarget.dataset.id;
    const items = this.data.cartItems.map(i => {
      if (i._id === id) return { ...i, quantity: i.quantity + 1, subtotal: ((i.quantity + 1) * i.price).toFixed(2) };
      return i;
    });
    app.globalData.cartItems = items;
    this.setData({ cartItems: items });
    this.calcTotal(items);
  },

  decreaseQty(e) {
    const id = e.currentTarget.dataset.id;
    let items = this.data.cartItems.map(i => {
      if (i._id === id && i.quantity > 1) {
        return { ...i, quantity: i.quantity - 1, subtotal: ((i.quantity - 1) * i.price).toFixed(2) };
      }
      return i;
    }).filter(i => i.quantity > 0);
    app.globalData.cartItems = items;
    this.setData({ cartItems: items });
    this.calcTotal(items);
  },

  selectAddress() {
    wx.navigateTo({ url: '/pages/address/address?mode=select' });
  },

  selectTime(e) {
    this.setData({ deliveryTime: e.currentTarget.dataset.value });
  },

  onRemarkInput(e) {
    this.setData({ remark: e.detail.value });
  },

  submitOrder() {
    if (!this.data.address) {
      wx.showToast({ title: '请选择收货地址', icon: 'none' });
      return;
    }
    if (this.data.cartItems.length === 0) {
      wx.showToast({ title: '购物车为空', icon: 'none' });
      return;
    }

    this.setData({ submitting: true });

    wx.cloud.callFunction({
      name: 'createOrder',
      data: {
        items: this.data.cartItems.map(i => ({
          goodsId: i._id,
          goodsName: i.name,
          goodsImg: i.imageUrl,
          spec: i.spec,
          price: i.price,
          quantity: i.quantity,
          subtotal: parseFloat(i.subtotal)
        })),
        address: this.data.address,
        deliveryTime: this.data.deliveryTime,
        remark: this.data.remark,
        totalAmount: parseFloat(this.data.goodsTotal)
      }
    }).then(res => {
      if (res.result.success) {
        app.globalData.cartItems = [];
        wx.showToast({ title: '下单成功！', icon: 'success' });
        setTimeout(() => {
          wx.redirectTo({ url: `/pages/history/detail?id=${res.result.orderId}` });
        }, 1500);
      } else {
        wx.showToast({ title: res.result.message || '下单失败', icon: 'error' });
      }
    }).catch(err => {
      console.error('下单失败', err);
      wx.showToast({ title: '网络错误，请重试', icon: 'error' });
    }).finally(() => {
      this.setData({ submitting: false });
    });
  }
});
