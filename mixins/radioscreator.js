function createRadiosMixin (lib) {
  'use strict';

  function RadiosMixin (options) {
    if (!options) {
      throw new Error ('RadiosMixin needs the options hash in its ctor');
    }
    if (!options.hashfield) {
      throw new Error ('RadiosMixin needs the "hashfield" name in its ctor options');
    }
    if (!lib.isArray(options.values)) {
      throw new Error ('RadiosMixin needs the "values" array of finder Strings in its ctor options');
    }
    this.radiochangeder = radioChanged.bind(this);
  }
  RadiosMixin.prototype.destroy = function () {
    if (this.radiochangeder) {
      if (this.$element) {
        this.$element.find(':radio').off('click', this.radiochangeder);
      }
    }
    this.radiochangeder = null;
  };
  RadiosMixin.prototype.hashToText = function (data) {
    if (lib.isFunction(this.setDataReceived)) {
      this.setDataReceived();
    }
    this.set('value', lib.isVal(data) ? data[this.getConfigVal('hashfield')] : null);
    return null;
  };
  RadiosMixin.prototype.setTheInputElementValue = function (val) {
    setValueToRadios.call(this, val);
    this.changed.fire('valid', lib.isNumber(val) && val>0);
  };
  RadiosMixin.prototype.getTheInputElementValue = function () {
    return this.value;
  };
  /*
  RadiosMixin.prototype.set_value = function (val) {
    setValueToRadios.call(this, val);
    this.changed.fire('valid', lib.isNumber(val) && val>0);
    return true;
  };
  */
  RadiosMixin.prototype.get_valid = function () {
    var checked;
    if (!this.$element) {
      return false;
    }
    checked = this.$element.find('input:checked');
    return checked&&checked.length===1;
  };

  RadiosMixin.prototype.radiosMaybeStartListening = function () {
    setValueToRadios.call(this, null);
    if (this.$element) {
      this.$element.find(':radio').prop('checked', false);
    }
    if (!this.getConfigVal('interactive')) {
      this.$element.find(':radio').prop('disabled', true);
      return;
    }
    this.$element.find(':radio').on('click', this.radiochangeder);
  };

  RadiosMixin.addMethods = function (klass) {
    lib.inheritMethods(klass, RadiosMixin
      ,'hashToText'
      ,'get_value'
      //,'set_value'
      ,'setTheInputElementValue'
      ,'getTheInputElementValue'
      ,'get_valid'
      ,'radiosMaybeStartListening'
    );
    klass.prototype.postInitializationMethodNames = 
      klass.prototype.postInitializationMethodNames.concat(['radiosMaybeStartListening']);
  };

  //static method - "this" matters
  function setValueToRadios (val) {
    var values = this.getConfigVal('values');
    if (lib.isArray(values)) {
      values.reduce(radiosCheckboxSetter.bind(this, val), 1);
      val = null;
    }
  }

  //static method - "this" matters
  function radiosCheckboxSetter (val, res, finder) {
    var subelement = this.$element.find(finder);
    if (!(subelement && subelement.length===1)) {
      return;
    }
    subelement.attr('name', this.getConfigVal('hashfield'));
    subelement.val(res);
    subelement.prop('checked', res===val);
    res ++;
    return res;
  };

  //static method - "this" matters
  function getValueFromRadios () {
    var checked, ret;
    if (!this.$element) {
      return null;
    }
    checked = this.$element.find('input:checked');
    if (!(checked && checked.length===1)) {
      return null;
    }
    ret = parseInt(checked.val());
    if (lib.isNumber(ret)) {
      return ret;
    }
    return null;
  }

  //static method - "this" matters
  function radioChanged () {
    this.set('value', getValueFromRadios.call(this));
  }
  
  return RadiosMixin;
}
module.exports = createRadiosMixin;
