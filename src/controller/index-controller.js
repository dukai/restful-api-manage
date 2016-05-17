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
  },

  getCurrent: function(){
    if(!pref.recent || pref.recent.length == 0){
      return {};
    }else{
      var project = JSON.parse(pref.recent[0]);
      project.menu = project.path + require('path').sep + 'menu.json';
      return project;
    }
  },
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

//new Vue({
//  el: '.btn-group',
//  data: {
//    showModal: false
//  },
//  methods: {
//    setDir: function(){
//      var path = dialog.showOpenDialog({ properties: [ 'openDirectory' ]});
//      if(path === undefined){
//        return;
//      }
//      var configfile = path + require('path').sep + 'config.json';
//      var data = {
//        name: 'om api',
//        author: 'dukai'
//      };
//      require('fs').writeFileSync(configfile, JSON.stringify(data, null, 4));
//
//      projectInfo.projectPath = path;
//    }
//  }
//});

require('./tree');


//prject context menu

var project = new Vue({
  el: '.dropdown.project',
  data: {
    showCreateProject: false,
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
      tree.treeData = conf.read(data.path + require('path').sep + 'menu.json');
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

//tree menu
var tree = new Vue({
  el: '#demo',
  data: {
    treeData: conf.read(util.getCurrent().menu)
  },
  events: {
    addChild: function(item){
      popboxes.create(item);
    },
    addSuccess: function(){
      conf.save(this.treeData, util.getCurrent().menu)
    }
  }
})
var popboxes = new Vue({
  el: '.popboxes',
  data: {
    showCreatNewAPI: false,

    name: ''
  },
  methods: {
    create: function(item){
      this.currentItem = item;
      this.showCreatNewAPI = true;
    },

    saveAPI: function(){
      this.currentItem.addChild(this.name);
      this.currentItem = null;
      this.showCreatNewAPI = false;
      this.name = '';
    }
  }
});
