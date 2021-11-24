function createTextFromHashMixin (lib) {
  'use strict';

  function TextFromHashMixin (options) {
  }
  TextFromHashMixin.prototype.destroy = function () {
  };
  TextFromHashMixin.prototype.get_data = function () {
    return void 0;
  };
  TextFromHashMixin.prototype.set_data = function (data) {
    var t = this.hashToText(data), pref, suff;
    if (null === t) {
      return;
    }
    if (lib.isVal(t)) {
      pref = this.getConfigVal('text_prefix');
      if (pref) {
        t = (pref+t);
      }
      suff = this.getConfigVal('text_suffix');
      if (suff) {
        t = (t+suff);
      }
    } else {
      t = '';
    }
    this.set(this.targetedStateForHashToText(), t);
  };
  TextFromHashMixin.prototype.targetedStateForHashToText = function () {
    if (this.getConfigVal('text_is_value')) {
      return 'value';
    }
    if (this.getConfigVal('text_is_html')) {
      return 'html';
    }
    return 'text';
  };
  TextFromHashMixin.prototype.hashToText = function () {
    throw new Error(this.constructor.name+' has to implement its own hashToText');
  };

  TextFromHashMixin.addMethods = function (klass) {
    lib.inheritMethods(klass, TextFromHashMixin
      ,'get_data'
      ,'set_data'
      ,'hashToText'
      ,'targetedStateForHashToText'
    );
  };

  return TextFromHashMixin;
}
module.exports = createTextFromHashMixin;
