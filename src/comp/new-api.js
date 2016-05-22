const Vue = require('vue');
const loadtp = require('lib/loadtp');
const util = require('../lib/util');

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
        {name: '', required: true, type: 'String', desc: '', eg: ''}
      ],

      uuid: '',
      editor: null,
      code: 'heelo'
    }
  },

  ready: function(){
    this.editor = ace.edit('editor');
    this.editor.setTheme("ace/theme/twilight");
    this.editor.session.setMode("ace/mode/javascript");
    this.editor.on('change', () => {
      this.code = this.editor.getValue();
    });

    this.editor.on('blur', () => {
      this._editStop();
    });
  },

  computed: {
  },

  route: {
    data: function(transition){
      this.uuid = this.$route.params.uuid;
      var item = util.getItem(this.uuid);

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
    activate: function(transition){
      //this.editor = ace.edit('editor');
      transition.next();
      
    },
    deactivate: function(transition){
      
      transition.next();
    }
  },
  methods: {
    _save: function(){
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
    _addResponseParam: function(){
      this.responseParams.push({name: '', required: true, type: 'String', desc: '', eg: ''});
    },
    _editStop: () => {
      
    }
  }
});
