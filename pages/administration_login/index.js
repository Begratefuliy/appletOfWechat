// pages/administration/index.js
const app = getApp();
Page({
  data: {
    ad_infor: {},
    verify_img: ""
  },
  // onLoad() {
  //   this.getVerifyImg()
  // },
  submit(e) {
    console.log(e.detail.value);
    let result = e.detail.value;
    const value = e.detail.value;
    for (let item in value) {
      if (!value[item]) {
        wx.showToast({
          title: '请输入账号密码',
          icon: 'none',
          duration: 1000
        })
        return false
      }
    }
    this.setData({
      ad_infor: {
        username: result.account,
        passwd: result.password,
      }
    })
    console.log(result.account, result.password)
    wx.request({
      url: app.globalData.URL + '/admin/adminLogin',
      data: {
        "username": result.account,
        "passwd": result.password,
      },
      method: "POST",
      header: {
        'content-type': 'application/x-www-form-urlencoded',
      },
      success(res) {
        //console.log(res);
        if (res.data.code == 200) {
          wx.navigateTo({
            url: '/pages/administration_menu/index',
          })
        } else {
          wx.showToast({
            title: '密码错误',
            icon: 'error'
          })
        }
      }
    })
  },
  //获取图片二维码函数
  getVerifyImg() {
    wx.request({
      url: app.globalData.URL + '/admin/captcha',
      method: 'GET',
      header: {
        'content-type': 'application/json' // 默认值
      },
      success: (res) => {
        console.log(res.data);
        // var base64 =  res && res.data; 
        // if (base64) {
        //   console.log(1)
        //   base64 = base64.replace(/[\r\n]/g, "")
        //   res.data = base64;
        //   this.setData({
        //     verify_img: res
        //   })
        // }
        // var array = wx.base64ToArrayBuffer(res.data);
        // var base64 = wx.arrayBufferToBase64(array)
        // this.setData({
        //   verify_img: 'data:image/jpg;base64,' + base64
        // });
      }
    })
  }
})