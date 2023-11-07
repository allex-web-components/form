function createHashDistributorMixin (lib) {
  'use strict';

  function HashDistributorMixin (options) {
    this.hashdata = options.data || {};
  }
  HashDistributorMixin.prototype.destroy = function () {
    this.hashdata = null;
  };
  HashDistributorMixin.prototype.get_data = function () {
    return this.hashdata;
  }
  HashDistributorMixin.prototype.set_data = function (data) {
    if (!this.__children) {
      return;
    }
    this.hashdata = data;
    this.__children.reduce(datasetter, {data: data, nonformelements: this.getConfigVal('nonformelements')||[]});
    return true;
  };

  HashDistributorMixin.addMethods = function (klass) {
    lib.inheritMethods(klass, HashDistributorMixin
      ,'get_data'
      ,'set_data'
    );
  };

  function datasetter (res, chld) {
    if (!chld) {
      return res;
    }
    if (res.nonformelements.indexOf(chld.id)>=0) {
      return res;
    }
    try {
      chld.set('data', res.data);
    } catch(e) {
      //console.warn(this.id, 'could not set data on', chld.constructor.name, chld.id);//, e);
    }
    return res;
  }

  return HashDistributorMixin;
}
module.exports = createHashDistributorMixin;
