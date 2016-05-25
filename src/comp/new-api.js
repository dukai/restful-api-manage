const Vue = require('vue');
const loadtp = require('lib/loadtp');
const util = require('../lib/util');
const tools = require('dtools');
const detector = require('../lib/type-detector');

module.exports = Vue.extend({
  template: loadtp('new-api'),
  props: {
  },
  data: function(){
    return {
      pageURL: '',
      pageTemplate: '',
      pageTitle: '',
      apiMethod: 'GET',
      requestParams: [
        {name: '', required: true, type: 'String', desc: '', eg: ''}
      ],
      responseParams: [
        //{name: '', type: 'String', desc: '', eg: ''}
      ],
      errorResponseParams: [],

      uuid: '',
      editor: null,
      code: '{}',
      errorCode: '{}',
      typeList: detector.TYPE_LIST
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

    $('#error_editor').html(this.errorCode);
    this.errorEditor = ace.edit('error_editor');
    this.errorEditor.setTheme("ace/theme/twilight");
    this.errorEditor.session.setMode("ace/mode/javascript");
    this.errorEditor.on('change', () => {
      this.errorCode = this.errorEditor.getValue();
    });

    this.errorEditor.on('blur', () => {
      this._editStop('error');
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
      var detail = {
        url: this.pageURL,
        method: this.apiMethod,
        requestParams: this.requestParams,
        successResponseParams: this.responseParams,
        errorResponseParams: this.errorResponseParams
      }
      if(this.pageTitle == ''){
        util.saveItemDetail(this.$route.params.uuid, detail);
      }else{
        var item = util.getItem(this.uuid);
        item.name = this.pageTitle;
        item.detail = detail;
        util.saveItems(item);
        this.$dispatch('editItem', item);
      }

      this.$router.go({path: '/api-detail/' + this.$route.params.uuid});

    },
    _addRequestParam: function(){
      this.requestParams.push({name: '', required: true, type: 'String', desc: '', eg: ''});
    },
    _addResponseParam: function(data, type){
      if(!data){
        data = {name: '', type: 'String', desc: '', eg: ''};
      }
      if(type == 'error'){
        this.errorResponseParams.push(data);
      }else{
        this.responseParams.push(data);
      }
    },
    _addErrorResponseParam: function(data, type){
      this._addResponseParam(data, type);
    },
    _editStop: function(type = 'success'){
      let codeStr = '';
      if(type == 'error'){
        codeStr = this.errorCode;
      }else{
        codeStr = this.code;
      }
      try{
        var data = JSON.parse(codeStr);
        let each = (data, namespace = "") => {
          for(let key in data){
            let item = data[key];
            if(!this._checkInResponseParams(namespace + key, type)){
              this._addResponseParam({
                name: namespace + key, 
                type: detector.detect(item), 
                desc: '', 
                eg: JSON.stringify(item)
              }, type);
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
      }catch(ex){
        console.log(ex);
      }
    },
    _checkInResponseParams: function(key, type = 'success'){

      let params = this.responseParams;

      if(type == 'error'){
        params =  this.errorResponseParams;
      }

      for(let {name} of params){
        if(name == key){
          return true;
        }
      }
      return false;
    }
  }
});
