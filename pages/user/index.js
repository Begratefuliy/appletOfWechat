// pages/user/index.js
const app = getApp();
Page({
  data: {
    userInfo: {}
  },
  onShow: function () {
    const userInfo = wx.getStorageSync("userInfo");
    this.setData({
      userInfo
    })
  },
  goToIdeaFeedback() {
    const openid = wx.getStorageSync('openid');
    if (!this.data.userInfo) {
      wx.showToast({
        title: '请先登录注册',
        icon: 'none'
      })
      return 0;
    }
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
            content: result.noticeInfo,
          })
        } else {
          wx.navigateTo({
            url: '/pages/feedback/index',
          })
        }
      }
    })
  },
  goToStudentIden() {
    const openid = wx.getStorageSync('openid');
    if (!this.data.userInfo) {
      wx.showToast({
        title: '请先登录注册',
        icon: 'none'
      })
      return 0;
    }
    wx.request({
      url: app.globalData.URL + '/admin/userIsOk',
      header: {
        'content-type': 'application/json' // 默认值
      },
      data: {
        openid: openid
      },
      success: (res) => {
        console.log(res);
        const state = res.data.extend.state;
        const result = res.data.extend.result;
        if (state == 10) {
          wx.showModal({
            title: '提示',
            content: result.noticeInfo,
          })
        } else if (state == 3) {
          wx.showModal({
            title: '提示',
            content: '待审核中',
          })
        }  else if (state == 1) {
          wx.showToast({
            title: '已认证，无需重复认证',
          })
        } else {
          wx.navigateTo({
            url: '/pages/student_iden/index',
          })
        }
      }
    })
  },
  goToMessage() {
    const openid = wx.getStorageSync('openid');
    if (!this.data.userInfo) {
      wx.showToast({
        title: '请先登录注册',
        icon: 'none'
      })
      return 0;
    }
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
            content: result.noticeInfo,
          })
        } else {
          wx.navigateTo({
            url: '/pages/message/index',
          })
        }
      }
    })
  },
  goToMyCollect() {
    const openid = wx.getStorageSync('openid');
    if (!this.data.userInfo) {
      wx.showToast({
        title: '请先登录注册',
        icon: 'none'
      })
      return 0;
    }
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
            content: result.noticeInfo,
          })
        } else {
          wx.navigateTo({
            url: '/pages/cart/index',
          })
        }
      }
    })
  },
  goToPassAudit() {
    const openid = wx.getStorageSync('openid');
    if (!this.data.userInfo) {
      wx.showToast({
        title: '请先登录注册',
        icon: 'none'
      })
      return 0;
    }
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
            content: result.noticeInfo,
          })
        } else {
          wx.navigateTo({
            url: '/pages/iden_information/index',
          })
        }
      }
    })
  },
  goToMyPublish() {
    const openid = wx.getStorageSync('openid');
    if (!this.data.userInfo) {
      wx.showToast({
        title: '请先登录注册',
        icon: 'none'
      })
      return 0;
    }
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
            content: result.noticeInfo,
          })
        } else {
          wx.navigateTo({
            url: '/pages/my_publish/index',
          })
        }
      }
    })
  },
  goToEdit() {
    const openid = wx.getStorageSync('openid');
    if (!this.data.userInfo) {
      wx.showToast({
        title: '请先登录注册',
        icon: 'none'
      })
      return 0;
    }
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
            content: result.noticeInfo,
          })
        } else {
          wx.navigateTo({
            url: '/pages/edit_modify/index',
          })
        }
      }
    })
  }
})