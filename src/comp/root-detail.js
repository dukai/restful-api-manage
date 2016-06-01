const Vue = require('vue');
const loadtp = require('lib/loadtp');
const util = require('../lib/util');
module.exports = Vue.extend({
  template: loadtp('root-detail'),
  props: {
  },
  data: function(){
    return {
    }
  },

  computed: {
    item: function(){
      var o = Object.assign(util.getItem(this.$route.params.uuid), util.getCurrent());
      console.log(o);
      return o;
    }
  },

  route: {
    data: function(transition){
      transition.next();
    }
  },
  methods: {
  }
});
