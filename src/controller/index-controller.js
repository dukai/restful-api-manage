require('amd-loader');
var loadtp = require('lib/loadtp');
var conf = require('lib/confrw.js');
const dialog = require('electron').remote.dialog;

var pref = conf.read();

var util = {
  addRecent: function(project){
    if(!pref.recent){
      pref.recent = [];
    }

    var index = pref.recent.indexOf(JSON.stringify(project));
    if(index >= 0){
      pref.recent.splice(index, 1);
    }

    if(pref.recent.length == 5){
      pref.rencent.length = 4;
    }
    pref.recent.unshift(JSON.stringify(project));
    conf.save(pref);
  }
};

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

    projectName: '',
    projectPath: ''
  },
  methods: {
    saveProject: function(){
      var configfile = this.projectPath + require('path').sep + '.project.json';
      try{
        require('fs').statSync(configfile);
      }catch(ex){
        
      }
      var data = {
        name: this.projectName,
        path: this.projectPath
      };
      //保存配置文件
      conf.save(data, configfile);
      util.addRecent(data);
      this.showCreateProject = false;

      conf.save({name: data.name}, data.path + require('path').sep + 'menu.json');

      this.openCurrentProject(data);
    },

    openCurrentProject: function(data){
      new Vue({
        el: '#demo',
        data: {
          treeData: conf.read(data.path + require('path').sep + 'menu.json')
        }
      })
    },

    selectProjectPath: function(){
      var pp = dialog.showOpenDialog({ properties: [ 'openDirectory' ]});
      if(undefined === pp){
        return;
      }
      this.projectPath = pp;
    }
  }
});


// boot up the demo
//var treedemo = new Vue({
//  el: '#demo',
//  data: {
//    treeData: data
//  }
//})
