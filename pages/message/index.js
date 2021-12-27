// pages/message.js
const app = getApp();
Page({
  /**
   * 页面的初始数据
   */
  data: {
    listInfo: [],
    start: 0, //触屏开始的时间
    end: 0 //触屏结束的时间
  },
  onLoad() {
    const openid = wx.getStorageSync('openid');
    wx.request({
      url: app.globalData.URL + '/lt/list',
      method: 'GET',
      header: {
        'content-type': 'application/json' // 默认值
      },
      data: {
        openid: openid
      },
      success: (res) => {
        //console.log(res);
        this.setData({
          listInfo: res.data.extend.chatLists
        })
      }
    })
  },
  goToTalk(e) {
    if (this.data.end - this.data.start < 350) {
      const {
        listInfo
      } = this.data;
      const index = e.currentTarget.dataset.index;
      //console.log(e)
      wx.navigateTo({
        url: '/pages/talk/index?toOpenid=' + listInfo[index].fromOpenid + '&fromName=' + listInfo[index].fromName + '&fromAvatarUrl=' + listInfo[index].fromHeadimage,
      })
    }
  },
  goToComment() {
    wx.navigateTo({
      url: '/pages/commentAndreply/index',
    })
  },
  goToLike() {
    wx.navigateTo({
      url: '/pages/like/index',
    })

  },
  touchStart(e) {
    this.setData({
      start: e.timeStamp
    })
  },
  touchEnd(e) {
    this.setData({
      end: e.timeStamp
    })
  },
  delete(e) {
    let listInfo = this.data.listInfo;
    const {fromopenid, index}= e.currentTarget.dataset;
    const myOpenid = wx.getStorageSync('openid'); 
    wx.showModal({
      title: '提示',
      content: '确认删除吗?',
      success(res) {
        if (res.confirm) {
          console.log('用户点击确定')
          wx.request({
            url: app.globalData.URL + '/lt/deleteList1',
            data: {
              myOpenid: myOpenid,
              beDeleteOpenid: fromopenid
            },
            header: {
              'content-type': 'application/json' // 默认值
            },
            success:(res) => {
              if(res.data.code === 200) {
                listInfo.splice(index, 1);
                this.setData({
                  listInfo: listInfo
                })
              } else{
                wx.showToast({
                  title: '删除失败',
                  icon: 'none'
                })
              }
            }
          })
        }
      }
    })
  }
})