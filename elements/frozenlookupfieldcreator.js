function createFrozenLookupField (execlib, applib, mixins) {
  'use strict';

  var lib = execlib.lib;
  var PlainHashFieldElement = applib.getElementType('PlainHashFieldElement');
  
  function FrozenLookupFieldElement (id, options) {
    PlainHashFieldElement.call(this, id, options);
  }
  lib.inherit(FrozenLookupFieldElement, PlainHashFieldElement);
  FrozenLookupFieldElement.prototype.__cleanUp = function () {
    PlainHashFieldElement.prototype.__cleanUp.call(this);
  };
  FrozenLookupFieldElement.prototype.set_data = function (data) {
    var ret = PlainHashFieldElement.prototype.set_data.call(this, data),
      val;
    if (!ret) {
      return ret;
    }
    val = this.readValueFromData(data);
    this.set('value', val);
    this.set('valid', this.isValueValid(val));
    return ret;
  };
  FrozenLookupFieldElement.prototype.readValueFromData = function (data) {
    var valfieldname, val;
    valfieldname = this.getConfigVal('hashvaluefield');
    if (data && valfieldname) {
      val = lib.readPropertyFromDotDelimitedString(data, valfieldname);
      if (lib.isVal(ret)) {
        return this.getConfigVal('default_value');
      }
      return ret;
    }
  };
  
  applib.registerElementType('FrozenLookupFieldElement', FrozenLookupFieldElement);
}
module.exports = createFrozenLookupField;