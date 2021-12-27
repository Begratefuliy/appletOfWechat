// pages/feedback/index.js
Page({
  data: {
    //被选中的图片路径
    chooseImgs:[],
    textVal:"",
    currentIndex:0
  },
  handleChooseImg() {
    wx.chooseImage({
      count: 9,
      sizeType: ["original", "compressed"],
      sourceType: ["album", "camera"],
      success:(res) => {
        this.setData({
          chooseImgs:[...this.data.chooseImgs, ...res.tempFilePaths]
        })
      }
    })
  },
  handleRemoveImg(e) {
    const {index}=e.currentTarget.dataset;
    console.log(index);
    let {chooseImgs}=this.data;
    chooseImgs.splice(index, 1);
    this.setData({
      chooseImgs
    })
  },
  handleTextInput(e) {
    this.setData({
      textVal:e.detail.value
    })
  },
  handleFormSubmit() {
    const {textVal,chooseImgs} = this.data;
    if(!textVal.trim()){
      wx.showToast({
        title: '输入不合法',
        icon: 'none',
        mask: true
      })
      return;
    }
    // 3 准备上传图片 到专门的图片服务器
    // 上传文件的api 不支持 多个文件同时上传 遍历数组 挨个上传
    chooseImgs.forEach((v,i) => {
      // wx.uploadFile({
      //   //被上传的文件的路径
      //   filePath: '',
      //   //上传的文件的名称 后台来获取文件
      //   name: 'file',
      //   //图片要上传到哪里去
      //   url: '',
      // })
      if(i === chooseImgs.length-1) {
        console.log("提交成功");
        //提交成功
        //重置页面
        this.setData({
          textVal:"",
          chooseImgs:[]
        })
        //返回上一个页面
        wx.navigateBack({
          delta: 1,
        })
      }
    })
  },
  //tab栏切换
  switchBar(e){
    let that = this;
    if(that.data.currentIndex === e.target.dataset.current){
      return false
    } else {
      that.setData({
        currentIndex: e.target.dataset.current
      })
    }

  }
})