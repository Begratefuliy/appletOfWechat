// components/Tabs.js
Component({
  /**
   * 组件的属性列表
   */
  properties: {
    blankInputValue: {
      type: String,
      value: ''
    }
  },

  /**
   * 组件的初始数据
   */
  data: {
    inputvalue:''
  },

  /**
   * 组件的方法列表
   */
  methods: {
    bindinput:function(e){
      //console.log(e);
      this.setData({
        inputvalue: e.detail.value
      })
      //console.log('inputvalue:' + e.detail.value)
    },
    sendMessage(e) {
      this.triggerEvent('sendTab', e);
    }
  }
})
