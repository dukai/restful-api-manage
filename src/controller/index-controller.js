require('amd-loader');
var loadtp = require('lib/loadtp');
var conf = require('lib/confrw.js');

var Vue = require('vue');

Vue.component('modal', {
  template: loadtp('modal'),
  props: {
    show: {
      type: Boolean,
      required: true,
      twoWay: true    
    }
  }
})

var projectInfo = new Vue({
  el: '.project-info',
  data: {
    projectPath: ''
  }
});

new Vue({
  el: '.btn-group',
  data: {
    showModal: false
  },
  methods: {
    setDir: function(){
      const dialog = require('electron').remote.dialog;
      var path = dialog.showOpenDialog({ properties: [ 'openDirectory' ]});
      if(path === undefined){
        return;
      }
      var configfile = path + require('path').sep + 'config.json';
      var data = {
        name: 'om api',
        author: 'dukai'
      };
      require('fs').writeFileSync(configfile, JSON.stringify(data, null, 4));

      projectInfo.projectPath = path;
    }
  }
});

require('./tree');


new Vue({
  el: '.dropdown.project',
  data: {
    showCreateProject: true,
    showOpenProject: false,
  },
  methods: {
    saveProject: function(){
      this.showCreateProject = false;
    }
  }
});


