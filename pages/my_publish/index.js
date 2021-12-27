// pages/my_publish/index.js
const app = getApp();
Page({
  data: {
    goodSimpleInfo: [],
    userInfo: {}
  },
  delete(e) {
    const {
      gid,
      index
    } = e.currentTarget.dataset;
    let {goodSimpleInfo} = this.data;
    wx.showModal({
      title: '提示',
      content: '确认删除？',
      success: (res) => {
        if (res.confirm) { //这里是点击了确定以后
          wx.request({
            url: app.globalData.URL + '/user/deleteMyIssue',
            method: "GET",
            header: {
              'content-type': 'application/x-www-form-urlencoded',
            },
            data: {
              gid: gid
            },
            success: (res) => {
              if (res.data.code == 200) {
                goodSimpleInfo.splice(index, 1);
                this.setData({
                  goodSimpleInfo
                })
              } else {
                wx.showToast({
                  title: '请重新尝试',
                  icon: 'error'
                })
              }
            },
            fail(res) {
              console.log(res);
            }
          })
        }
      }
    })
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
  getMyPublish() {
    const openid = wx.getStorageSync('openid');
    let {goodSimpleInfo} = this.data;
    wx.showLoading({
      title: '加载中',
    })
    wx.request({
      url: app.globalData.URL + '/goods/getMyIssGoods',
      method: "GET",
      header: {
        'content-type': 'application/x-www-form-urlencoded',
      },
      data: {
        openid: openid,
        pageNum: app.globalData.Mpage
      },
      success: (res) => {
        //console.log(res);
        wx.hideLoading({})
        if (res.data.code == 200) {
          let result = goodSimpleInfo;
          for (let key in res.data.extend) {
            result.push(res.data.extend[key]);
          }
          this.setData({
            goodSimpleInfo: goodSimpleInfo
          });
          app.globalData.Mpage++;
          //console.log(this.data.goodSimpleInfo);
          if (this.data.goodSimpleInfo.length == 0) {
            wx.showToast({
              title: '暂无发布商品信息',
              icon: 'none'
            })
          }
        } else {
          wx.showToast({
            title: '没有啦!',
            icon: 'none'
          })
        }
      },
      fail(res) {
        console.log(res);
      }
    })
  },
  onLoad() {
    const userInfo = wx.getStorageSync('userInfo')
    this.setData({
      userInfo: userInfo
    })
    this.getMyPublish();
  },
  onReachBottom() {
    this.getMyPublish();
  }
})