var conf = require('lib/confrw');
var pref = conf.read();
const sep = require('path').sep;

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
      project.menu = project.path + sep + 'menu.json';
      project.items = project.path + sep + 'items.json';
      project.project = project.path + sep + '.project.json';
      return project;
    }
  },

  saveItems: function(item){
    var list = conf.read(this.getCurrent().items);
    list[item.uuid] = item;
    conf.save(list, this.getCurrent().items);
  },

  getItem: function(uuid){
    return conf.read(this.getCurrent().items)[uuid];
  },

  saveItemDetail: function(uuid, data){
    var list = conf.read(this.getCurrent().items);
    list[uuid].detail = data;
    conf.save(list, this.getCurrent().items);
  }
};


module.exports = util;
