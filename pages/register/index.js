// pages/register/index.js
const app = getApp();
Page({
  data: {
    userinfo: {}
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function () {
    const openid = wx.getStorageSync('openid');
    wx.request({
      url: app.globalData.URL + '/user/isRegister', //仅为示例，并非真实的接口地址
      data: {
        openid: openid
      },
      header: {
        'content-type': 'application/json' // 默认值
      },
      success(res) {
        console.log(res.data)
        if (res.data.code === 100) {
          wx.navigateBack({
            delta: 2,
          })
        }
      }
    })
  },
  submit(e) {
    // console.log(e.detail.value);
    const reg = e.detail.value;
    const userInfo = wx.getStorageSync('userInfo');
    const openid = wx.getStorageSync('openid');
    this.setData({
        userinfo: {
          openid: openid,
          wxname: userInfo.nickName,
          headImg: userInfo.avatarUrl,
          sex: userInfo.gender,
          uname: reg.name,
          qq: reg.qq,
          wx: reg.wx
        }
      }),
      wx.request({
        url: app.globalData.URL + '/user/register',
        // data: {
        //   userinfo: JSON.stringify(this.data.userinfo)
        // },
        data: JSON.stringify(this.data.userinfo),
        method: "POST",
        header: {
          'content-type': 'application/json',
        },
        success(res) {
          //console.log(1)
          //console.log(res);
          wx.navigateBack({
            delta: 2,
          })
          wx.setStorageSync('login', 1);
        },
        fail(res) {
          console.log(res);
        }
      })
  },
})