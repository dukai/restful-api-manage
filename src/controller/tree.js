// demo data
const Vue = require('vue');
const loadtp = require('lib/loadtp');

var data = {
  name: 'YJB OM System',
  open: true,
  children: [
    { name: '数据运营' },
    { name: '资金对账' },
    {
      name: '异常报警',
      open: false,
      children: [
        {
          name: '异常提现',
          children: [
            { name: '获取每日提现笔数图表信息数据' },
            { name: '获取每日提现总额图表信息数据' }
          ]
        },
        { name: '异常结算' },
        {
          name: 'child folder',
          children: [
            { name: 'hello' },
            { name: 'wat' }
          ]
        }
      ]
    }
  ]
}

// define the item component
Vue.component('item', {
  template: loadtp('tree-item'),
  props: {
    model: Object
  },
  data: function () {
    return {
      selected: false
    }
  },
  computed: {
    isFolder: function () {
      return !!this.model.children && !!this.model.children.length
    },
    open: {
        get: function(){
            return !!this.model.open;
            return this.isFolder && !!this.model.open;
        },
        set: function(value){
            Vue.set(this.model, 'open', value);
        }
    }
  },
  methods: {
    toggle: function () {
      if (this.isFolder) {
        this.open = !this.open;
      }
    },
    changeType: function (e) {
      if (!this.isFolder) {
        Vue.set(this.model, 'children', [])
        this.addChild(e)
        this.open = true
      }
    },
    addChild: function (e) {
      e.preventDefault();
      e.stopPropagation();

      if (!this.isFolder) {
        Vue.set(this.model, 'children', [])
        this.open = true
      }
      if(!this.open){
        this.toggle();
      }
      this.model.children.push({
        name: 'new stuff'
      })
    }
  }
})

// boot up the demo
var treedemo = new Vue({
  el: '#demo',
  data: {
    treeData: data
  }
})

