function createFieldBase (execlib, applib) {
  'use strict';

  var lib = execlib.lib,
    WebElement = applib.getElementType('WebElement');

  function FieldBaseElement (id, options) {
    WebElement.call(this, id, options);
  }
  lib.inherit(FieldBaseElement, WebElement);
  FieldBaseElement.prototype.__cleanUp = function () {
    WebElement.prototype.__cleanUp.call(this);
  };

  FieldBaseElement.prototype.setValidity = function (val) {
    var myvalid;
    try {
      myvalid = evaluateValidity.call(this, val);
    } catch (e) {
      myvalid = false;
    }
    this.set('valid', myvalid);
    if (this.$element && this.$element.length>0) {
      this.$element[myvalid ? 'removeClass' : 'addClass']('invalid');
    }
  };

  //statics
  function evaluateValidity (val) {
    if (!this.isValueValid(val)) {
      return false;
    }
    if (this.__parent && lib.isFunction(this.__parent.validateFieldNameWithValue)) {
      return this.__parent.validateFieldNameWithValue(this.getConfigVal('fieldname'), val);
    }
    return true;
  };
  //endofstatics

  applib.registerElementType('FieldBaseElement', FieldBaseElement);
}
module.exports = createFieldBase;