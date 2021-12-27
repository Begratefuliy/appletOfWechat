const app = getApp();
Page({
  data: {
    openid: '', //记录此用户的openid
    userInfo: {} //用户信息
  },
  onLoad: function (options) {
    wx.showLoading({
      title: '加载中',
    })
    this.setData({
      openid: options.openid
    })
    wx.request({
      url: app.globalData.URL + '/admin/getDeUserAndImage',
      method: 'GET',
      header: {
        'content-type': 'application/json' 
      },
      data: {
        openid: options.openid
      },
      success: (res) => {
        wx.hideLoading({})
        //console.log(res);
        this.setData({
          userInfo: res.data.extend.uimage
        })
      }
    })
  },
  //认证通过
  pass() {
    const {openid} = this.data;
    wx.request({
      url: app.globalData.URL + '/admin/userCheck',
      header: {
        'content-type': 'application/json' // 默认值
      },
      data: {
        state: 1,
        openid: openid
      },
      success: (res) => {
        //console.log(res);
        wx.showToast({
          title: '认证成功',
        }),
        setTimeout(()=>{
          wx.navigateBack({
            delta: 1,
          })
        }, 800)
      }
    })
  },
  //认证不通过
  unpass() {
    const {openid} = this.data;
    wx.showModal({
      title: '认证失败原因',
      editable: true,
      success: (res) => {
        if (res.confirm) {
          let reason = res.content;
          wx.request({
            url: app.globalData.URL + '/admin/userCheck',
            method: "GET",
            header: {
              'content-type': 'application/x-www-form-urlencoded',
            },
            data: {
              openid: openid, 
              "state": 2,
              "reason": reason
            },
            success: (res) => {
              wx.showToast({
                title: '操作成功',
              })
              setTimeout(()=>{
                wx.navigateBack({
                  delta: 1,
                })
              }, 800)
            }
          })
        } else if (res.cancel) {}
      }
    })
  },
  //拉黑此用户
  block() {
    const {openid} = this.data;
    wx.showModal({
      title: '拉黑原因',
      editable: true,
      success: (res) => {
        if (res.confirm) {
          let reason = res.content;
          wx.request({
            url: app.globalData.URL + '/admin/userCheck',
            method: "GET",
            header: {
              'content-type': 'application/x-www-form-urlencoded',
            },
            data: {
              openid: openid, 
              "state": 10,
              "reason": reason
            },
            success: (res) => {
              wx.showToast({
                title: '操作成功',
              })
              setTimeout(()=>{
                wx.navigateBack({
                  delta: 1,
                })
              }, 800)
            }
          })
        } else if (res.cancel) {}
      }
    })
  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {

  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {

  },

  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide: function () {

  },

  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload: function () {

  },

  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh: function () {

  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function () {

  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {

  }
})