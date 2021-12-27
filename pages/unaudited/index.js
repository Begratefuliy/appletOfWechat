// pages/unaudited/index.js
const app = getApp();
Page({
  data: {
    goodSimpleInfo: [],
  },
  pass(e) {
    let gid = e.currentTarget.dataset.gid;
    let index = e.currentTarget.dataset.index;
    let {goodSimpleInfo} = this.data;
    wx.request({
      url: app.globalData.URL + '/admin/setState',
      method: "GET",
      header: {
        'content-type': 'application/x-www-form-urlencoded',
      },
      data: {
        "gid": gid,
        "state": 1
      },
      success: (res) => {
        console.log(res);
        goodSimpleInfo.splice(index, 1);
        this.setData({
          goodSimpleInfo
        })
      }
    })
  },
  unpass(e) {
    //console.log(e);
    let {
      goodSimpleInfo
    } = this.data;
    let gid = e.currentTarget.dataset.gid;
    let index = e.currentTarget.dataset.index;
    let reason;
    console.log(index);
    wx.showModal({
      title: '审核失败原因',
      editable: true,
      success: (res) => {
        if (res.confirm) {
          reason = res.content;
          wx.request({
            url: app.globalData.URL + '/admin/setState',
            method: "GET",
            header: {
              'content-type': 'application/x-www-form-urlencoded',
            },
            data: {
              "gid": gid,
              "state": 2,
              "reason": reason
            },
            success: (res) => {
              console.log(res);
              goodSimpleInfo.splice(index, 1);
              this.setData({
                goodSimpleInfo
              })
            }
          })
        } else if (res.cancel) {
          //console.log('用户点击取消')
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
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    wx.request({
      url: app.globalData.URL + '/goods/getSimpleGoods?state=0',
      method: "GET",
      header: {
        'content-type': 'application/x-www-form-urlencoded',
      },
      success: (res) => {
        //console.log(res.data.extend);
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
            title: '暂无未审核商品',
            icon: 'none'
          })
        }
        //console.log(this.data.goodSimpleInfo.gid);
      },
      fail(res) {
        console.log(res);
      }
    })
  },
})