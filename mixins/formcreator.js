function createFormMixin (lib, mylib) {
  'use strict';

  var HashDistributorMixin = mylib.HashDistributor,
    HashCollectorMixin = mylib.HashCollector,
    DataHolderMixin = mylib.DataHolder;

  function FormMixin (options) {
    HashDistributorMixin.call(this, options);
    HashCollectorMixin.call(this, options);
    DataHolderMixin.call(this, options);
    this.settingdata = false;
    this.changedinternally = null;
  }
  FormMixin.prototype.destroy = function () {
    this.changedinternally = null;
    this.settingdata = null;
    DataHolderMixin.prototype.destroy.call(this);
    HashDistributorMixin.prototype.destroy.call(this);
    HashCollectorMixin.prototype.destroy.call(this);
  };
  FormMixin.prototype.hookToCollectorValidity = function () {
    var jqundofinder;
    HashCollectorMixin.prototype.hookToCollectorValidity.call(this);
    this.__children.traverse(hookchecker.bind(this));
    jqundofinder = this.getConfigVal('jqueryundofinder');
    if (jqundofinder && this.$element) {
      this.$element.find(jqundofinder).on('click', this.undoChanges.bind(this));
    }
  };
  FormMixin.prototype.set_data = function (data) {
    var ret = true;
    this.settingdata = true;
    this.set('initiallyvalid', null);
    this.set('valid', null);
    if (false === this.dataHolderUnderReset) {
      this.resetData();
    }
    if (lib.isVal(data)) {
      ret = HashDistributorMixin.prototype.set_data.call(this, data);
    }
    this.recheckChildren();
    this.set('changedinternally', false);
    this.settingdata = false;
    return ret;
  };
  FormMixin.prototype.set_value = function (value) {
    var ci, hd, ret = HashCollectorMixin.prototype.set_value.call(this, value);
    if (!this.settingdata && lib.isVal(value)) {
      hd = this.hashdata;
      ci = lib.traverseShallowConditionally(this.collectorvalue, changedpiesewise.bind(null, hd));
      if (ci!==true) {
        ci = false;
      }
      //console.log('changedinternally?', this.hashdata, this.collectorvalue, ci);
      this.set('changedinternally', ci);
      hd = null;
    }
    return ret;
  };

  function changedpiesewise (hash, val, name) {
    if (!lib.isEqual(hash[name], val)) {
      return true;
    }
    //console.log('changedinternally? for', name, hash[name], 'eq', val);
  }

  FormMixin.prototype.undoChanges = function () {
    this.set('data', lib.extend({}, this.hashdata));
  };

  FormMixin.prototype.onChangedInternallyProc = function (chld, ci) {
    var v = this.get('valid');
    chld.set('enabled', v&&ci);
  }

  FormMixin.addMethods = function (klass) {
    HashDistributorMixin.addMethods(klass);
    HashCollectorMixin.addMethods(klass);
    DataHolderMixin.addMethods(klass);
    lib.inheritMethods(klass, FormMixin
      ,'hookToCollectorValidity'
      ,'set_data'
      ,'set_value'
      ,'undoChanges'
      ,'onChangedInternallyProc'
    );
  };


  //statics
  function hookchecker (chld) {
    if (chld && chld.clicked && lib.isFunction(chld.clicked.attach)) {
      //Clickable
      if (chld.getConfigVal('submitbutton')) {
        this.hashCollectorListeners.push(this.attachListener('changed', 'value', this.onChangedInternallyProc.bind(this, chld)));
      }
    }
  }
  //endof statics

  mylib.Form = FormMixin;
};
module.exports = createFormMixin;
