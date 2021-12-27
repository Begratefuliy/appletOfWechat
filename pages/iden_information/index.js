// pages/about_our/index.js
const app = getApp();
Page({
  data: {
    MyCheckSimGoods: []
  },
  look_over(e) {
    console.log(e);
    const {
      gid
    } = e.currentTarget.dataset;
    wx.request({
      url: app.globalData.URL + '/user/whyNot',
      method: 'GET',
      header: {
        'content-type': 'application/json' // 默认值
      },
      data: {
        gid: gid
      },
      success(res) {
        //console.log(res.data.extend.notice.noticeInfo)
        wx.showModal({
          title: '失败原因',
          content: res.data.extend.notice.noticeInfo
        })
      }
    })
  },
  delete(e) {
    const {
      index,
      gid,
      state
    } = e.currentTarget.dataset;
    const {
      MyCheckSimGoods
    } = this.data;
    wx.showModal({
      title: '提示',
      content: '确认删除吗？',
      success: (res) => {
        if (res.confirm) {
          wx.request({
            url: app.globalData.URL + '/user/deleteCheckFail',
            method: "GET",
            header: {
              'content-type': 'application/json',
            },
            data: {
              gid: gid,
              state: state
            },
            success: (res) => {
              console.log(res);
              if (res.data.code == 200) {
                MyCheckSimGoods.splice(index, 1);
                this.setData({
                  MyCheckSimGoods
                })
              } else {
                wx.showToast({
                  title: '出现未知错误',
                  icon: "error"
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
  onLoad() {
    const openid = wx.getStorageSync('openid');
    wx.request({
      url: app.globalData.URL + '/goods/getMyCheckSimGoods',
      method: "GET",
      header: {
        'content-type': 'application/x-www-form-urlencoded',
      },
      data: {
        openid: openid
      },
      success: (res) => {
        console.log(res);
        if (res.data.code == 200) {
          let result = [];
          for (let key in res.data.extend) {
            result.push(res.data.extend[key]);
          }
          this.setData({
            MyCheckSimGoods: result.slice(0)
          });
          if (this.data.MyCheckSimGoods.length == 0) {
            wx.showToast({
              title: '暂无审核信息',
              icon: 'none'
            })
          }
        } else if(res.data.code == 100){
          wx.showToast({
            title: '暂无审核信息！',
            icon: 'none'
          })
        } else{
          wx.showToast({
            title: '请重新尝试',
            icon: 'error'
          })
        }
      }
    })
  }
})