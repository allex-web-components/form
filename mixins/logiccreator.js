function createjQueryFormLogicMixin (lib, applib) {
  'use strict';
  var FormLogicMixin = applib.mixins.FormMixin;

  function jQueryFormLogicMixin (options) {
    FormLogicMixin.call(this, options);
  }
  jQueryFormLogicMixin.prototype.initialize = function () {
    this.$form = this.$element.is('form') ? this.$element : this.$element.find('form');

    this.$form.attr({
      'name': this.get('id'), ///add a name to form, __to make angular validation work__ ....
      'novalidate': ''     ///prevent browser validation ...
    });
    this.$form.removeAttr ('action'); //in order to avoid some refresh or so ...
    this.$form.on('submit', this.fireSubmit.bind(this));
    FormLogicMixin.prototype.initialize.call(this);
  };
  jQueryFormLogicMixin.prototype.set_actual = function (act) {
    return FormLogicMixin.prototype.set_actual.call(this, act);
  };
  jQueryFormLogicMixin.prototype.set_progress = function (prog) {
    return FormLogicMixin.prototype.set_progress.call(this, prog);
  };
  jQueryFormLogicMixin.prototype.fillObjectWithDefaultValues = function (obj) {
    return FormLogicMixin.prototype.fillObjectWithDefaultValues.call(this, obj);
  };
  jQueryFormLogicMixin.prototype.traverseFormFields = function (func) {
    if (!this.$form) {
      return;
    }
    this.$form.find('[name]').toArray().forEach(fieldTraverser.bind(null, func));
    func = null;
  };
  function fieldTraverser (func, el) {
    func(jQuery(el));
  }
  jQueryFormLogicMixin.prototype._appendHiddenField = function (fieldname_or_record) {
    var name = lib.isString(fieldname_or_record) ? fieldname_or_record : fieldname_or_record.name,
      attrs = {
        name: name,
        type: 'hidden',
      },
      is_hash = !lib.isString(fieldname_or_record);

    if (is_hash){
      attrs.required = fieldname_or_record.required ? '' : undefined;
      if ('value' in fieldname_or_record) {
        this._default_values[name] = fieldname_or_record.value;
      }
    }

    this.findByFieldName(name).remove(); ///remove existing elements whatever they are ...
    var $el = $('<input>').attr(attrs);
    this._prepareField($el);
    this.$form.append ($el);
    //this.$form.append($('<span> {{_ctrl.data.'+name+' | json}}</span>'));
    FormLogicMixin.prototype._appendHiddenField.call(this, fieldname_or_record);
  };
  jQueryFormLogicMixin.prototype.findByFieldName = function (name) {
    return this.$form.find ('[name="'+name+'"]');
  };
  jQueryFormLogicMixin.prototype.setInputEnabled = function (fieldname, enabled) {
    var $el = this.$form.find('[name="'+fieldname+'"]');
    if (enabled) {
      $el.removeAttr('disabled');
    }else{
      $el.attr('disabled', 'disabled');
    }
    return $el;
  };

  jQueryFormLogicMixin.addMethods = function (klass) {
    FormLogicMixin.addMethods(klass);
    lib.inheritMethods(klass, jQueryFormLogicMixin
      ,'traverseFormFields'
      ,'_appendHiddenField'
      ,'findByFieldName'
      ,'setInputEnabled'
    );
  };

  return jQueryFormLogicMixin;
}
module.exports = createjQueryFormLogicMixin;
