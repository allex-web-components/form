function createPlainHashFieldElement (execlib, applib, mixins) {
  'use strict';

  var lib = execlib.lib,
    WebElement = applib.getElementType('WebElement'),
    FieldBaseMixin = mixins.FieldBase,
    TextFromHashMixin = mixins.TextFromHash,
    DataHolderMixin = mixins.DataHolder,
    InputHandlerMixin = mixins.InputHandler;

  function PlainHashFieldElement (id, options) {
    WebElement.call(this, id, options);
    FieldBaseMixin.call(this, options);
    TextFromHashMixin.call(this, options);
    DataHolderMixin.call(this, options);
    InputHandlerMixin.call(this, options);
    this.setValidity();
  }
  lib.inherit(PlainHashFieldElement, WebElement);
  FieldBaseMixin.addMethods(PlainHashFieldElement);
  TextFromHashMixin.addMethods(PlainHashFieldElement);
  DataHolderMixin.addMethods(PlainHashFieldElement);
  InputHandlerMixin.addMethods(PlainHashFieldElement);
  PlainHashFieldElement.prototype.__cleanUp = function () {
    InputHandlerMixin.prototype.destroy.call(this);
    DataHolderMixin.prototype.destroy.call(this);
    TextFromHashMixin.prototype.destroy.call(this);
    FieldBaseMixin.prototype.destroy.call(this);
    WebElement.prototype.__cleanUp.call(this);
  };
  PlainHashFieldElement.prototype.onInputElementKeyUp = PlainHashFieldElement.prototype.onInputElementChange;
  PlainHashFieldElement.prototype.set_value = function (val) {
    var ret = InputHandlerMixin.prototype.set_value.call(this, val);
    this.setDataReceived(); //this was added late, might cause problems later
    //console.log(this.id, 'setting valid', lib.isVal(val) && !!val, 'because', val);
    this.setValidity(val);
    return ret;
  };
  PlainHashFieldElement.prototype.isValueValid = function (val) {
    if (!this.get('required')) {
      return true;
    }
    return lib.isVal(val) && !!val;
  };

  applib.registerElementType('PlainHashFieldElement', PlainHashFieldElement);
}
module.exports = createPlainHashFieldElement;
