function createFieldBaseMixin (lib, mylib) {
  'use strict';

  function FieldBaseMixin (options) {
    if (!lib.isFunction(this.isValueValid)) {
      throw new lib.Error('ISVALUEVALID_NOT_IMPLEMENTED', this.constructor.name+' must implement isValueValid');
    }
    this.required = options.required;
    this.baseActualListener = this.attachListener('changed', 'actual', onActualChanged.bind(this));
    this.baseValidListener = this.attachListener('changed', 'valid', onValidChanged.bind(this));
  }
  FieldBaseMixin.prototype.destroy = function () {
    if(this.baseValidListener) {
       this.baseValidListener.destroy();
    }
    this.baseValidListener = null;
    if(this.baseActualListener) {
       this.baseActualListener.destroy();
    }
    this.baseActualListener = null;
    this.required = null;
  };

  FieldBaseMixin.prototype.set_data = function (data) {
    var val;
    this.doPropertyFromHash(data, 'actual');
    val = this.doPropertyFromHash(data, 'value');
    this.doPropertyFromHash(data, 'enabled');
    return val;
  };

  FieldBaseMixin.prototype.setValidity = function (val) {
    var myvalid;
    try {
      myvalid = evaluateValidity.call(this, val);
    } catch (e) {
      myvalid = false;
    }
    this.set('valid', myvalid);
  };

  function hashFieldPropertyName (myproperty) {
    if (myproperty == 'value') {
      return 'hashfield';
    }
    return 'hash'+myproperty+'field';
  }

  FieldBaseMixin.prototype.doPropertyFromHash = function (data, myproperty, valprocessor) {
    var myfieldname, val, procval;
    myfieldname = this.getConfigVal(hashFieldPropertyName(myproperty));
    if (!myfieldname) {
      return;
    }
    val = lib.readPropertyFromDotDelimitedString(data, myfieldname);
    if (lib.isFunction(valprocessor)) {
      val = valprocessor(val);
    }
    if (myproperty == 'value') {
      this.setValidity(val);
    } else {
      this.set(myproperty, val);
    }
    return val;
  };

  FieldBaseMixin.addMethods = function (klass) {
    lib.inheritMethods(klass, FieldBaseMixin
      , 'set_data'
      , 'setValidity'
      , 'doPropertyFromHash'
    );
  };

  //statics
  function onActualChanged (actual) {
    var val = this.get('value');
    this.set('value', null);
    this.set('value', val);
  }
  function onValidChanged (valid) {
    if (this.$element && this.$element.length>0) {
      this.$element[(!valid && this.getConfigVal('required'))? 'addClass' : 'removeClass']('invalid');
    }
  }
  function evaluateValidity (val) {
    var vlderr;
    if (!this.isValueValid(val)) {
      return false;
    }
    if (this.__parent && lib.isFunction(this.__parent.validateFieldNameWithValue)) {
      vlderr = this.__parent.validateFieldNameWithValue(this.getConfigVal('fieldname'), val, this.get('actual'));
      if (vlderr) {
        this.set('tooltip', vlderr);
      }
      return !vlderr;
    }
    return true;
  };
  //endofstatics

  mylib.FieldBase = FieldBaseMixin;
}
module.exports = createFieldBaseMixin;