// pages/goods_detail/index.js
const app = getApp();
Page({
  data: {
    goodsDetail: {},
    isShowInput: 0,
    Maincomment_info: {}, //主评论的评论信息
    Vicecomment_info: {}, //子评论的评论信息
    gid: 0, //商品的gid
    allMainCommentInfo: [], //所有主评论信息
    allViceCommentInfo: [], //所有主评论下的子评论信息
    to_openid: "", //被评论者的openid
    comment_id: 0,
    index: 0, //所点击的主评论的数组下标
    comment_like_index: 0,
    isCollect: false //判断是否收藏
  },
  // 商品收藏
  // 1 页面onShow的时候 加载缓存中的商品收藏的数据
  // 2 判断当前商品是不是被收藏
  //   1 是 改变页面图标
  //   2 不是 不需要操作
  // 3 点击商品收藏按钮
  //   1 判断该商品是否存在于缓存数组中
  //   2 已经存在 把该商品删除
  //   3 没有存在 把商品添加到收藏数组中 存入缓存中即可
  onShow() {},
  onShareAppMessage: function () {
    return {
      title: '商品详情',
      path: 'pages/goods_detail/index' // 路径，传递参数到指定页面。
    }
  },
  relation() {
    wx.showActionSheet({
      itemList: ["复制微信", "复制QQ"],
      success: function (res) {
        console.log(res.tapIndex);
        wx.setClipboardData({
          data: "this.data.contact[res.tapIndex]",
          success: function (res) {}
        })
      }
    })
  },
  //点击 商品收藏图标
  handleCollect() {
    let {
      isCollect
    } = this.data;
    let {
      goodsDetail
    } = this.data;
    // 1 获取缓存中的商品收藏数组
    let collect = wx.getStorageSync('collect') || [];
    // 2 判断该商品是否被收藏过
    let index = collect.findIndex(v => v === goodsDetail.gid);
    // 3 当index != -1表示 已经收藏过
    if (index !== -1) {
      //能找到 已经收藏过了 在数组中删除该商品
      collect.splice(index, 1);
      isCollect = false;
      wx.showToast({
        title: "取消成功",
        icon: "success",
        duration: 1000,
        mask: true
      })
    } else {
      //没有收藏过
      collect.push(goodsDetail.gid);
      isCollect = true;
      wx.showToast({
        title: "收藏成功",
        icon: "success",
        duration: 1000,
        mask: true
      })
    }
    // 4 把数组存入到缓存中
    wx.setStorageSync("collect", collect);
    // 5 修改data中的属性 isCollect
    this.setData({
      isCollect
    })
  },
  //点赞
  comment_like(e) {
    this.setData({
      comment_like_index: e.currentTarget.dataset.index
    })
    let {
      allMainCommentInfo,
      comment_like_index
    } = this.data;
    const id = allMainCommentInfo[comment_like_index].inId;
    const openid = wx.getStorageSync('openid');
    if (allMainCommentInfo[comment_like_index].likeState == 0) {
      wx.request({
        url: app.globalData.URL + '/liked/like',
        method: 'GET',
        header: {
          'content-type': 'application/json' // 默认值
        },
        data: {
          openid: openid,
          objId: id,
          type: 1
        },
        success: (res) => {
          console.log(res);
          allMainCommentInfo[comment_like_index].likeState = 1;
          allMainCommentInfo[comment_like_index].likeNum = res.data.extend.count;
          this.setData({
            allMainCommentInfo: allMainCommentInfo
          })
        }
      })
    } else {
      wx.request({
        url: app.globalData.URL + '/liked/unlike',
        method: 'GET',
        header: {
          'content-type': 'application/json' // 默认值
        },
        data: {
          openid: openid,
          objId: id,
          type: 1
        },
        success: (res) => {
          console.log(res);
          allMainCommentInfo[comment_like_index].likeState = 0;
          allMainCommentInfo[comment_like_index].likeNum = res.data.extend.count;
          this.setData({
            allMainCommentInfo: allMainCommentInfo
          })
        }
      })
    }
  },
  //点击查看更多评论
  comment_more() {
    wx.navigateTo({
      url: '/pages/comment_detail/index',
    })
  },
  //点击预览大图
  handlePreviewImage(e) {
    const {
      url
    } = e.currentTarget.dataset;
    const {
      imageUrl
    } = this.data.goodsDetail;
    let res = [];
    for (let key in imageUrl) {
      res.push(imageUrl[key]);
    }
    wx.previewImage({
      current: url, //必须是http图片，本地图片无效
      urls: res, //必须是http图片，本地图片无效
    })
  },
  //监听页面加载
  onLoad(option) {
    let gid = this.data.gid;
    this.setData({
      gid: option
    })
    //获取物品详细信息
    this.getDetailInfo();
    //获取商品评论信息
    this.getCommentInfo();
  },
  //获取物品详情信息
  getDetailInfo() {
    wx.request({
      url: app.globalData.URL + '/goods/getDeGoodfwl',
      method: 'GET',
      header: {
        'content-type': 'application/json' // 默认值
      },
      data: {
        gid: this.data.gid.gid
      },
      success: (res) => {
        //console.log(res);
        this.setData({
          goodsDetail: res.data.extend.goodInfo
        })
        let {
          isCollect
        } = this.data;
        let {
          goodsDetail
        } = this.data;
        //console.log(goodsDetail);
        //1 获取缓存中的商品收藏的数组
        let collect = wx.getStorageSync("collect") || [];
        //console.log(collect);
        //2 判断当前商品是否被收藏
        let index = collect.indexOf(goodsDetail.gid);
        //console.log(goodsDetail.gid);
        //console.log(index);
        if (index !== -1) {
          //数组中找到了这个商品
          isCollect = true
        }
        this.setData({
          isCollect
        })
      }
    })
  },
  // 获取商品评论信息
  getCommentInfo() {
    let {
      allMainCommentInfo
    } = this.data;
    const openid = wx.getStorageSync('openid')
    wx.request({
      url: app.globalData.URL + '/pl/getAllComments',
      method: 'GET',
      header: {
        'content-type': 'application/json' // 默认值
      },
      data: {
        gid: this.data.gid.gid,
        openid: openid
      },
      success: (res) => {
        //console.log(res.data)
        this.setData({
          allMainCommentInfo: res.data
        })
      }
    })
  },
  //点击子评论，跳转至评论详情
  toCommentDetail(e) {
    const {
      id
    } = e.currentTarget.dataset;
    console.log(e);
    wx.navigateTo({
      url: '/pages/comment_detail/index?id=' + id,
    })
  },
  //点击评论弹出键盘
  showInput() {
    this.setData({
      isShowInput: 1
    })
  },
  //失去焦点，键盘消失
  hideInput() {
    this.setData({
      isShowInput: 0
    })
  },
  //发布主评论
  submit_main(e) {
    console.log(e.detail.value.comment);
    const comment = e.detail.value.comment;
    if (!comment) {
      wx.showModal({
        title: '提示',
        content: '评论内容不能为空！',
      })
      return 0;
    }
    const openid = wx.getStorageSync('openid');
    const {
      gid
    } = this.data;
    this.setData({
      Maincomment_info: {
        goodId: gid.gid,
        fromOpenid: openid,
        content: comment
      }
    })
    wx.request({
      url: app.globalData.URL + '/pl/addMainComments',
      method: 'POST',
      header: {
        'content-type': 'application/json'
      },
      data: {
        "info": JSON.stringify(this.data.Maincomment_info)
      },
      success: (res) => {
        console.log(res);
        let allMainCommentInfo = this.data.allMainCommentInfo;
        allMainCommentInfo.unshift(res.data.extend.commentsInfo);
        this.setData({
          allMainCommentInfo: allMainCommentInfo
        })
      }
    })
  },
  //点击回复，键盘弹出
  main_comment_reply(e) {
    this.setData({
      isShowInput: 2
    })
    //console.log(e)
    this.setData({
      to_openid: e.currentTarget.dataset.openid,
      comment_id: e.currentTarget.dataset.id,
      index: e.currentTarget.dataset.index
    })
  },
  //发布子评论
  submit_vice(e) {
    console.log(e.detail.value.comment);
    const comment = e.detail.value.comment;
    const openid = wx.getStorageSync('openid');
    if (!comment) {
      wx.showModal({
        title: '提示',
        content: '评论内容不能为空！',
      })
      return 0;
    }
    const {
      to_openid,
      comment_id
    } = this.data;
    this.setData({
      Vicecomment_info: {
        fromOpenid: openid,
        content: comment,
        toOpenid: to_openid,
        commentId: comment_id
      }
    })
    wx.request({
      url: app.globalData.URL + '/pl/addSonCommments',
      method: 'POST',
      header: {
        'content-type': 'application/json'
      },
      data: JSON.stringify(this.data.Vicecomment_info),
      success: (res) => {
        console.log(res.data.extend);
        let allMainCommentInfo = this.data.allMainCommentInfo;
        let index = this.data.index;
        allMainCommentInfo[index].commentsReplies.unshift(res.data.extend.commentsReply);
        this.setData({
          allMainCommentInfo: allMainCommentInfo
        })
      }
    })
  },
  //进入用户详情页面
  goToUserDetail(e) {
    //console.log(e);
    const openid = e.currentTarget.dataset.openid;
    wx.navigateTo({
      url: '/pages/personal_homepage/index?openid=' + openid,
    })
  }
})