function createCheckBoxFieldElement (execlib, applib, mixins) {
  'use strict';

  var lib = execlib.lib,
    CheckBoxElement = applib.getElementType('CheckBoxElement'),
    FieldBaseMixin = mixins.FieldBase,
    DataHolderMixin = mixins.DataHolder;

 
  function CheckBoxFieldElement (id, options) {
    options = options || {};
    CheckBoxElement.call(this, id, options);
    FieldBaseMixin.call(this, options);
    DataHolderMixin.call(this, options);
    this.setValidity();
  }
  lib.inherit(CheckBoxFieldElement, CheckBoxElement);
  FieldBaseMixin.addMethods(CheckBoxFieldElement);
  DataHolderMixin.addMethods(CheckBoxFieldElement);
  CheckBoxFieldElement.prototype.__cleanUp = function () {
    DataHolderMixin.prototype.destroy.call(this);
    FieldBaseMixin.prototype.destroy.call(this);
    CheckBoxElement.prototype.__cleanUp.call(this);
  };
  CheckBoxFieldElement.prototype.set_checked = function (chk) {
    var ret = CheckBoxElement.prototype.set_checked.call(this, chk);
    if (ret) {
      this.set('value', !!chk);
    }
    return ret;
  };
  function valueFromChecked (chk) {
    if (chk == 'true') return true;
    if (chk == 'false') return false
  }
  CheckBoxFieldElement.prototype.get_data = function () {
    return this.get('checked');
  };
  CheckBoxFieldElement.prototype.set_data = function (data) {
    var myvalue = FieldBaseMixin.prototype.set_data.call(this, data);
    this.set('checked', !!myvalue);
    return true;
  };
  CheckBoxFieldElement.prototype.get_value = function () {
    return this.get('checked');
  };
  CheckBoxFieldElement.prototype.isValueValid = function (val) {
    return lib.isBoolean(val);
  };
  
  applib.registerElementType('CheckBoxFieldElement', CheckBoxFieldElement);
}
module.exports = createCheckBoxFieldElement;