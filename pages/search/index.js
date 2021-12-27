// pages/search/index.js
const app = getApp();
Page({
  data: {
    searchContent: '',
    goodSimpleInfo: []
  },
  hotClick(e) {
    console.log(e.target.dataset.text);
    this.setData({
      searchContent: e.target.dataset.text
    })
    this.search();
  },
  submit(e) {
    //console.log(e.detail.value.text);
    this.setData({
      searchContent: e.detail.value.text
    })
    this.search();
  },
  search() {
    const {searchContent, goodSimpleInfo} = this.data;
    wx.showLoading({
      title: '搜索中',
    })
    wx.request({
      url: app.globalData.URL + '/goods/query',
      method: 'GET',
      header: {
        'content-type': 'application/json' // 默认值
      },
      data: {
        flag: searchContent
      },
      success:(res) => {
        wx.hideLoading({})
        //console.log(res.data)
        if( res.data.code == 200) {
          let result = [];
          for (let key in res.data.extend) {
            result.push(res.data.extend[key]);
          }
          this.setData({
            goodSimpleInfo: result.slice(0)
          });
          console.log(this.data.goodSimpleInfo);
          if(this.data.goodSimpleInfo.length == 0) {
            wx.showToast({
              title: '未搜索到相关商品',
              icon: 'none'
            })
          }
        }
      }
    })
  },
  toDetail(e) {
    const {
      gid
    } = e.currentTarget.dataset;
    const userInfo = wx.getStorageSync('userInfo')
    if(!userInfo) {
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
            content: result.noticeInfo,
          })
        }  else {
          wx.navigateTo({
            url: '/pages/goods_detail/index?gid=' + gid,
          })
        }
      }
    })
  }
})