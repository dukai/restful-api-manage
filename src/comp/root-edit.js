const Vue = require('vue');
const loadtp = require('lib/loadtp');
const util = require('../lib/util');
const tools = require('dtools');
const detector = require('../lib/type-detector');
const conf = require('lib/confrw');

module.exports = Vue.extend({
  template: loadtp('root/edit'),
  props: {
  },
  data: function(){
    return {
      pageURL: '',
      pageTemplate: '',
      pageTitle: '',
      uuid: '',
      typeList: detector.TYPE_LIST,

      target: null
    }
  },

  ready: function(){
  },

  computed: {
  },

  route: {
    data: function(transition){
      this.uuid = this.$route.params.uuid;
      var item = util.getItem(this.uuid);
      if(!item){
        console.error("Item " + this.uuid +  " not found");
        transition.next();
        return;
      }
      var item = util.getItem(this.uuid);
      var project = util.getCurrent();
      var projectInfo = conf.read(project.project);

      this.target = Object.assign(item, project, projectInfo);

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
        errorResponseParams: this.errorResponseParams,
        code: this.code,
        errorCode: this.errorCode
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
  }
});
