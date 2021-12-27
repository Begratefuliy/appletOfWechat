const app = getApp();
Page({
  data: {
    allInfo: []
  },
  onLoad: function (options) {
    const openid = wx.getStorageSync('openid')
    wx.showLoading({
      title: '加载中',
    })
    wx.request({
      url: app.globalData.URL + '/lt/getNoticeInfo',
      header: {
        'content-type': 'application/json' // 默认值
      },
      data: {
        type: 0,
        openid: openid
      },
      success: (res) => {
        console.log(res);
        wx.hideLoading({})
        this.setData({
          allInfo: res.data.extend.info
        });
      }
    })
  },
  //点击按钮，全部删除
  Delete() {
    const openid = wx.getStorageSync('openid');
    wx.request({
      url: app.globalData.URL + '/lt/haveRead',
      header: {
        'content-type': 'application/json' // 默认值
      },
      data: {
        type: 0,
        openid: openid
      },
      success: (res) => {
        console.log(res);
        this.setData({
          allInfo: []
        });
      }
    })
  },
   //进入用户详情页面
   goToUserDetail(e) {
    //console.log(e);
    const openid = e.currentTarget.dataset.openid;
    wx.navigateTo({
      url: '/pages/personal_homepage/index?openid=' + openid,
    })
  },
  //点击商品，挑转到商品详情页
  skipToDetail(e) {
    //console.log(e);
    const {
      gid
    } = e.currentTarget.dataset;
    wx.navigateTo({
      url: '/pages/goods_detail/index?gid=' + gid,
    })
  }
})