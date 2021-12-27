// pages/login/index.js
const app = getApp();
Page({
  handleGetUserInfo() {
    wx.getUserProfile({
      desc: 'Wexin', // 这个参数是必须的
      success: (res) => {
        const userInfo = res.userInfo;
        wx.setStorageSync("userInfo", userInfo);
        wx.login({
          //获取code
          success: function (res) {
            var code = res.code; //返回code
            // console.log(code);
            var appId = 'wxf9831218c568e9b8';
            var secret = 'ba86639a340f165257fb6c113ebccb70';
            wx.request({
              url: app.globalData.URL + '/user/getOpenid',
              data: {
                'code': code,
                'appid': 'wxf9831218c568e9b8',
                'secret': 'ba86639a340f165257fb6c113ebccb70'
              },
              header: {
                'content-type': 'json'
              },
              success: function (res) {
                var openid = res.data.openid;
                wx.setStorageSync("openid", openid);
                wx.navigateTo({
                  url: '/pages/register/index',
                })
              }
            })
          }
        })
        
      },
      fail: err => {
        console.log(err)
      }
    })
  }
})