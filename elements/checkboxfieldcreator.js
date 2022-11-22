function createCheckBoxFieldElement (execlib, applib, mixins) {
  'use strict';

  var lib = execlib.lib,
    CheckBoxElement = applib.getElementType('CheckBoxElement'),
    TextFromHashMixin = mixins.TextFromHash,
    DataHolderMixin = mixins.DataHolder,
    InputHandlerMixin = mixins.InputHandler;

 
  function CheckBoxFieldElement (id, options) {
    options = options || {};
    CheckBoxElement.call(this, id, options);
    DataHolderMixin.call(this, options);
    this.set('valid', this.isValueValid());
  }
  lib.inherit(CheckBoxFieldElement, CheckBoxElement);
  DataHolderMixin.addMethods(CheckBoxFieldElement);
  CheckBoxFieldElement.prototype.__cleanUp = function () {
    DataHolderMixin.prototype.destroy.call(this);
    CheckBoxElement.prototype.__cleanUp.call(this);
  };
  CheckBoxFieldElement.prototype.get_data = function () {
    return this.get('checked');
  };
  CheckBoxFieldElement.prototype.set_data = function (data) {
    var fieldname = this.getConfigVal('hashfield'), val;
    this.setDataReceived();
    if (data && fieldname) {
      val = lib.readPropertyFromDotDelimitedString(data, fieldname);
    }
    this.set('checked', !!val);
    this.set('valid', this.isValueValid(val));
    return true;
  };
  CheckBoxFieldElement.prototype.isValueValid = function (val) {
    return lib.isBoolean(val);
  };
  
  applib.registerElementType('CheckBoxFieldElement', CheckBoxFieldElement);
}
module.exports = createCheckBoxFieldElement;