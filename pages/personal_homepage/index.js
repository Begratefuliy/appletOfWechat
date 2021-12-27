// pages/personal_homepage/index.js
const app = getApp();
Page({
  data: {
    userInfo: {},
    publish_product: [],
    openid: ''
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
  //跳转至私信页面
  goToTalk() {
    const myOpenid = wx.getStorageSync('openid');
    if (myOpenid != this.data.userInfo.openid) {
      const {
        userInfo
      } = this.data;
      wx.navigateTo({
        url: '/pages/talk/index?toOpenid=' + userInfo.openid + '&fromName=' + userInfo.wxname + '&fromAvatarUrl=' + userInfo.headImg,
      })
    } else {
      wx.showToast({
        title: '无法与自己私信',
        icon: 'error'
      })
    }
  },
  //获取用户的发布信息
  getPublish() {
    let {publish_product} = this.data;
    wx.request({
      url: app.globalData.URL + '/goods/getAllSimpleGoods',
      method: "GET",
      header: {
        'content-type': 'application/x-www-form-urlencoded',
      },
      data: {
        openid: this.data.openid,
        pageNum: app.globalData.Ppage
      },
      success: (res) => {
        console.log(res);
        if (res.data.code == 200) {
          let result = publish_product;
          for (let key in res.data.extend) {
            result.push(res.data.extend[key]);
          }
          this.setData({
            publish_product: publish_product
          });
          app.globalData.Ppage++;
          //console.log(this.data.publish_product);
          if (this.data.publish_product.length == 0) {
            wx.showToast({
              title: '暂无发布商品信息',
              icon: 'none'
            })
          }
        } else {
          wx.showToast({
            title: '没有更多发布商品啦!',
            icon: 'none'
          })
        }
      },
      fail(res) {
        console.log(res);
      }
    })
  },
  onLoad: function (options) {
    this.setData({
      openid: options.openid
    })
    //获取用户信息
    wx.request({
      url: app.globalData.URL + '/admin/getDeUserAndImage',
      method: 'GET',
      header: {
        'content-type': 'application/json'
      },
      data: {
        openid: this.data.openid
      },
      success: (res) => {
        //console.log(res);
        this.setData({
          userInfo: res.data.extend.uimage
        })
      }
    })
    this.getPublish();
  },
  onReachBottom() {
    this.getPublish();
  }
})