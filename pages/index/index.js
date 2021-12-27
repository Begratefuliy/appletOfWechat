// index.js
// 获取应用实例
//Page Object
const app = getApp();
Page({
  data: {
    //轮播图数组
    swiperList: [],
    currentIndex: 0,
    //公告数据
    Info: {},
    //二手商品数据
    goodSimpleInfo: [],
    //免费商品数据
    goodFreeInfo: [],
    isLeaveMore: true,
    isFreeMore: true
  },
  //页面加载就会触发
  onLoad: function (options) {
    //获取轮播图数据，在此调取函数
    this.getSwiperList();
    //获取轮播图数据
    this.getNotice();
    //获取二手商品数据
    this.getIssueLeave();
    //获取免费商品数据
    this.getIssueFree();
  },
  //获取轮播图数据
  getSwiperList() {
    wx.request({
      url: app.globalData.URL + '/images/getHomeImages',
      method: "GET",
      header: {
        'content-type': 'application/x-www-form-urlencoded',
      },
      success: (res) => {
        //console.log(res);
        //console.log(res.data.extend);
        let result = [];
        for (let key in res.data.extend) {
          result.push(res.data.extend[key]);
        }
        this.setData({
          swiperList: result.slice(0)
        });
        //console.log(this.data.swiperList);

      },
      fail(res) {
        console.log(res);
      }
    })
  },
  //获取公告数据
  getNotice() {
    let {
      Info
    } = this.data;
    wx.request({
      url: app.globalData.URL + '/admin/getNotice',
      method: "GET",
      header: {
        'content-type': 'application/x-www-form-urlencoded',
      },
      success: (res) => {
        //console.log(res);   
        this.setData({
          Info: res.data.extend
        })
      },
      fail(res) {
        console.log(res);
      }
    })
  },
  //获取二手商品信息
  getIssueLeave() {
    wx.showLoading({
      title: '加载中',
    })
    let goodSimpleInfo = this.data.goodSimpleInfo;
    wx.request({
      url: app.globalData.URL + '/goods/getSimpleGoods?state=1',
      method: "GET",
      header: {
        'content-type': 'application/x-www-form-urlencoded',
      },
      data: {
        pageNum: app.globalData.Lpage
      },
      success: (res) => {
        wx.hideLoading({})
        if (res.data.code === 100) {
          if(this.data.isLeaveMore){
            wx.showToast({
              title: '没有更多商品啦!',
              icon: 'none'
            })
            this.setData({
              isLeaveMore: false
            })
          }
        } else {
          console.log(res);
          let result = goodSimpleInfo;
          for (let key in res.data.extend) {
            result.push(res.data.extend[key]);
          }
          this.setData({
            goodSimpleInfo: goodSimpleInfo
          });
          app.globalData.Lpage++;
          //console.log(this.data.goodSimpleInfo);
        }
      },
      fail(res) {
        console.log(res);
      }
    })
  },
  //获取免费商品信息
  getIssueFree() {
    let goodFreeInfo = this.data.goodFreeInfo;
    wx.showLoading({
      title: '加载中',
    })
    wx.request({
      url: app.globalData.URL + '/goods/getSimFrGoods',
      method: "GET",
      header: {
        'content-type': 'application/x-www-form-urlencoded',
      },
      data: {
        pageNum: app.globalData.Fpage
      },
      success: (res) => {
        wx.hideLoading({})
        if (res.data.code === 100) {
          if(this.data.isFreeMore){
            wx.showToast({
              title: '没有更多商品啦!',
              icon: 'none'
            })
            this.setData({
              isFreeMore: false
            })
          }
        } else {
          let result = goodFreeInfo;
          for (let key in res.data.extend) {
            result.push(res.data.extend[key]);
          }
          this.setData({
            goodFreeInfo: goodFreeInfo
          });
          app.globalData.Fpage++;
        }
      },
      fail(res) {
        console.log(res);
      }
    })
  },
  //tab栏切换
  switchBar(e) {
    let that = this;
    if (that.data.currentIndex === e.target.dataset.current) {
      return false
    } else {
      that.setData({
        currentIndex: e.target.dataset.current
      })
    }
  },
  //点击商品，挑转到商品详情页
  skipToDetail(e) {
    //console.log(e);
    const {
      gid
    } = e.currentTarget.dataset;
    const userInfo = wx.getStorageSync('userInfo');
    if (!userInfo) {
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
        } else {
          wx.navigateTo({
            url: '/pages/goods_detail/index?gid=' + gid,
          })
        }
      }
    })
  },
  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh: function () {
    //获取轮播图数据，在此调取函数
    this.getSwiperList();
    //获取轮播图数据
    this.getNotice();
    //获取二手商品数据
    this.getIssueLeave();
    //获取免费商品数据
    this.getIssueFree();
  },
  //监听用户上拉触底
  onReachBottom: function () {
    console.log('到底啦!');
    if (this.data.currentIndex === 0) {
      this.getIssueLeave()
    } else {
      this.getIssueFree();
    }
  },
  //监听页面隐藏
  onHide() {
    console.log("监听到此页面卸载");
    const collect = wx.getStorageSync('collect');
    //console.log(collect);
    const openid = wx.getStorageSync('openid');
    wx.request({
      url: app.globalData.URL + '/user/addGoodsToCar',
      method: 'POST',
      data: {
        "openid": openid,
        "gid": collect
      },
      header: {
        'content-type': 'application/json' // 默认值
      },
      success: (res) => {
        //console.log(res)
        //console.log(1111111);
      }
    })
  }
});