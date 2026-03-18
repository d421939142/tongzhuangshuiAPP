// pages/address/edit.js
const app = getApp();

Page({
  data: {
    addressId: null,
    form: {
      name: '',
      phone: '',
      province: '',
      city: '',
      district: '',
      detail: '',
      remark: '',
      isDefault: false
    },
    saving: false
  },

  onLoad(options) {
    if (options.id) {
      this.setData({ addressId: options.id });
      this.loadAddress(options.id);
    }
  },

  loadAddress(id) {
    const db = wx.cloud.database();
    db.collection('addresses').doc(id).get()
      .then(res => {
        this.setData({ form: res.data });
      });
  },

  onInput(e) {
    const field = e.currentTarget.dataset.field;
    this.setData({ [`form.${field}`]: e.detail.value });
  },

  onDefaultChange(e) {
    this.setData({ 'form.isDefault': e.detail.value });
  },

  pickRegion() {
    wx.chooseLocation({
      success: () => {}
    });
    // 使用内置地区选择器
    wx.showActionSheet({
      itemList: [],
      fail: () => {}
    });
    // 简化实现：直接用picker
    this.setData({ showRegionPicker: true });
  },

  onRegionChange(e) {
    const [province, city, district] = e.detail.value;
    this.setData({
      'form.province': province,
      'form.city': city,
      'form.district': district
    });
  },

  saveAddress() {
    const { name, phone, province, city, district, detail } = this.data.form;
    if (!name) return wx.showToast({ title: '请输入姓名', icon: 'none' });
    if (!phone || !/^1\d{10}$/.test(phone)) return wx.showToast({ title: '请输入正确手机号', icon: 'none' });
    if (!province) return wx.showToast({ title: '请选择地区', icon: 'none' });
    if (!detail) return wx.showToast({ title: '请输入详细地址', icon: 'none' });

    this.setData({ saving: true });
    const db = wx.cloud.database();
    const data = {
      ...this.data.form,
      updateTime: db.serverDate()
    };

    const action = this.data.addressId
      ? db.collection('addresses').doc(this.data.addressId).update({ data })
      : db.collection('addresses').add({ data: { ...data, createTime: db.serverDate() } });

    action.then(() => {
      wx.showToast({ title: '保存成功', icon: 'success' });
      setTimeout(() => wx.navigateBack(), 1500);
    }).catch(err => {
      console.error('保存地址失败', err);
      wx.showToast({ title: '保存失败', icon: 'error' });
    }).finally(() => {
      this.setData({ saving: false });
    });
  }
});
