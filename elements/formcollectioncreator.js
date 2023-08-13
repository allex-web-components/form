function createFormCollectionElement (execlib, applib, mixins) {
  'use strict';

  var lib = execlib.lib,
    WebElement = applib.getElementType('WebElement'),
    FormCollectionMixin = mixins.FormCollection,
    FormValidatorMixin = mixins.FormValidator;

  
  function FormCollectionElement (id, options) {
    WebElement.call(this, id, options);
    FormCollectionMixin.call(this, options);
  }
  lib.inherit(FormCollectionElement, WebElement);
  FormCollectionMixin.addMethods(FormCollectionElement);
  FormCollectionElement.prototype.__cleanUp = function () {
    FormCollectionMixin.prototype.destroy.call(this);
    WebElement.prototype.__cleanUp.call(this);
  };
  FormCollectionElement.prototype.staticEnvironmentDescriptor = function (myname) {
    return {
    };
  };

  FormCollectionElement.prototype.actualEnvironmentDescriptor = function (myname) {
    return FormCollectionMixin.prototype.actualEnvironmentDescriptor.call(this, myname);
  };

  applib.registerElementType('FormCollectionElement', FormCollectionElement);
}
module.exports = createFormCollectionElement;