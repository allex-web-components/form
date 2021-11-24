function createFormElement (execlib, applib, mixins) {
  'use strict';

  var lib = execlib.lib,
    WebElement = applib.getElementType('WebElement'),
    FormMixin = mixins.Form;

  function FormElement (id, options) {
    WebElement.call(this, id, options);
    FormMixin.call(this, options);
  }
  lib.inherit(FormElement, WebElement);
  FormMixin.addMethods(FormElement);
  FormElement.prototype.__cleanUp = function () {
    FormMixin.prototype.destroy.call(this);
    WebElement.prototype.__cleanUp.call(this);
  };

  applib.registerElementType('FormElement', FormElement);
}
module.exports = createFormElement;
