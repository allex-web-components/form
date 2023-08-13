function createFormElement (execlib, applib, mixins) {
  'use strict';

  var lib = execlib.lib,
    WebElement = applib.getElementType('WebElement'),
    FormMixin = mixins.Form,
    FormCollectionMixin = mixins.FormCollection,
    FormValidatorMixin = mixins.FormValidator;

  var HashDistributorMixin = mixins.HashDistributor,
    HashCollectorMixin = mixins.HashCollector;

  function FormElement (id, options) {
    WebElement.call(this, id, options);
    FormMixin.call(this, options);
    FormCollectionMixin.call(this, options);
    FormValidatorMixin.call(this, options);
  }
  lib.inherit(FormElement, WebElement);
  FormMixin.addMethods(FormElement);
  FormCollectionMixin.addMethods(FormElement);
  FormValidatorMixin.addMethods(FormElement);
  FormElement.prototype.__cleanUp = function () {
    FormValidatorMixin.prototype.destroy.call(this);
    FormCollectionMixin.prototype.destroy.call(this);
    FormMixin.prototype.destroy.call(this);
    WebElement.prototype.__cleanUp.call(this);
  };

  FormElement.prototype.set_data = function (data) {
    var ret = FormMixin.prototype.set_data.call(this, data);
    FormCollectionMixin.prototype.set_data.call(this, data);
    return ret;
  };
  FormElement.prototype.get_data = function () {
    return HashDistributorMixin.prototype.get_data.call(this); //this is what FormMixin would do
  };
  FormElement.prototype.set_value = function (value) {
    var ret = FormMixin.prototype.set_value.call(this, value);
    FormCollectionMixin.prototype.set_value.call(this, value);
    return ret;
  };
  FormElement.prototype.get_value = function () {
    return HashCollectorMixin.prototype.get_value.call(this); //this is what FormMixin would do
  };

  FormElement.prototype.initializeFormForPossibleDataAssignment = function () {
    if (this.getConfigVal('data')) {
      this.set('data', this.getConfigVal('data'));
    }
  };
  FormElement.prototype.postInitializationMethodNames.push('initializeFormForPossibleDataAssignment');

  applib.registerElementType('FormElement', FormElement);
}
module.exports = createFormElement;
