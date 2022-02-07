function createPlainHashFieldElement (execlib, applib, mixins) {
  'use strict';

  var lib = execlib.lib,
    WebElement = applib.getElementType('WebElement'),
    TextFromHashMixin = mixins.TextFromHash,
    DataHolderMixin = mixins.DataHolder,
    InputHandlerMixin = mixins.InputHandler;

  function PlainHashFieldElement (id, options) {
    WebElement.call(this, id, options);
    TextFromHashMixin.call(this, options);
    DataHolderMixin.call(this, options);
    InputHandlerMixin.call(this, options);
    this.set('valid', this.isValueValid());
  }
  lib.inherit(PlainHashFieldElement, WebElement);
  TextFromHashMixin.addMethods(PlainHashFieldElement);
  DataHolderMixin.addMethods(PlainHashFieldElement);
  InputHandlerMixin.addMethods(PlainHashFieldElement);
  PlainHashFieldElement.prototype.__cleanUp = function () {
    InputHandlerMixin.prototype.destroy.call(this);
    DataHolderMixin.prototype.destroy.call(this);
    TextFromHashMixin.prototype.destroy.call(this);
    WebElement.prototype.__cleanUp.call(this);
  };
  PlainHashFieldElement.prototype.onInputElementKeyUp = PlainHashFieldElement.prototype.onInputElementChange;
  PlainHashFieldElement.prototype.hashToText = function (data) {
    var fieldname = this.getConfigVal('hashfield'), val;
    this.setDataReceived();
    if (data && fieldname) {
      val = lib.readPropertyFromDotDelimitedString(data, fieldname);
      this.set('valid', this.isValueValid(val));
      return val;
    }
    return null;
  };
  PlainHashFieldElement.prototype.set_value = function (val) {
    var ret = InputHandlerMixin.prototype.set_value.call(this, val);
    this.setDataReceived(); //this was added late, might cause problems later
    //console.log(this.id, 'setting valid', lib.isVal(val) && !!val, 'because', val);
    this.set('valid', lib.isVal(val) && !!val);
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
