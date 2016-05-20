var Vue = require('vue');
var loadtp = require('lib/loadtp');

Vue.component('modal', {
  template: loadtp('modal'),
  props: {
    show: {
      type: Boolean,
      required: true,
      twoWay: true    
    }
  }
});
