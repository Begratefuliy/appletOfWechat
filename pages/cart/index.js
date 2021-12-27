// pages/cart/index.js
const app = getApp();
Page({
  data: {
    goodSimpleInfo: [],
    userInfo: {}
  },
  //点击商品，挑转到商品详情页
  skipToDetail(e) {
    //console.log(e);
    const {
      gid
    } = e.currentTarget.dataset;
    wx.navigateTo({
      url: '/pages/goods_detail_other/index?gid=' + gid,
    })
  },
  onLoad() {
    const userInfo = wx.getStorageSync('userInfo');
    this.setData({
      userInfo: userInfo
    })
    wx.showLoading({
      title: '加载中',
    })
    let goodSimpleInfo = this.data.goodSimpleInfo;
    const openid = wx.getStorageSync('openid')
    wx.request({
      url: app.globalData.URL + '/user/getMyCarSimpleInfo',
      method: "GET",
      data: {
        openid: openid
      },
      header: {
        'content-type': 'application/x-www-form-urlencoded',
      },
      success: (res) => {
        wx.hideLoading({})
        //console.log(res);
        let result = [];
        for (let key in res.data.extend) {
          result.push(res.data.extend[key]);
        }
        this.setData({
          goodSimpleInfo: result.slice(0)
        });
        if(this.data.goodSimpleInfo.length === 0) {
          wx.showToast({
            title: '暂无收藏商品',
            icon: 'none'
          })
        }
      },
      fail(res) {
        console.log(res);
      }
    })
  }
})