// pages/comment_detail/index.js
const app = getApp();
Page({
  data: {
    id: 0,
    allCommentInfo: {},
    commentInfo: {},
    textareaValue: null
  },
  //发布子评论
  submit_vice(e) {
    const {allCommentInfo} = this.data;
    console.log(e.detail.value.comment);
    const content = e.detail.value.comment;
    if (!content) {
      wx.showModal({
        title: '提示',
        content: '评论内容不能为空！',
      })
      return 0;
    }
    const openid = wx.getStorageSync('openid')
    let Vicecomment_info = {
      fromOpenid: openid,
        content: content,
        toOpenid: allCommentInfo.fromOpenid,
        commentId: allCommentInfo.inId
    }
    wx.request({
      url: app.globalData.URL + '/pl/addSonCommments',
      method: 'POST',
      header: {
        'content-type': 'application/json'
      },
      data: JSON.stringify(Vicecomment_info),
      success: (res)=> {
        //console.log(res);
        wx.showToast({
          title: '发布成功！',
        })
        let {allCommentInfo} = this.data;
        allCommentInfo.commentsReplies.unshift(res.data.extend.commentsReply);
        this.setData({
          allCommentInfo: allCommentInfo,
          textareaValue: ''
        })
      }
    })
  },
  onLoad: function (options) {
    this.setData({
      id: options
    })
    const {id} = this.data;
    const openid = wx.getStorageSync('openid');
    console.log(id.id, openid);
    wx.request({
      url: app.globalData.URL + '/pl/getMainAllSonCom',
      method: 'GET',
      header: {
        'content-type': 'application/json'
      },
      data: {
        inId: id.id,
        openid: openid
      },
      success: (res) => {
        this.setData({
          allCommentInfo: res.data.extend.commentsInfo
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