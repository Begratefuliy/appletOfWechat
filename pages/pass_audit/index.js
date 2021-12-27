// pages/pass_audit/index.js
const app = getApp();
Page({
  data: {
    goodSimpleInfo: []
  },
  delete(e) {
    // wx.showModal({
    //   title: "请输入删除原因",
    //   cancelColor: 'cancelColor',
    //   editable: true,
    //   placeholderText: "请输入原因"
    // })
    //console.log(e);
    const {
      index,
      gid
    } = e.currentTarget.dataset;
    console.log(index);
    const {
      goodSimpleInfo
    } = this.data;
    wx.showModal({
      title: '提示',
      content: '确认删除吗？',
      success:(res) => {
        if (res.confirm) {
          wx.request({
            url: app.globalData.URL + '/admin/delete',
            method: "GET",
            header: {
              'content-type': 'application/x-www-form-urlencoded',
            },
            data: {
              gid: gid
            },
            success: (res) => {
              console.log(res);
              if (res.data.code == 200) {
                goodSimpleInfo.splice(index, 1);
                this.setData({
                  goodSimpleInfo
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
  onLoad() {
    // let {goodSimpleInfo} = this.data;
    wx.request({
      url: app.globalData.URL + '/goods/getSimpleGoods?state=1',
      method: "GET",
      header: {
        'content-type': 'application/x-www-form-urlencoded',
      },
      success: (res) => {
        console.log(res);
        //console.log(res.data.extend);
        let result = [];
        for (let key in res.data.extend) {
          result.push(res.data.extend[key]);
        }
        this.setData({
          goodSimpleInfo: result.slice(0)
        });
        console.log(this.data.goodSimpleInfo);
        if (this.data.goodSimpleInfo.length == 0) {
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
  }
})