function createFormClickable (execlib, applib, mixins) {
  'use strict';

  var lib = execlib.lib,
    ClickableElement = applib.getElementType('ClickableElement'),
    FieldBaseMixin = mixins.FieldBase;

  function FormClickableElement (id, options) {
    options.fieldname = null;
    ClickableElement.call(this, id, options);
    FieldBaseMixin.call(this, options);
  }
  lib.inherit(FormClickableElement, ClickableElement);
  FieldBaseMixin.addMethods(FormClickableElement);
  FormClickableElement.prototype.__cleanUp = function () {
    FieldBaseMixin.prototype.destroy.call(this);
    ClickableElement.prototype.__cleanUp.call(this);
  };
  FormClickableElement.prototype.get_data = function () {
    return null;
  };
  FormClickableElement.prototype.isValueValid = function () { return true; }
  FormClickableElement.prototype.resetData = lib.dummyFunc;


  applib.registerElementType('FormClickableElement', FormClickableElement);
}
module.exports = createFormClickable;
