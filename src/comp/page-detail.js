const Vue = require('vue');
const loadtp = require('lib/loadtp');
Vue.component('page-detail', {
  template: loadtp('page-detail'),
  props: {
    detail: Object,
    show: {
      type: Boolean,
      required: true,
      twoWay: true    
    }
  },
  data: function(){
    return {
    }
  },

  computed: {},
  methods: {
  }
});
