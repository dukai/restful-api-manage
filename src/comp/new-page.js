const Vue = require('vue');
const loadtp = require('lib/loadtp');
const util = require('../lib/util');

module.exports = Vue.extend({
  template: loadtp('new-page'),
  props: {
  },
  data: function(){
    return {
      pageURL: '',
      pageTemplate: '',
      pageTitle: '',

      uuid: '',

      code: '{}',
      editor: null
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
    _editStop(){
      
    }
  }
});
