// demo data
const Vue = require('vue');
const loadtp = require('lib/loadtp');


// define the item component
Vue.component('item', {
  template: loadtp('tree-item'),
  props: {
    model: Object
  },
  data: function () {
    return {
      selected: false
    }
  },
  computed: {
    isFolder: function () {
      return !!this.model.children && !!this.model.children.length
    },
    open: {
        get: function(){
            return !!this.model.open;
            return this.isFolder && !!this.model.open;
        },
        set: function(value){
            Vue.set(this.model, 'open', value);
        }
    }
  },
  methods: {
    _select: function(){
      this.selected = !this.selected;
      this.$dispatch('selected', this);
    },
    toggle: function () {
      if (this.isFolder) {
        this.open = !this.open;
      }
    },
    changeType: function (e) {
      if (!this.isFolder) {
        Vue.set(this.model, 'children', [])
        this._addChild(e)
        this.open = true
      }
    },
    _addChild: function (e) {
      e.preventDefault();
      e.stopPropagation();

      if (!this.isFolder) {
        Vue.set(this.model, 'children', [])
        this.open = true
      }
      if(!this.open){
        this.toggle();
      }
      //this.model.children.push({
      //  name: 'new stuff'
      //})

      this.$dispatch('addChild', this);
    },
    addChild: function(item){
      this.model.children.push({
        name: item.name,
        uuid: item.uuid
      });

      this.$dispatch('addSuccess');
    },
    _removeChild: function(){
      this.$dispatch('removeChild', this);
    }
  },
  events: {
    removeChild: function(item){
      //console.log(this.model);
      //this.model.children.
      if(this.model.uuid == item.model.uuid){
        return true;
      }

      this.model.children.$remove(item.model);


      return true;

      //for(let i = 0, len = this.children.length; i < len; i++){
      //  if(this.children[i].uuid == item.uuid){
      //  }
      //}

    }
  }
});


