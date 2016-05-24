const Vue = require('vue');
const loadtp = require('lib/loadtp');
const util = require('../lib/util');
const tools = require('dtools');

module.exports = Vue.extend({
  template: loadtp('new-api'),
  props: {
  },
  data: function(){
    return {
      pageURL: '',
      pageTemplate: '',
      pageTitle: '',
      requestParams: [
        {name: '', required: true, type: 'String', desc: '', eg: ''}
      ],
      responseParams: [
        //{name: '', type: 'String', desc: '', eg: ''}
      ],

      uuid: '',
      editor: null,
      code: '{}'
    }
  },

  ready: function(){
    $('#editor').html(this.code);
    this.editor = ace.edit('editor');
    this.editor.setTheme("ace/theme/twilight");
    this.editor.session.setMode("ace/mode/javascript");
    this.editor.on('change', () => {
      this.code = this.editor.getValue();
    });

    this.editor.on('blur', () => {
      console.log(this);
      this._editStop();
    });
  },

  computed: {
  },

  route: {
    data: function(transition){
      this.uuid = this.$route.params.uuid;
      var item = util.getItem(this.uuid);
      if(!item){
        throw "Item " + this.uuid +  " not found";
        transition.next();
        return;
      }

      if(typeof item.detail != 'undefined'){
        this.pageURL = item.detail.url;
        this.pageTemplate = item.detail.template;
        this.pageTitle = item.name;
      }else{
        this.pageURL = '';
        this.pageTemplate = '';
        this.pageTitle = '';
      }
      transition.next();
    },
    deactivate: function(transition){
      
      transition.next();
    }
  },
  methods: {
    _save: function(){
      console.log(this.responseParams);
      return;
      if(this.pageTitle == ''){
        util.saveItemDetail(this.$route.params.uuid, {
          url: this.pageURL,
          template: this.pageTemplate
        });
      }else{
        var item = util.getItem(this.uuid);
        item.name = this.pageTitle;
        item.detail = {
          url: this.pageURL,
          template: this.pageTemplate
        };
        util.saveItems(item);
        this.$dispatch('editItem', item);
      }

      this.$router.go({path: '/page-detail/' + this.$route.params.uuid});

    },
    _addRequestParam: function(){
      this.requestParams.push({name: '', required: true, type: 'String', desc: '', eg: ''});
    },
    _addResponseParam: function(data){
      console.log(data);
      this.responseParams.push(data);
    },
    _editStop: function(){
      try{
        var data = JSON.parse(this.code);
        let each = (data, namespace = "") => {
          for(let key in data){
            let item = data[key];
            if(!this._checkInResponseParams(namespace + key)){
              this._addResponseParam({
                name: namespace + key, 
                type: typeof item, 
                desc: 'desc', 
                eg: 'eg'
              });
            }
            if(item instanceof Array && item.length > 0){
              item = item[0];
            }
            if(tools.isPlainObject(item)){
              return each(item, namespace + key + ".");
            }
          }
        };

        each(data);
        //this.responseParams.push({name: '', required: true, type: 'String', desc: '', eg: ''})
      }catch(ex){}
    },
    _checkInResponseParams: function(key){
      for(let {name} of this.responseParams){
        if(name == key){
          return true;
        }
      }
      return false;
    }
  }
});
