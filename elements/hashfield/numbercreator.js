function createNumberHashFieldElement (execlib, applib, mixins) {
  'use strict';
  var lib = execlib.lib;

  var PlainHashFieldElement = applib.getElementType('PlainHashFieldElement');
  
  function NumberHashFieldElement (id, options) {
    PlainHashFieldElement.call(this, id, options);
    this.autoNumeric = null;
  }
  lib.inherit(NumberHashFieldElement, PlainHashFieldElement);
  NumberHashFieldElement.prototype.__cleanUp = function () {
    if (this.autoNumeric) {
      this.autoNumeric.remove();
      this.autoNumeric.detach();
    }
    this.autoNumeric = null;
    PlainHashFieldElement.prototype.__cleanUp.call(this);
  };

  NumberHashFieldElement.prototype.startNumberHashFieldElement = function () {
    this.$element.attr('type', 'text');
    this.autoNumeric = new AutoNumeric(this.$element[0], this.getConfigVal('autonumeric')||{});
  };

  NumberHashFieldElement.prototype.get_value = function () {
    if (this.value==null) {
      return null;
    }
    return this.autoNumeric ? this.autoNumeric.getNumber() : null;
  };
  
  NumberHashFieldElement.prototype.postInitializationMethodNames = PlainHashFieldElement.prototype.postInitializationMethodNames.concat(['startNumberHashFieldElement']);

  applib.registerElementType('NumberHashFieldElement', NumberHashFieldElement);

}
module.exports = createNumberHashFieldElement;