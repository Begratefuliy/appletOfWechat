// pages/talk/talk.js
import appUtil from "../../utils/util.js"
const app = getApp();
Page({
  data: {
    othername: '杨少杰',
    fromOpenid: '',
    toOpenid: '',
    isOpen: 0,
    blankInputValue: '',
    content: '', //发送信息的内容
    avatarUrl: '', //当前用户的头像
    fromAvatarUrl: '', //对方用户的头像
    chatContent: [],
    toView: 'msg-0',
    sendTime: ''
  },
  sendTab(e) {
    const _this = this;
    //console.log(e);
    console.log(e.detail.currentTarget.dataset.content);
    if (!e.detail.currentTarget.dataset.content) {
      wx.showModal({
        title: '提示',
        content: '发送内容不能为空！',
      })
      return 0;
    }
    this.setData({
      content: e.detail.currentTarget.dataset.content
    })
    let {
      fromOpenid,
      toOpenid,
      chatContent
    } = _this.data;
    let a = {
      fromOpenid: fromOpenid,
      toOpenid: toOpenid,
      content: this.data.content
    };
    wx.sendSocketMessage({
      data: JSON.stringify(a), //需要发送的内容
      success: (e) => { //接口调用成功的回调函数
        let a = {
          from: 1,
          content: _this.data.content
        }
        chatContent.push(a);
        this.setData({
          blankInputValue: '',
          chatContent: chatContent,
          toView: 'msg-' + (chatContent.length - 1)
        })
      }

    })
  },
  onLoad: function (options) {
    console.log(options);
    const fromOpenid = wx.getStorageSync('openid');
    const userInfo = wx.getStorageSync('userInfo');
    const {
      toOpenid,
      fromName,
      fromAvatarUrl,
    } = options;
    this.setData({
      fromOpenid: fromOpenid,
      toOpenid: toOpenid,
      fromAvatarUrl: fromAvatarUrl,
      avatarUrl: userInfo.avatarUrl
    })
    wx.setNavigationBarTitle({
      title: fromName
    })
    let _this = this
    let isOpen = this.data.isOpen;

    //创建websocket 连接
    wx.connectSocket({
      url: app.globalData.WSS + '/' + fromOpenid + '/' + toOpenid,
      header: {
        'content-type': 'application/json',
      },
      timeout: 5000, //超时时间，单位为毫秒
      success: (e) => { //接口调用成功的回调函数
        console.log(e)
      },
      fail: (e) => { //接口调用失败的回调函数
        console.log(e)
      }
    })
    //接受消息
    wx.onSocketMessage((e) => {
      let {
        chatContent,
        fromOpenid
      } = this.data;
      let from = 0;
      if(fromOpenid === JSON.parse(e.data).fromOpenid) {
        from = 1;
      }else {
        from = 0;
      }
      //console.log(e);
      let a = {
        from: from,
        content: JSON.parse(e.data).content,
        fromOpenid: JSON.parse(e.data).fromOpenid
      }
      chatContent.push(a);
      _this.setData({
        chatContent: chatContent
      })
    })

    //监听 WebSocket 连接关闭事件
    wx.onSocketClose((result) => {
      console.log('监听连接关闭');
    })

    //监听 WebSocket 错误事件
    wx.onSocketError((result) => {
      console.log('监听连接错误');
    })
  },
  onUnload() {
    //console.log('监听页面返回');
    wx.closeSocket();
  }
})