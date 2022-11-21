function createTextFromHashMixin (lib) {
  'use strict';

  function TextFromHashMixin (options) {
  }
  TextFromHashMixin.prototype.destroy = function () {
  };
  TextFromHashMixin.prototype.get_data = function () {
    return this.get(this.targetedStateForHashToText());
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
    return true;
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
  TextFromHashMixin.prototype.hashToText = function (data) {
    var fieldname = this.getConfigVal('hashfield'), val;
    this.setDataReceived();
    if (data && fieldname) {
      val = this.readTextValueFromHash(data, fieldname);
      this.set('valid', this.isValueValid(val));
      return val;
    }
    return null;
  };
  TextFromHashMixin.prototype.readTextValueFromHash = function (data, fieldname) {
    return lib.readPropertyFromDotDelimitedString(data, fieldname);
  };  

  TextFromHashMixin.addMethods = function (klass) {
    lib.inheritMethods(klass, TextFromHashMixin
      ,'get_data'
      ,'set_data'
      ,'hashToText'
      ,'readTextValueFromHash'
      ,'targetedStateForHashToText'
    );
  };

  return TextFromHashMixin;
}
module.exports = createTextFromHashMixin;
