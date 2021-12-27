// pages/fabu/index.js
const app = getApp();
Page({
  data: {
    isRegister: 0
  },
  //点击进入发布闲置商品页面
  goToLeaveIssue() {
    const userInfo = wx.getStorageSync('userInfo');
    if (!userInfo) {
      wx.showToast({
        title: '请先登录注册',
        icon: 'none'
      })
      return 0;
    }
    const openid = wx.getStorageSync('openid');
    wx.request({
      url: app.globalData.URL + '/admin/userIsOk',
      header: {
        'content-type': 'application/json' // 默认值
      },
      data: {
        openid: openid
      },
      success: (res) => {
        const state = res.data.extend.state;
        const result = res.data.extend.result;
        if (state == 10) {
          wx.showModal({
            title: '提示',
            content: result,
          })
        } else {
          wx.navigateTo({
            url: '/pages/issue_leave/index',
          })
        }
      }
    })
  },
  //点击进入发布免费商品页面
  goToFreeIssueIssue() {
    const userInfo = wx.getStorageSync('userInfo');
    if (!userInfo) {
      wx.showToast({
        title: '请先登录注册',
        icon: 'none'
      })
      return 0;
    }
    const openid = wx.getStorageSync('openid');
    wx.request({
      url: app.globalData.URL + '/admin/userIsOk',
      header: {
        'content-type': 'application/json' // 默认值
      },
      data: {
        openid: openid
      },
      success: (res) => {
        const state = res.data.extend.state;
        const result = res.data.extend.result;
        if (state == 10) {
          wx.showModal({
            title: '提示',
            content: result,
          })
        } else {
          wx.navigateTo({
            url: '/pages/issue_free/index',
          })
        }
      }
    })
  },
  //监听页面加载
  onLoad() {
    const openid = wx.getStorageSync('openid');
    wx.request({
      url: app.globalData.URL + '/admin/isAdmin', 
      data: {
        openid: openid
      },
      header: {
        'content-type': 'application/json' // 默认值
      },
      success: (res) => {
        //console.log(res.data)
        if(res.data.code === 200) {
          this.setData({
            isRegister: 1
          })
        }
      }
    })
  }
})