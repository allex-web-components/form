function createDataHolder (lib) {
  'use strict';

  function DataHolder () {
    this.valid = null;
    this.pristine = true;
    this.dataHolderUnderReset = false;
  }
  DataHolder.prototype.destroy = function () {
    this.dataHolderUnderReset = null;
    this.pristine = null;
    this.valid = null;
  };
  DataHolder.prototype.set_pristine = function (val) {
    throw new Error(this.constructor.name+' implements the DataHolder mixin, and cannot set the "pristine" property directly - but only through resetData');
  };
  DataHolder.prototype.resetData = function () {
    var oldpristine = this.pristine;
    this.pristine = true;
    this.dataHolderUnderReset = true;
    if (this.__children) {
      this.__children.traverse(resetdataer);
    }
    this.set('data', this.nullValue);
    this.set('valid', null);
    try {
      this.set('value', null);
    } catch (e) {
    }
    if (!oldpristine) {
      this.changed.fire('pristine', true);
    }
    this.dataHolderUnderReset = false;
  };
  DataHolder.prototype.setDataReceived = function () {
    if (this.dataHolderUnderReset===false) {
      this.pristine = false;
    }
  };
  DataHolder.prototype.nullValue = null;

  function resetdataer (chld) {
    if (!lib.isFunction(chld.resetData)) {
      console.warn(chld, 'does not have method "resetData"');
      return;
    }
    chld.resetData();
  }

  DataHolder.addMethods = function (klass) {
    lib.inheritMethods(klass, DataHolder
      ,'set_pristine'
      ,'resetData'
      ,'setDataReceived'
      ,'nullValue'
    );
  };

  return DataHolder;
}
module.exports = createDataHolder;
