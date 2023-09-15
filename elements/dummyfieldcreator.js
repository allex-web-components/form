function dummyFieldElementCreator (execlib, applib) {
  'use strict';

  var lib = execlib.lib;
  var BasicElement = applib.getElementType('BasicElement');
  
  function DummyFieldElement (id, options) {
    BasicElement.call(this, id, options);
  }
  lib.inherit(DummyFieldElement, BasicElement);
  DummyFieldElement.prototype.__cleanUp = function () {
    BasicElement.prototype.__cleanUp.call(this);
  };
  DummyFieldElement.prototype.set_data = function () {
    return true;
  };
  DummyFieldElement.prototype.resetData = lib.dummyFunc;
  
  applib.registerElementType('DummyFieldElement', DummyFieldElement);
}
module.exports = dummyFieldElementCreator;