// pages/student_iden/index.js
const app = getApp();
Page({
  data: {
    src: []
  },
  //页面加载的过程中，获取该用户的状态
  onLoad() {
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
        console.log(res);
        const state = res.data.extend.state;
        const result = res.data.extend.result;
        if (state == 2) {
          wx.showModal({
            title: '失败原因',
            content: result.noticeInfo,
          })
        }
      }
    })
  },
  gotoShow() {
    let _this = this;
    wx.chooseImage({
      count: 2, // 最多可以选择的图片张数，默认6
      sizeType: ['original', 'compressed'], // original 原图，compressed 压缩图，默认二者都有
      sourceType: ['album', 'camera'], // album 从相册选图，camera 使用相机，默认二者都有
      success: function (res) {
        // success
        _this.setData({
          src: res.tempFilePaths,
          isShow: true
        })
      }
    })
  },
  student_submit() {
    wx.showLoading({
      title: '信息提交中',
    })
    if (this.data.src) {
      const {
        src
      } = this.data;
      const openid = wx.getStorageSync('openid');
      src.forEach((v, i) => {
        wx.uploadFile({
          //被上传的文件的路径
          filePath: v,
          header: {
            "Content-Type": "multipart/form-data",
            'accept': 'application/json',
          },
          //上传的文件的名称 后台来获取文件
          name: 'file',
          //图片要上传到哪里去
          url: app.globalData.URL + '/images/upload',
          formData: ({
            openid: openid,
            flag: 1
          }),
          success(res) {
            wx.hideLoading({})
            //console.log(res);
            wx.showToast({
              title: '提交成功，请等待审核',
              icon: '', //默认值是success,就算没有icon这个值，就算有其他值最终也显示success
              duration: 2000, //停留时间
            })
            setTimeout(() => {
              wx.navigateBack({
                delta: 1,
              })
            }, 1000)
          }
        })
      })
    } else {
      wx.showToast({
        title: '请上传照片',
        duration: 1000,
        icon: "none"
      })
    }
  }
})