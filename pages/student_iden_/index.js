// pages/student_iden_/index.js
const app = getApp();
Page({
  data: {
    AllUserSimInfo: []
  },
  onLoad() {
    wx.showLoading({
      title: '加载中',
    })
    wx.request({
      url: app.globalData.URL + '/admin/getAllUserSimInfo',
      method: 'GET',
      header: {
        'content-type': 'application/json' // 默认值
      },
      success: (res) => {
        wx.hideLoading({})
        //console.log(res);
        let result = [];
        for (let key in res.data.extend) {
          result.push(res.data.extend[key]);
        }
        this.setData({
          AllUserSimInfo: result.slice(0)
        });
      }
    })
  },
  goToDetail(e) {
    //console.log(e);
    const {
      openid
    } = e.currentTarget.dataset;
    wx.navigateTo({
      url: '/pages/user_detail/index?openid=' + openid,
    })
  },
  goToTalk(e) {
    const {
      AllUserSimInfo
    } = this.data;
    const index = e.currentTarget.dataset.index;
    const openid = wx.getStorageSync('openid');
    if(openid === AllUserSimInfo[index].openid) {
      wx.showToast({
        title: '无法与自己私信',
        icon: 'error'
      })
    } else {
      wx.navigateTo({
        url: '/pages/talk/index?toOpenid=' + AllUserSimInfo[index].openid + '&fromName=' + AllUserSimInfo[index].wxname + '&fromAvatarUrl=' + AllUserSimInfo[index].headImg,
      })
    }
  }
})