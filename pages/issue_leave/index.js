// pages/issue_leave/index.js
const app = getApp();
Page({
  data: {
    src: [],
    isShow: false,
    commodity_infor: {} //商品信息
  },
  gotoShow() {
    let _this = this;
    let {src} = this.data;
    wx.chooseImage({
      count: 6, // 最多可以选择的图片张数，默认6
      sizeType: ['original', 'compressed'], // original 原图，compressed 压缩图，默认二者都有
      sourceType: ['album', 'camera'], // album 从相册选图，camera 使用相机，默认二者都有
      success: function (res) {
        for(let i = 0; i < res.tempFilePaths.length; i++) {
          src.push(res.tempFilePaths[i]);
        }
        _this.setData({
          src: res.tempFilePaths,
          isShow: true
        })
      }
    })
    //console.log(this.data.src);
  },
   //删除所选照片
   delete(e) {
    //console.log(e);
    const {index} = e.currentTarget.dataset;
    let {src} = this.data;
    src.splice(index, 1);
    this.setData({
      src: src
    })
  },
  submit(e) {
    let that = this;
    //console.log(that);
    //console.log(e.detail.value);
    for (let item in e.detail.value || !this.data.src) {
      // console.log(item);
      if (!e.detail.value[item] ) {
        wx.showToast({
          title: '请将信息填写完整',
          icon: 'none',
          duration: 1000
        })
        return false;
      }
    }
    const openid = wx.getStorageSync('openid');
    const res = e.detail.value;
    //console.log(e.detail.value);
    this.setData({
        // commodity_infor: {
        //   openid: openid,
        //   goods_name: res.name,
        //   goods_title: res.title,
        //   goods_price_new: res.price_new,
        //   goods_price_old: res.price_old,
        //   goods_xueyuan: res.institute,
        //   goods_dec: res.des,
        //   goods_address: res.address
        // }
        commodity_infor: {
          openid: openid,
          goodsName: res.name,
          goodsTitle: res.title,
          goodsPriceNew: res.price_new,
          goodsPriceOld: res.price_old,
          goodsXueyuan: res.institute,
          goodsDec: res.des,
          goodsAddress: res.address
        }
      }),
      wx.showLoading({
        title: '发布中',
      })
      wx.request({
        url: app.globalData.URL + '/goods/goodsIssue',
        // data: {
        //   goodinfo: JSON.stringify(this.data.commodity_infor)
        // },
        data: JSON.stringify(this.data.commodity_infor),
        method: "POST",
        header: {
          'content-type': 'application/json',
        },
        success(res) {
          //console.log(res);
          // console.log(that);
          const { src } = that.data; 
          let openid = wx.getStorageSync('openid');
          if (res.data.code == 200) {
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
                  flag: 0
                }),
                success(res) {
                  wx.hideLoading({})
                  console.log(res);
                    wx.showToast({
                      title: '发布成功',
                      icon: '',     //默认值是success,就算没有icon这个值，就算有其他值最终也显示success
                      duration: 2000,      //停留时间
                    })
                    setTimeout(() => {
                      wx.navigateBack({
                        delta: 1,
                      })
                    }, 1000)
                },
                fail(res) {
                  console.log(res);
                  wx.showToast({
                    title: '请重新尝试',
                    icon: 'error',     //默认值是success,就算没有icon这个值，就算有其他值最终也显示success
                    duration: 2000,      //停留时间
                  })
                }
              })
            })
          } else if(res.data.code == 100){
            wx.showToast({
              title: res.data.extend.error,
              icon: 'none',
              duration: 2000//持续的时间
            })
          }
        }
      })
  }
})