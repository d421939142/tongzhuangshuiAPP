// pages/address/address.js
const app = getApp();

Page({
  data: {
    addresses: [],
    mode: 'manage' // manage | select
  },

  onLoad(options) {
    this.setData({ mode: options.mode || 'manage' });
    this.loadAddresses();
  },

  onShow() {
    this.loadAddresses();
  },

  loadAddresses() {
    const db = wx.cloud.database();
    db.collection('addresses')
      .orderBy('isDefault', 'desc')
      .orderBy('createTime', 'desc')
      .get()
      .then(res => {
        this.setData({ addresses: res.data });
      })
      .catch(err => {
        console.error('加载地址失败', err);
      });
  },

  selectAddr(e) {
    if (this.data.mode !== 'select') return;
    const addr = e.currentTarget.dataset.addr;
    app.globalData.selectedAddress = addr;
    wx.navigateBack();
  },

  editAddr(e) {
    const id = e.currentTarget.dataset.id;
    wx.navigateTo({ url: `/pages/address/edit?id=${id}` });
  },

  deleteAddr(e) {
    const id = e.currentTarget.dataset.id;
    wx.showModal({
      title: '确认删除',
      content: '确定删除该地址吗？',
      success: res => {
        if (res.confirm) {
          const db = wx.cloud.database();
          db.collection('addresses').doc(id).remove()
            .then(() => {
              wx.showToast({ title: '已删除', icon: 'success' });
              this.loadAddresses();
            });
        }
      }
    });
  },

  setDefault(e) {
    const id = e.currentTarget.dataset.id;
    wx.cloud.callFunction({
      name: 'setDefaultAddress',
      data: { addressId: id }
    }).then(() => {
      wx.showToast({ title: '已设为默认', icon: 'success' });
      this.loadAddresses();
    });
  },

  addAddress() {
    wx.navigateTo({ url: '/pages/address/edit' });
  }
});
