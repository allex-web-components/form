function createFormValidatorMixin (lib, mylib) {
  'use strict';

  function possiblyBuildRegExp (obj, val, name) {
    if (name === 'regex') {
      if (lib.isString(val)) {
        obj[name] = new RegExp(val);
      }
      if (val && 'object' === typeof val && 'string' in val && 'flags' in val && lib.isString(val.string)) {
        obj[name] = new RegExp(val.string, val.flags);
      }
    }
  }

  function possiblyBuildRegExps1 (val, name) {
    if ('object' !== typeof val) {
      return;
    }
    lib.traverseShallow(val, possiblyBuildRegExp.bind(null, val));
    val = null;
  }

  function possiblyBuildRegExps (obj) {
    if (!obj) {
      return;
    }
    lib.traverseShallow(obj, possiblyBuildRegExps1);
    obj = null;
  }

  function FormValidatorMixin (options) {
    this.validation = null;
    this.confirmationfields = null;
    this.set('validation', options ? options.validation : null);
    this.set('confirmationfields', options ? options.confirmationfields : null);
  }
  FormValidatorMixin.prototype.destroy = function () {
    this.confirmationfields = null;
    this.validation = null;
  };
  FormValidatorMixin.prototype.set_validation = function (validation) {
    var vld = lib.extend({}, validation);
    possiblyBuildRegExps(vld);
    this.validation = vld;
    return true;
  };
  FormValidatorMixin.prototype.validateFieldNameWithValue = function (fieldname, value, fieldactual) {
    var validation = this.validation,
      confirmationfields = this.confirmationfields,
      vld, vldresult;
    if (lib.isVal(value) && confirmationfields && 'object' === typeof confirmationfields && fieldname in confirmationfields) {
      if (value !== this.hashdata[confirmationfields[fieldname]]) {
        return 'Confirmation failed!';
      }
    }
    if (!validation) return '';
    vld = validation[fieldname];
    if (lib.isArray(vld)) {
      vldresult = vld.reduce(validateSingleFieldNameWithValue.bind(this, value, fieldactual), '');
      value = null;
      fieldactual = null;
      return vldresult;
    }
    return validateSingleFieldNameWithValue.call(this, value, fieldactual, '', vld);
  };
  function validateSingleFieldNameWithValue (value, fieldactual, res, vld) {
    if (res) {
      return res;
    }
    if (!vld) return '';
    if (vld.onlywhenactual && !fieldactual) {
      return '';
    }
    if (!this.validateValueWithJSON(vld.json_schema, value)) return vld.error || 'Validation failed!';
    if (!this.validateValueWithRegExp(vld.regex, value)) return vld.error || 'Validation failed!';
    if (!this.validateValueWithFunction(vld.custom, value)) return vld.error || 'Validation failed!';
    return '';
  };
  FormValidatorMixin.prototype.validateValueWithJSON = function (schema, value) {
    if (!schema) return true;
    var result = lib.jsonschema.validate(value, schema);
    return !result.errors.length;
  };
  FormValidatorMixin.prototype.validateValueWithRegExp = function (regexp, value) {
    if (!regexp) return true;
    if (!(regexp instanceof RegExp)) return true;
    var result = regexp.test(value);
    //console.log('regexp', regexp, 'on', value, '=>', result);
    return result;
  };
  FormValidatorMixin.prototype.validateValueWithFunction = function (f, value) {
    if (!lib.isFunction (f)) return true;
    return f(value, this.hashdata, this.get('value'));
  };


  FormValidatorMixin.addMethods = function (klass) {
    lib.inheritMethods(klass, FormValidatorMixin
      ,'set_validation'
      ,'validateFieldNameWithValue'
      ,'validateValueWithJSON'
      ,'validateValueWithRegExp'
      ,'validateValueWithFunction'
    );
  };

  mylib.FormValidator = FormValidatorMixin;
}
module.exports = createFormValidatorMixin;
