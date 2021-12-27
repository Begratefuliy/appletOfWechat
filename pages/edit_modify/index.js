// pages/register/index.js
const app = getApp();
Page({
  data: {
    complete_information:{},
    user_info:{}
  },
  //监听页面加载
  onLoad() {
    const openid = wx.getStorageSync('openid');
    //获取用户班级等
    wx.request({
      url: app.globalData.URL + '/user/getUserDeInfo',
      data:{
        openid: openid
      },
      method: "GET",
      header: {
        'content-type': 'application/json',
      },
      success: (res) => {
        console.log(res);
        const result = res.data.extend.userDe;
        this.setData({
          complete_information: {
            school: result.school,
            xuehao: result.xuehao,
            class: result.uclass
          }
        })
        //console.log(this.data.complete_information);
      }
    })
    //获取用户微信，qq等
    wx.request({
      url: app.globalData.URL + '/user/getUserInfo',
      data:{
        openid: openid
      },
      method: "GET",
      header: {
        'content-type': 'application/json',
      },
      success: (res) => {
        console.log(res);
        const res1 = res.data.extend.userinfo;
        this.setData({
          user_info: {
            uname: res1.uname,
            qq: res1.qq,
            wx: res1.wx
          }
        })
      }
    })
  },
  //监听页面显示
  onShow(e) {},
  submit(e) {
     //console.log(e.detail.value);
    const reg = e.detail.value;
    const userInfo = wx.getStorageSync('userInfo');
    const openid = wx.getStorageSync('openid');
    this.setData({
      complete_information:{
        openid: openid,
        school: reg.school,
        xuehao: reg.xuehao,
        uclass: reg.class 
      }
    })
    wx.request({
      url: app.globalData.URL + '/user/updateUserInfo',
      // data: {
      //   userDetailInfo: JSON.stringify(this.data.complete_information)
      // },
      data: JSON.stringify(this.data.complete_information),
      method: "POST",
      header: {
        'content-type': 'application/json',
      },
      success(res) {
        console.log(res);
        if(res.data.code == 200) { 
          wx.showToast({
            title: '信息完善成功',
            icon: '',     //默认值是success,就算没有icon这个值，就算有其他值最终也显示success
            duration: 2000,      //停留时间
          })
          setTimeout(() => {
            wx.navigateBack({
              delta: 1,
            })
          }, 1000)
        } else {
          wx.showToast({
            title: '完善失败，请重新尝试',
            icon: 'fail',     //默认值是success,就算没有icon这个值，就算有其他值最终也显示success
            duration: 2000,      //停留时间
          })
        }
      }
    })
  }
})