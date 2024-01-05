function createFormPaneElement (execlib, applib, mixins) {
  'use strict';

  var lib = execlib.lib;

  var WebElement = applib.getElementType('WebElement'),
  FieldBaseMixin = mixins.FieldBase;
  
  function FormPaneElement (id, options) {
    WebElement.call(this, id, options);
    FieldBaseMixin.call(this, options);
    this.valid = true;
  }
  lib.inherit(FormPaneElement, WebElement);
  FieldBaseMixin.addMethods(FormPaneElement);
  FormPaneElement.prototype.__cleanUp = function () {
    this.valid = null;
    FieldBaseMixin.prototype.destroy.call(this);
    WebElement.prototype.__cleanUp.call(this);
  };
  FormPaneElement.prototype.set_actual = function (act) {
    var ret, refs;
    ret = WebElement.prototype.set_actual.call(this, act);
    if (ret) {
      refs = this.getConfigVal('references');
      if (lib.isArray(refs)) {
        refs.forEach(setActualOnParentsChild.bind(this, act));
        act = null;
      }
    }
  };
  FormPaneElement.prototype.isValueValid = function () { return true; }
  FormPaneElement.prototype.resetData = lib.dummyFunc;

  function setActualOnParentsChild (chldname, actual) {
    try {
      this.__parent.getElement(chldname).set('actual', actual);
    } catch (e) {}
  }

  applib.registerElementType('FormPaneElement', FormPaneElement);
}
module.exports = createFormPaneElement;