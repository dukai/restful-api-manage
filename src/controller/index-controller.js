require('amd-loader');
var loadtp = require('lib/loadtp');
var conf = require('lib/confrw.js');
const dialog = require('electron').remote.dialog;
const nodeuuid = require('node-uuid');

var pref = conf.read();

var util = {
  items: {},
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
      project.items = project.path + require('path').sep + 'items.json';
      return project;
    }
  },

  saveItems: function(item){
    this.items[item.uuid] = item;
    conf.save(this.items, this.getCurrent().items);
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
    isload: false,
    projectPath: '',
    projectName: ''
  }
});

if(typeof util.getCurrent().name){
  projectInfo.projectName = util.getCurrent().name;
  projectInfo.projectPath = util.getCurrent().path;
  projectInfo.isload = true;
}

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

      projectInfo.projectName = this.projectName;
      projectInfo.projectPath = this.projectPath;
      //保存配置文件
      conf.save(data, configfile);
      util.addRecent(data);
      this.showCreateProject = false;

      conf.save({name: data.name, uuid: nodeuuid.v1()}, data.path + require('path').sep + 'menu.json');

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
  el: '#menu',
  data: {
    treeData: conf.read(util.getCurrent().menu),
    currentItem: null
  },
  events: {
    addChild: function(item){
      popboxes.create(item);
    },
    addSuccess: function(){
      conf.save(this.treeData, util.getCurrent().menu)
    },
    selected: function(item){
      if(this.currentItem){
        if(item.uuid == this.currentItem.uuid){
          return;
        }
        this.currentItem.selected = false;
      }
      this.currentItem = item;
    },
    removeChild: function(item){
      conf.save(this.treeData, util.getCurrent().menu);
    }
  }
})
var popboxes = new Vue({
  el: '.popboxes',
  data: {
    showCreatNewAPI: false,

    name: '',
    type: ''
  },
  methods: {
    create: function(item){
      this.currentItem = item;
      this.showCreatNewAPI = true;
    },

    saveAPI: function(){
      var uuid = nodeuuid.v1();
      this.currentItem.addChild({name: this.name, uuid: uuid});
      this.currentItem = null;
      this.showCreatNewAPI = false;
      util.saveItems({
        name: this.name,
        uuid: uuid,
        type: this.type
      });
      this.name = '';
      this.type = '';
    }
  }
});
