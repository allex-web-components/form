function createFormClickable (execlib, applib) {
  'use strict';

  var lib = execlib.lib,
    ClickableElement = applib.getElementType('ClickableElement');

  function FormClickableElement (id, options) {
    options.fieldname = null;
    ClickableElement.call(this, id, options);
  }
  lib.inherit(FormClickableElement, ClickableElement);
  FormClickableElement.prototype.get_data = function () {
    return null;
  };
  FormClickableElement.prototype.set_data = function () {
    return true;
  };
  FormClickableElement.prototype.resetData = lib.dummyFunc;


  applib.registerElementType('FormClickableElement', FormClickableElement);
}
module.exports = createFormClickable;
