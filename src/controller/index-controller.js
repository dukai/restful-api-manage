require('amd-loader');
var loadtp = require('lib/loadtp');
var conf = require('lib/confrw.js');
const dialog = require('electron').remote.dialog;
const nodeuuid = require('node-uuid');
const sep = require('path').sep;
const util = require('../lib/util');


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
});

var projectInfo = new Vue({
  el: '.project-info',
  data: {
    isload: false,
    projectPath: '',
    projectName: ''
  },
  methods: {
    loadConfig: function(){
      if(typeof util.getCurrent().name){
        this.projectName = util.getCurrent().name;
        this.projectPath = util.getCurrent().path;
        this.isload = true;
      }
    }
  }
});


projectInfo.loadConfig();

require('./tree');


//prject context menu

var project = new Vue({
  el: '.dropdown.project',
  data: {
    showCreateProject: false,
    showOpenProject: false,
    showDeleteProject: false,

    projectName: '',
    projectPath: '',

    checked: false
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

      conf.save({name: data.name, uuid: nodeuuid.v1(), type: 'Root'}, data.path + require('path').sep + 'menu.json');

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
    },
    deleteProject: function(){
      this.checked = false;
      this.projectName = util.getCurrent().name;
      this.projectPath = util.getCurrent().path;
      this.showDeleteProject = true;
    },
    doDeleteProject: function(){
      if(this.checked){
        //delete project physically
        conf.remove(util.getCurrent().project);
        conf.remove(util.getCurrent().menu);
        conf.remove(util.getCurrent().items);
      }
      //delete project bookmark
      var pref = conf.read();
      pref.recent.shift();

      conf.save(pref);
      this.showDeleteProject = false;
      this.openCurrentProject(util.getCurrent());
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

  computed: {
    hasData: function(){
      return 'string' ==  typeof this.treeData.name
    }
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
        if(item.model.uuid == this.currentItem.model.uuid){
          return;
        }
        this.currentItem.selected = false;
      }
      this.currentItem = item;
    },
    removeChild: function(item){
      var self = this;
      if(!!item.model.children && item.model.children.length > 0){
        popboxes.alert('存在子项，无法删除');
        return;
      }
      popboxes.title = "确认删除吗？";
      popboxes.message = "删除后无法恢复，点击确认继续删除！";
      popboxes.confirm(function(){
        if(!item.model.children || item.model.children.length == 0){
          item.$parent.model.children.$remove(item.model);
          conf.save(self.treeData, util.getCurrent().menu);
        }else{
          popboxes.alert('存在子项，无法删除');
        }
      });
    }
  }
})
var popboxes = new Vue({
  el: '.popboxes',
  data: {
    showCreatNewAPI: false,
    showConfirm: false,
    showAlert: false,

    name: '',
    type: 'Page',
    title: '',
    message: ''

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
    },
    confirm: function(callback){
      this.showConfirm = true;
      this.confirmCallback = callback;
    },
    doConfirm: function(){
      this.confirmCallback();
      this.confirmCallback = null;
      this.showConfirm = false;
    },
    alert: function(content){
      this.title = content;
      this.message = content;
      this.showAlert = true;
    }
  }
});

