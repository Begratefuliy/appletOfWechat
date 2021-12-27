// pages/administration_notice/index.js
const app = getApp();
Page({
  data: {
    info1: "",
    info2: "",
    info3: ""
  },
  submit(e) {
    console.log(e.detail.value);
    let mid;
    let reason;
    for(let index in e.detail.value){
      mid = index;
      reason = e.detail.value[index];
    }
    wx.request({
      url: app.globalData.URL + '/admin/getNotice',
      method: "GET",
      header: {
        'content-type': 'application/x-www-form-urlencoded',
      },
      data: {
        "mid": mid,
        "noticeInfo": reason
      },
      success(res) {
        if(res.data.code == 200) {
          wx.showToast({
            title: '更新成功',
          })
        } else {
          wx.showToast({
            title: "失败，请重新尝试",
            icon: "error"
          })
        }
        
      }
    })
  },
  onLoad: function(options) {
    wx.request({
      url: app.globalData.URL + '/admin/getNotice',
      method: "GET",
      header: {
        'content-type': 'application/x-www-form-urlencoded',
      },
      success:(res) => {
        console.log(res.data.extend.Info1.noticeInfo);
        this.setData({
          info1: res.data.extend.Info1.noticeInfo
        })
        this.setData({
          info2: res.data.extend.Info2.noticeInfo
        })
        this.setData({
          info3: res.data.extend.Info3.noticeInfo
        })
      }
    })
  }
})