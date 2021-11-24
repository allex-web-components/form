function createNumericSpinner (lib) {
  'use strict';

  function NumericSpinnerMixin (options) {
    this.quantitynav = null;
  }
  NumericSpinnerMixin.prototype.destroy = function () {
    if (this.quantitynav) {
      this.quantitynav.remove();
    }
    this.quantitynav = null;
  };
  NumericSpinnerMixin.prototype.initializeNumericSpinner = function () {
    var input;
    if (!this.$element) {
      return;
    }
    if (this.$element.is('input')) {
      console.warn(this.constructor.name, this.id, 'must be a DOM element that contains the numeric input');
      return;
      //input = this.$element;
    } else {
      input = this.$element.find('input');
      if (!(input && input.length>0)) {
        console.warn('No input found on', this.$element);
        return;
      }
      if (input.length>1) {
        console.warn('More than one input found on', this.$element);
        return;
      }
    }
    this.quantitynav = jQuery('<div class="quantity-nav"><div class="quantity-button quantity-up">+</div><div class="quantity-button quantity-down">-</div></div>');
    this.quantitynav.find('.quantity-up').click(this.onSpinnerButtonClicked.bind(this, 1));
    this.quantitynav.find('.quantity-down').click(this.onSpinnerButtonClicked.bind(this, -1));
    this.quantitynav.insertAfter(input);
  };
  NumericSpinnerMixin.prototype.onSpinnerButtonClicked = function (inc) {
    var input, step, oldval, newval;
    if (!this.$element) {
      return;
    }
    input = this.$element.find('input');
    oldval = parseInt(input.val()) || 0;
    step = this.numericSpinnerValueOf(input, 'step', 1);
    newval = oldval + inc*step;
    if (!this.isNumericValueValid(newval, input)) {
      if (!this.isNumericValueValid(oldval, input)) {
        newval = this.numericSpinnerValueOf(input, 'min', 0);
        if (!this.isNumericValueValid(newval, input)) {
          return;
        }
      } else {
        return;
      }
    }
    input.val(newval);
    input.trigger('change');
  };
  NumericSpinnerMixin.prototype.isNumericValueValid = function (val, input) {
    var step, min, max;
    if (!lib.isNumber(val)) {
      return false;
    }
    input = input || this.$element.find('input');
    if (!(input && input.length)) {
      return false;
    }
    step = this.numericSpinnerValueOf(input, 'step', 1);
    max = this.numericSpinnerValueOf(input, 'max', 0);
    min = this.numericSpinnerValueOf(input, 'min', 0);
    if (val>max) {
      return false;
    }
    if (val<min) {
      return false;
    }
    if ((val-min)%step !== 0) {
      return false;
    }
    return true;
  };
  NumericSpinnerMixin.prototype.numericSpinnerValueOf = function (input, name, dflt) {
    var ret = parseInt(this.getConfigVal(name) || input.attr(name));
    if (lib.isNumber(ret)) {
      return ret;
    }
    return dflt;
  };

  NumericSpinnerMixin.addMethods = function (klass) {
    lib.inheritMethods(klass, NumericSpinnerMixin
      ,'initializeNumericSpinner'
      ,'onSpinnerButtonClicked'
      ,'numericSpinnerValueOf'
      ,'isNumericValueValid'
    );
    klass.prototype.preInitializationMethodNames = 
      klass.prototype.preInitializationMethodNames.concat(['initializeNumericSpinner']);
  };

  return NumericSpinnerMixin;
}
module.exports = createNumericSpinner;
