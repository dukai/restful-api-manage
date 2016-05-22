const Vue = require('vue');
const loadtp = require('lib/loadtp');
const util = require('../lib/util');
module.exports = Vue.extend({
  template: loadtp('page-detail'),
  props: {
  },
  data: function(){
    return {
    }
  },

  computed: {
    detail: function(){
      return util.getItem(this.$route.params.uuid);
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
