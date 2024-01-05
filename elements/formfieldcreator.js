function createFormField (execlib, applib, mixins) {
  'use strict';

  var lib = execlib.lib;
  var FieldBaseMixin = mixins.FieldBase;

  var FormElement = applib.getElementType('FormElement');
  
  function FormFieldElement (id, options) {
    options = options || {};
    //options.default_markup = options.default_markup || createMarkup(options.markup);
    FormElement.call(this, id, options);
    FieldBaseMixin.call(this, options);
  }
  lib.inherit(FormFieldElement, FormElement);
  FieldBaseMixin.addMethods(FormFieldElement);
  FormFieldElement.prototype.__cleanUp = function () {
    FieldBaseMixin.prototype.destroy.call(this);
    FormElement.prototype.__cleanUp.call(this);
  };
  FormFieldElement.prototype.staticEnvironmentDescriptor = function (myname) {
    return lib.extendWithConcat(FormElement.prototype.staticEnvironmentDescriptor.call(this, myname)||{}, {
    });
  };
  FormFieldElement.prototype.actualEnvironmentDescriptor = function (myname) {
    return lib.extendWithConcat(FormElement.prototype.actualEnvironmentDescriptor.call(this, myname)||{}, {
    });
  };
  FormFieldElement.prototype.set_data = function (data) {
    return FormElement.prototype.set_data.call(this, FieldBaseMixin.prototype.set_data.call(this, data));
  };
  FormFieldElement.prototype.isValueValid = function (val) {
    return this.__children.reduce(childvalider, {nonformelements: this.getConfigVal('nonformelements')||[], val: val, res: true}).res;
  };
  function childvalider (res, chld) {
    if (!res.res) {
      return res;
    }
    if (res.nonformelements.indexOf(chld.id)>=0) {
      return res;
    }
    res.res = res.res&&chld.isValueValid(res.val);
    return res;
  }
  
  applib.registerElementType('FormFieldElement', FormFieldElement);
}
module.exports = createFormField;