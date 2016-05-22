var Vue = require('vue');
var loadtp = require('lib/loadtp');
var Welcome = Vue.extend({
  template: loadtp('welcome')
});


module.exports = Welcome;
