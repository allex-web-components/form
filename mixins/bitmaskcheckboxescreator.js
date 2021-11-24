function createBitMaskCheckboxesMixin (lib) {
  'use strict';

  function BitMaskCheckboxesMixin (options) {
    if (!options) {
      throw new Error ('BitMaskCheckboxesMixin needs the options hash in its ctor');
    }
    if (!options.hashfield) {
      throw new Error ('BitMaskCheckboxesMixin needs the "hashfield" name in its ctor options');
    }
    if (!lib.isArray(options.values)) {
      throw new Error ('BitMaskCheckboxesMixin needs the "values" array of finder Strings in its ctor options');
    }
    this.bitmaskcheckboxesvalue = null;
    this.checkboxchangeder = checkBoxChanged.bind(this);
  }
  BitMaskCheckboxesMixin.prototype.destroy = function () {
    if (this.checkboxchangeder) {
      if (this.$element) {
        this.$element.find(':checkbox').off('changed', this.checkboxchangeder);
      }
    }
    this.checkboxchangeder = null;
    this.bitmaskcheckboxesvalue = null;
  };
  BitMaskCheckboxesMixin.prototype.hashToText = function (data) {
    if (!this.$element) {
      return null;
    }
    if (lib.isFunction(this.setDataReceived)) {
      this.setDataReceived();
    }
    this.set('value', lib.isVal(data) ? data[this.getConfigVal('hashfield')] : null);
    return null;
  };
  BitMaskCheckboxesMixin.prototype.set_value = function (val) {
    setValueToCheckboxes.call(this, val);
    this.bitmaskcheckboxesvalue = val;
    return true;
  };
  BitMaskCheckboxesMixin.prototype.get_value = function () {
    return this.bitmaskcheckboxesvalue; //getValueFromChecboxes.call(this);
  };
  BitMaskCheckboxesMixin.prototype.get_valid = function () {
    return lib.isNumber(this.get_value());
  };
  BitMaskCheckboxesMixin.prototype.bitMaskCheckboxesMaybeStartListening = function () {
    if (this.$element) {
      this.$element.find(':checkbox').prop('checked', false);
    }
    if (!this.getConfigVal('interactive')) {
      this.$element.find(':checkbox').prop('disabled', true);
      return;
    }
    this.$element.find(':checkbox').on('click', this.checkboxchangeder);
  };

  BitMaskCheckboxesMixin.addMethods = function (klass) {
    lib.inheritMethods(klass, BitMaskCheckboxesMixin
      ,'hashToText'
      ,'bitMaskCheckboxesMaybeStartListening'
    );
    klass.prototype.postInitializationMethodNames = 
      klass.prototype.postInitializationMethodNames.concat(['bitMaskCheckboxesMaybeStartListening']);
  };

  //static method - "this" matters
  function checkBoxChanged () {
    this.set('value', getValueFromChecboxes.call(this));
  }

  //static method - "this" matters
  function setValueToCheckboxes (val) {
    var values = this.getConfigVal('values');
    if (lib.isArray(values)) {
      values.reduce(bitMaskCheckboxesCheckboxSetter.bind(this, val), 1);
      val = null;
    }
  }
  //static method - "this" matters
  function bitMaskCheckboxesCheckboxSetter (val, res, finder) {
    var subelement = this.$element.find(finder);
    if (!(subelement && subelement.length===1)) {
      return res;
    }
    subelement.attr('name', this.getConfigVal('hashfield'));
    subelement.val(res);
    subelement.prop('checked', res&val); //bitwise AND
    res *= 2;
    return res;
  };

  //static method - "this" matters
  function getValueFromChecboxes () {
    var values, reduceobj;
    if (!this.$element) {
      return null;
    }
    values = this.getConfigVal('values');
    reduceobj = {
      val: 0,
      power: 1
    };
    if (lib.isArray(values)) {
      values.reduce(bitMaskCheckboxesCheckboxGetter.bind(this), reduceobj);
      return reduceobj.val;
    }
    return null;
  }

  //static method - "this" matters
  function bitMaskCheckboxesCheckboxGetter (res, finder) {
    var subelement = this.$element.find(finder);
    if (!(subelement && subelement.length===1)) {
      res.power*=2;
      return res;
    }
    if (subelement.prop('checked')) {
      res.val += res.power;
    }
    res.power*=2;
    return res;
  }

  return BitMaskCheckboxesMixin;
}
module.exports = createBitMaskCheckboxesMixin;
