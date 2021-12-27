// app.js
//app.js
App({
  //onLaunch,onShow: options(path,query,scene,shareTicket,referrerInfo(appId,extraData))
  onLaunch: function (options) {

  },
  onShow: function (options) {
    this.getCollectInfo();
  },

  onError: function (msg) {

  },
  //options(path,query,isEntryPage)
  onPageNotFound: function (options) {

  },
  globalData: {
    URL: "https://wdetian0918.icu/wx", //记得修改此页面其他的url地址
    WSS: "wss://wdetian0918.icu/wx",
    localSocket: {},
    callback: function () {},
    exceptionClose: true,
    Lpage:0, //二手商品分页信息
    Fpage:0, //免费商品分页信息
    Mpage:0, //我的发布分页信息
    Ppage:0 //个人中心分页信息
  },
  //获取用户的商品收藏信息
  getCollectInfo() {
    //console.log('我发请求了');
    const openid = wx.getStorageSync('openid');
    wx.request({
      url: 'https://wdetian0918.icu/wx/user/getFavorites',
      method: 'GET',
      header: {
        'content-type': 'application/json' // 默认值
      },
      data: {
        openid: openid
      },
      success: (res) => {
        // console.log(res);
        // console.log(res.data.extend.favorites);
        wx.setStorageSync('collect', res.data.extend.favorites);
      }
    })
  },
  // 初始化socket
  initSocket() {
    let that = this;
    that.globalData.exceptionClose = true;
    // var cookie = '';
    // var index = 0;
    // for (var key in that.getCookieSync('cookieKey')) {
    //   if (index > 0) {
    //     cookie += ';'
    //   }
    //   cookie += key + '=' + that.getCookieSync('cookieKey')[key]
    //   index = index + 1;
    // }
    that.globalData.localSocket = wx.connectSocket({
      url: api.WebSocketUrl
    })

    that.globalData.localSocket.onOpen(function (res) {
      console.log('WebSocket连接已打开！readyState=' + that.globalData.localSocket.readyState)

      while (socketMsgQueue.length > 0) {
        var msg = socketMsgQueue.shift();
        that.sendSocketMessage(msg);
      }
    })
    that.globalData.localSocket.onMessage(function (res) {
      that.globalData.callback(res);
    })
    that.globalData.localSocket.onError(function (res) {
      console.log('readyState=' + that.globalData.localSocket.readyState)
    })
    that.globalData.localSocket.onClose(function (res) {
      console.log('WebSocket连接已关闭！readyState=' + that.globalData.localSocket.readyState)

      if (that.globalData.exceptionClose) {
        that.initSocket();
      }

    })
  },
  //统一发送消息
  sendSocketMessage: function (msg) {
    if (this.globalData.localSocket.readyState === 1) {
      // console.log(JSON.stringify(msg))      
      this.globalData.localSocket.send({
        data: JSON.stringify(msg),
        success: function (res) {
          // console.log('发送成功,返回结果为',res)
        }
      })
    } else {
      socketMsgQueue.push(msg)
    }
  },
  onShow: function (options) {
    // if (this.globalData.localSocket.readyState !== 0 && this.globalData.localSocket.readyState !== 1) {
    //   console.log('开始尝试连接WebSocket！readyState=' + this.globalData.localSocket.readyState)
    //   this.initSocket()
    // }
  }
});