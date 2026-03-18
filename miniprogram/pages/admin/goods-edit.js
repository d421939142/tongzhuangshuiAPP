// pages/admin/goods-edit.js
Page({
  data: {
    goodsId: null,
    form: {
      name: '',
      category: '',
      spec: '',
      price: '',
      description: '',
      imageUrl: '',
      status: 'active',
      sortOrder: 99,
      colorTag: '#0EA5E9'
    },
    saving: false
  },

  onLoad(options) {
    if (options.id) {
      this.setData({ goodsId: options.id });
      this.loadGoods(options.id);
    }
  },

  loadGoods(id) {
    const db = wx.cloud.database();
    db.collection('goods').doc(id).get()
      .then(res => {
        this.setData({ form: res.data });
      });
  },

  onInput(e) {
    const field = e.currentTarget.dataset.field;
    let value = e.detail.value;
    if (field === 'price') value = parseFloat(value) || value;
    if (field === 'sortOrder') value = parseInt(value) || value;
    this.setData({ [`form.${field}`]: value });
  },

  onDescInput(e) {
    this.setData({ 'form.description': e.detail.value });
  },

  onStatusChange(e) {
    this.setData({ 'form.status': e.detail.value ? 'active' : 'inactive' });
  },

  uploadImage() {
    wx.chooseMedia({
      count: 1,
      mediaType: ['image'],
      sourceType: ['album', 'camera'],
      success: res => {
        const tempFilePath = res.tempFiles[0].tempFilePath;
        const ext = tempFilePath.split('.').pop() || 'jpg';
        const cloudPath = `goods/${Date.now()}.${ext}`;

        wx.showLoading({ title: '上传中...' });
        wx.cloud.uploadFile({
          cloudPath,
          filePath: tempFilePath,
          success: uploadRes => {
            this.setData({ 'form.imageUrl': uploadRes.fileID });
            wx.hideLoading();
          },
          fail: () => {
            wx.hideLoading();
            wx.showToast({ title: '上传失败', icon: 'error' });
          }
        });
      }
    });
  },

  saveGoods() {
    const { name, category, spec, price } = this.data.form;
    if (!name) return wx.showToast({ title: '请输入商品名称', icon: 'none' });
    if (!price) return wx.showToast({ title: '请输入单价', icon: 'none' });

    this.setData({ saving: true });
    const db = wx.cloud.database();
    const data = {
      ...this.data.form,
      price: parseFloat(this.data.form.price),
      updateTime: db.serverDate()
    };

    const action = this.data.goodsId
      ? db.collection('goods').doc(this.data.goodsId).update({ data })
      : db.collection('goods').add({ data: { ...data, createTime: db.serverDate() } });

    action.then(() => {
      wx.showToast({ title: '保存成功', icon: 'success' });
      setTimeout(() => wx.navigateBack(), 1500);
    }).catch(() => {
      wx.showToast({ title: '保存失败', icon: 'error' });
    }).finally(() => {
      this.setData({ saving: false });
    });
  }
});
