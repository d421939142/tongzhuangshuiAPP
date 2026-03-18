// pages/admin/goods.js
Page({
  data: {
    goodsList: [],
    loading: true
  },

  onShow() {
    this.loadGoods();
  },

  loadGoods() {
    this.setData({ loading: true });
    const db = wx.cloud.database();
    db.collection('goods')
      .orderBy('sortOrder', 'asc')
      .get()
      .then(res => {
        this.setData({ goodsList: res.data, loading: false });
      })
      .catch(() => {
        this.setData({ loading: false });
      });
  },

  editGoods(e) {
    const id = e.currentTarget.dataset.id;
    wx.navigateTo({ url: `/pages/admin/goods-edit?id=${id}` });
  },

  addGoods() {
    wx.navigateTo({ url: '/pages/admin/goods-edit' });
  },

  toggleStatus(e) {
    const { id, status } = e.currentTarget.dataset;
    const newStatus = status === 'active' ? 'inactive' : 'active';
    const label = newStatus === 'active' ? '上架' : '下架';
    wx.showModal({
      title: `确认${label}`,
      content: `确定要${label}该商品吗？`,
      success: res => {
        if (res.confirm) {
          const db = wx.cloud.database();
          db.collection('goods').doc(id).update({
            data: { status: newStatus }
          }).then(() => {
            wx.showToast({ title: `已${label}`, icon: 'success' });
            this.loadGoods();
          });
        }
      }
    });
  }
});
