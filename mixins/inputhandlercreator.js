function createInputHandlerMixin (lib) {
  'use strict';

  function InputHandlerMixin (options) {
    this.value = options.value;
    this.valueChanged = this.createBufferableHookCollection();
    this.onInputElementKeyUper = this.onInputElementKeyUp.bind(this);
    this.onInputElementChanger = this.onInputElementChange.bind(this);
  }
  InputHandlerMixin.prototype.destroy = function () {
    var ie = this.findTheInputElement();
    if (ie && this.onInputElementChanger && this.onInputElementKeyUper) {
      ie.off('change', this.onInputElementChanger);
      ie.off('keyup', this.onInputElementKeyUper);
    }
    this.onInputElementChanger = null;
    this.onInputElementKeyUper = null;
    if (this.valueChanged) {
      this.valueChanged.destroy();
    }
    this.valueChanged = null;
    this.value = null;
  };
  InputHandlerMixin.prototype.startListeningToInputElement = function () {
    var ie = this.findTheInputElement();
    if (!ie) {
      return;
    }
    ie.on('change', this.onInputElementChanger);
    ie.on('keyup', this.onInputElementKeyUper);
    this.setTheInputElementValue(this.value);
  };
  InputHandlerMixin.prototype.onInputElementKeyUp = function () {
  };
  InputHandlerMixin.prototype.onInputElementChange = function () {
    this.set('value', this.getTheInputElementValue());
  };
  InputHandlerMixin.prototype.setTheInputElementValue = function (val) {
    var ie = this.findTheInputElement();
    if (!ie) {
      return;
    }
    if (ie.is(':checkbox')) {
      ie.prop('checked', val);
      return;
    }
    ie.val(val);
  };
  InputHandlerMixin.prototype.getTheInputElementValue = function () {
    var ie = this.findTheInputElement();
    if (!ie) {
      return null;
    }
    if (ie.is(':checkbox')) {
      return ie.prop('checked');
    }
    return ie.val();
  };
  InputHandlerMixin.prototype.set_value = function (val) {
    if (this.value === val) {
      return false;
    }
    this.value = val;
    this.setTheInputElementValue(val);
    this.valueChanged.fire(val);
    return true;
  };
  InputHandlerMixin.prototype.get_value = function () {
    return this.value;
  };

  InputHandlerMixin.prototype.findTheInputElement = function () {
    var inputfinder;
    if (!this.$element) {
      console.warn('Cannot find my input element because I have no this.$element');
      return null;
    }
    inputfinder = this.getConfigVal('input_finder');
    return inputfinder ? this.$element.find(inputfinder) : this.$element;
  };

  InputHandlerMixin.addMethods = function (klass) {
    lib.inheritMethods(klass, InputHandlerMixin
      ,'startListeningToInputElement'
      ,'onInputElementKeyUp'
      ,'onInputElementChange'
      ,'findTheInputElement'
      ,'setTheInputElementValue'
      ,'getTheInputElementValue'
      ,'set_value'
      ,'get_value'
    );
    klass.prototype.postInitializationMethodNames = 
      klass.prototype.postInitializationMethodNames.concat(['startListeningToInputElement']);
  };

  return InputHandlerMixin;
}
module.exports = createInputHandlerMixin;
