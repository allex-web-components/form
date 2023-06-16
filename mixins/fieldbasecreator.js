function createFieldBaseMixin (lib, mylib) {
  'use strict';

  function FieldBaseMixin () {
    if (!lib.isFunction(this.isValueValid)) {
      throw new lib.Error('ISVALUEVALID_NOT_IMPLEMENTED', this.constructor.name+' must implement isValueValid');
    }
  }

  FieldBaseMixin.prototype.setValidity = function (val) {
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

  FieldBaseMixin.addMethods = function (klass) {
    lib.inheritMethods(klass, FieldBaseMixin
      , 'setValidity'
    );
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

  mylib.FieldBase = FieldBaseMixin;
}
module.exports = createFieldBaseMixin;