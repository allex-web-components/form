function createFormCollectionMixin (lib, mylib) {
  'use strict';

  function FormCollectionMixin (options) {
    this.formCollectionValue = null;
    this.formCollectionData = null;
    this.valid = false;
  }
  FormCollectionMixin.prototype.destroy = function () {
    this.valid = null;
    this.formCollectionData = null;
    this.formCollectionValue = null;
  };
  FormCollectionMixin.prototype.set_value = function (val) {
    if (this.formCollectionValue == val) {
      return false;
    }
    this.formCollectionValue = val;
    return true;
  };
  FormCollectionMixin.prototype.get_value = function () {
    return this.formCollectionValue;
  };
  FormCollectionMixin.prototype.set_data = function (data) {
    if (this.formCollectionData == data) {
      return false;
    }
    this.formCollectionData = data;
    (this.getConfigVal('forms')||[]).forEach(set_dataer.bind(this, data));
    data = null;
    return true;
  };
  FormCollectionMixin.prototype.get_data = function () {
    return this.formCollectionData;
  };
  FormCollectionMixin.prototype.onAnySubFormValueChanged = function () {
    this.set('value', lib.extend.apply(lib, [{}, this.value].concat(Array.prototype.slice.call(arguments))));
    //console.log(this.id, 'onAnySubFormValueChanged', arguments, '=>', this.get_data('value'));
  };
  FormCollectionMixin.prototype.onAnySubFormValidChanged = function () {
    var myargs = Array.prototype.slice.call(arguments);
    this.set('valid', myargs.every(booler));
    //console.log(this.id, 'onAnySubFormValueChanged', arguments, '=>', this.get_data('value'));
  };

  FormCollectionMixin.addMethods = function (klass) {
    lib.inheritMethods(klass, FormCollectionMixin
      , 'set_value'
      , 'get_value'
      , 'set_data'
      , 'get_data'
      , 'onAnySubFormValueChanged'
      , 'onAnySubFormValidChanged'
    );
  };

  //have to be called explicitly
  FormCollectionMixin.prototype.staticEnvironmentDescriptor = function (myname) {
    var ret = {
      logic: [{
        triggers: (this.getConfigVal('forms')||[]).map(formvaluetriggerer.bind(null, myname)).join(','),
        handler: this.onAnySubFormValueChanged.bind(this)
      },{
        triggers: (this.getConfigVal('forms')||[]).map(formvalidtriggerer.bind(null, myname)).join(','),
        handler: this.onAnySubFormValidChanged.bind(this)
      }]
    };
    myname = null;
    return ret;
  }
  //endof have to be called explicitly

  //statics
  function set_dataer (data, formname) {
    try {
      //console.log(this.id, 'setting', data, 'to', formname);
      this.getElement(formname).set('data', data);
    }
    catch (e) {
      console.error(e);
    }
  }
  //endof statics

  //helpers
  function formvaluetriggerer (myname, formname) {
    return 'element.'+myname+'.'+formname+':value';
  }
  function formvalidtriggerer (myname, formname) {
    return 'element.'+myname+'.'+formname+':valid';
  }
  function booler (thingy) {
    return !!thingy;
  }
  //endof helpers

  mylib.FormCollection = FormCollectionMixin;
}
module.exports = createFormCollectionMixin;