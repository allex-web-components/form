(function(){function r(e,n,t){function o(i,f){if(!n[i]){if(!e[i]){var c="function"==typeof require&&require;if(!f&&c)return c(i,!0);if(u)return u(i,!0);var a=new Error("Cannot find module '"+i+"'");throw a.code="MODULE_NOT_FOUND",a}var p=n[i]={exports:{}};e[i][0].call(p.exports,function(r){var n=e[i][1][r];return o(n||r)},p,p.exports,r,e,n,t)}return n[i].exports}for(var u="function"==typeof require&&require,i=0;i<t.length;i++)o(t[i]);return o}return r})()({1:[function(require,module,exports){
function createCheckBoxFieldElement (execlib, applib, mixins) {
  'use strict';

  var lib = execlib.lib,
    CheckBoxElement = applib.getElementType('CheckBoxElement'),
    FieldBaseMixin = mixins.FieldBase,
    DataHolderMixin = mixins.DataHolder;

 
  function CheckBoxFieldElement (id, options) {
    options = options || {};
    CheckBoxElement.call(this, id, options);
    FieldBaseMixin.call(this, options);
    DataHolderMixin.call(this, options);
    this.setValidity();
  }
  lib.inherit(CheckBoxFieldElement, CheckBoxElement);
  FieldBaseMixin.addMethods(CheckBoxFieldElement);
  DataHolderMixin.addMethods(CheckBoxFieldElement);
  CheckBoxFieldElement.prototype.__cleanUp = function () {
    DataHolderMixin.prototype.destroy.call(this);
    FieldBaseMixin.prototype.destroy.call(this);
    CheckBoxElement.prototype.__cleanUp.call(this);
  };
  CheckBoxFieldElement.prototype.get_data = function () {
    return this.get('checked');
  };
  CheckBoxFieldElement.prototype.set_data = function (data) {
    var fieldname = this.getConfigVal('hashfield'), val;
    this.setDataReceived();
    if (data && fieldname) {
      val = lib.readPropertyFromDotDelimitedString(data, fieldname);
    }
    this.set('checked', !!val);
    this.setValidity(val);
    return true;
  };
  CheckBoxFieldElement.prototype.isValueValid = function (val) {
    return lib.isBoolean(val);
  };
  
  applib.registerElementType('CheckBoxFieldElement', CheckBoxFieldElement);
}
module.exports = createCheckBoxFieldElement;
},{}],2:[function(require,module,exports){
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
  DummyFieldElement.prototype.resetData = lib.dummyFunc;
  
  applib.registerElementType('DummyFieldElement', DummyFieldElement);
}
module.exports = dummyFieldElementCreator;
},{}],3:[function(require,module,exports){
function createFormClickable (execlib, applib) {
  'use strict';

  var lib = execlib.lib,
    ClickableElement = applib.getElementType('ClickableElement');

  function FormClickableElement (id, options) {
    options.fieldname = null;
    ClickableElement.call(this, id, options);
  }
  lib.inherit(FormClickableElement, ClickableElement);
  FormClickableElement.prototype.get_data = function () {
    return null;
  };
  FormClickableElement.prototype.set_data = function () {
    return true;
  };
  FormClickableElement.prototype.resetData = lib.dummyFunc;


  applib.registerElementType('FormClickableElement', FormClickableElement);
}
module.exports = createFormClickable;

},{}],4:[function(require,module,exports){
function createFormElement (execlib, applib, mixins) {
  'use strict';

  var lib = execlib.lib,
    WebElement = applib.getElementType('WebElement'),
    FormMixin = mixins.Form;

  function FormElement (id, options) {
    WebElement.call(this, id, options);
    FormMixin.call(this, options);
  }
  lib.inherit(FormElement, WebElement);
  FormMixin.addMethods(FormElement);
  FormElement.prototype.__cleanUp = function () {
    FormMixin.prototype.destroy.call(this);
    WebElement.prototype.__cleanUp.call(this);
  };

  FormElement.prototype.initializeFormForPossibleDataAssignment = function () {
    if (this.getConfigVal('data')) {
      this.set('data', this.getConfigVal('data'));
    }
  };
  FormElement.prototype.postInitializationMethodNames.push('initializeFormForPossibleDataAssignment');

  applib.registerElementType('FormElement', FormElement);
}
module.exports = createFormElement;

},{}],5:[function(require,module,exports){
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
    this.setValidity(val);
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
},{}],6:[function(require,module,exports){
function createElements (execlib, applib, mylib) {
  'use strict';

  require('./dummyfieldcreator')(execlib, applib);
  require('./formcreator')(execlib, applib, mylib.mixins);
  require('./formclickablecreator')(execlib, applib);
  require('./plainhashfieldcreator')(execlib, applib, mylib.mixins);
  require('./frozenlookupfieldcreator')(execlib, applib, mylib.mixins);
  require('./checkboxfieldcreator')(execlib, applib, mylib.mixins);
}
module.exports = createElements;

},{"./checkboxfieldcreator":1,"./dummyfieldcreator":2,"./formclickablecreator":3,"./formcreator":4,"./frozenlookupfieldcreator":5,"./plainhashfieldcreator":7}],7:[function(require,module,exports){
function createPlainHashFieldElement (execlib, applib, mixins) {
  'use strict';

  var lib = execlib.lib,
    WebElement = applib.getElementType('WebElement'),
    FieldBaseMixin = mixins.FieldBase,
    TextFromHashMixin = mixins.TextFromHash,
    DataHolderMixin = mixins.DataHolder,
    InputHandlerMixin = mixins.InputHandler;

  function PlainHashFieldElement (id, options) {
    WebElement.call(this, id, options);
    FieldBaseMixin.call(this, options);
    TextFromHashMixin.call(this, options);
    DataHolderMixin.call(this, options);
    InputHandlerMixin.call(this, options);
    this.setValidity();
  }
  lib.inherit(PlainHashFieldElement, WebElement);
  FieldBaseMixin.addMethods(PlainHashFieldElement);
  TextFromHashMixin.addMethods(PlainHashFieldElement);
  DataHolderMixin.addMethods(PlainHashFieldElement);
  InputHandlerMixin.addMethods(PlainHashFieldElement);
  PlainHashFieldElement.prototype.__cleanUp = function () {
    InputHandlerMixin.prototype.destroy.call(this);
    DataHolderMixin.prototype.destroy.call(this);
    TextFromHashMixin.prototype.destroy.call(this);
    FieldBaseMixin.prototype.destroy.call(this);
    WebElement.prototype.__cleanUp.call(this);
  };
  PlainHashFieldElement.prototype.onInputElementKeyUp = PlainHashFieldElement.prototype.onInputElementChange;
  PlainHashFieldElement.prototype.set_value = function (val) {
    var ret = InputHandlerMixin.prototype.set_value.call(this, val);
    this.setDataReceived(); //this was added late, might cause problems later
    //console.log(this.id, 'setting valid', lib.isVal(val) && !!val, 'because', val);
    this.setValidity(val);
    return ret;
  };
  PlainHashFieldElement.prototype.isValueValid = function (val) {
    if (!this.get('required')) {
      return true;
    }
    return lib.isVal(val) && !!val;
  };

  applib.registerElementType('PlainHashFieldElement', PlainHashFieldElement);
}
module.exports = createPlainHashFieldElement;

},{}],8:[function(require,module,exports){
(function (execlib) {
  'use strict';

  var lR = execlib.execSuite.libRegistry,
    applib = lR.get('allex_applib'),
    jqueryelem = lR.get('allex_jqueryelementslib');

  var mylib = {};

  mylib.mixins = require('./mixins')(execlib, applib);

  require('./elements')(execlib, applib, mylib);

  lR.register('allex_formwebcomponent', mylib);
})(ALLEX);

},{"./elements":6,"./mixins":15}],9:[function(require,module,exports){
function createBitMaskCheckboxesMixin (lib) {
  'use strict';

  function BitMaskCheckboxesMixin (options) {
    if (!options) {
      throw new Error ('BitMaskCheckboxesMixin needs the options hash in its ctor');
    }
    if (!options.hashfield) {
      throw new Error ('BitMaskCheckboxesMixin needs the "hashfield" name in its ctor options');
    }
    if (!lib.isArray(options.values)) {
      throw new Error ('BitMaskCheckboxesMixin needs the "values" array of finder Strings in its ctor options');
    }
    this.bitmaskcheckboxesvalue = null;
    this.checkboxchangeder = checkBoxChanged.bind(this);
  }
  BitMaskCheckboxesMixin.prototype.destroy = function () {
    if (this.checkboxchangeder) {
      if (this.$element) {
        this.$element.find(':checkbox').off('changed', this.checkboxchangeder);
      }
    }
    this.checkboxchangeder = null;
    this.bitmaskcheckboxesvalue = null;
  };
  BitMaskCheckboxesMixin.prototype.hashToText = function (data) {
    if (!this.$element) {
      return null;
    }
    if (lib.isFunction(this.setDataReceived)) {
      this.setDataReceived();
    }
    this.set('value', lib.isVal(data) ? data[this.getConfigVal('hashfield')] : null);
    return null;
  };
  BitMaskCheckboxesMixin.prototype.set_value = function (val) {
    setValueToCheckboxes.call(this, val);
    this.bitmaskcheckboxesvalue = val;
    return true;
  };
  BitMaskCheckboxesMixin.prototype.get_value = function () {
    return this.bitmaskcheckboxesvalue; //getValueFromChecboxes.call(this);
  };
  BitMaskCheckboxesMixin.prototype.get_valid = function () {
    return lib.isNumber(this.get_value());
  };
  BitMaskCheckboxesMixin.prototype.bitMaskCheckboxesMaybeStartListening = function () {
    if (this.$element) {
      this.$element.find(':checkbox').prop('checked', false);
    }
    if (!this.getConfigVal('interactive')) {
      this.$element.find(':checkbox').prop('disabled', true);
      return;
    }
    this.$element.find(':checkbox').on('click', this.checkboxchangeder);
  };

  BitMaskCheckboxesMixin.addMethods = function (klass) {
    lib.inheritMethods(klass, BitMaskCheckboxesMixin
      ,'hashToText'
      ,'bitMaskCheckboxesMaybeStartListening'
    );
    klass.prototype.postInitializationMethodNames = 
      klass.prototype.postInitializationMethodNames.concat(['bitMaskCheckboxesMaybeStartListening']);
  };

  //static method - "this" matters
  function checkBoxChanged () {
    this.set('value', getValueFromChecboxes.call(this));
  }

  //static method - "this" matters
  function setValueToCheckboxes (val) {
    var values = this.getConfigVal('values');
    if (lib.isArray(values)) {
      values.reduce(bitMaskCheckboxesCheckboxSetter.bind(this, val), 1);
      val = null;
    }
  }
  //static method - "this" matters
  function bitMaskCheckboxesCheckboxSetter (val, res, finder) {
    var subelement = this.$element.find(finder);
    if (!(subelement && subelement.length===1)) {
      return res;
    }
    subelement.attr('name', this.getConfigVal('hashfield'));
    subelement.val(res);
    subelement.prop('checked', res&val); //bitwise AND
    res *= 2;
    return res;
  };

  //static method - "this" matters
  function getValueFromChecboxes () {
    var values, reduceobj;
    if (!this.$element) {
      return null;
    }
    values = this.getConfigVal('values');
    reduceobj = {
      val: 0,
      power: 1
    };
    if (lib.isArray(values)) {
      values.reduce(bitMaskCheckboxesCheckboxGetter.bind(this), reduceobj);
      return reduceobj.val;
    }
    return null;
  }

  //static method - "this" matters
  function bitMaskCheckboxesCheckboxGetter (res, finder) {
    var subelement = this.$element.find(finder);
    if (!(subelement && subelement.length===1)) {
      res.power*=2;
      return res;
    }
    if (subelement.prop('checked')) {
      res.val += res.power;
    }
    res.power*=2;
    return res;
  }

  return BitMaskCheckboxesMixin;
}
module.exports = createBitMaskCheckboxesMixin;

},{}],10:[function(require,module,exports){
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

},{}],11:[function(require,module,exports){
function createFieldBaseMixin (lib, mylib) {
  'use strict';

  function FieldBaseMixin () {
    if (!lib.isFunction(this.isValueValid)) {
      throw new lib.Error('ISVALUEVALID_NOT_IMPLEMENTED', this.constructor.name+' must implement isValueValid');
    }
  }

  FieldBaseMixin.prototype.setValidity = function (val) {
    var myvalid;
    try {
      myvalid = evaluateValidity.call(this, val);
    } catch (e) {
      myvalid = false;
    }
    this.set('valid', myvalid);
    if (this.$element && this.$element.length>0) {
      this.$element[myvalid ? 'removeClass' : 'addClass']('invalid');
    }
  };

  FieldBaseMixin.addMethods = function (klass) {
    lib.inheritMethods(klass, FieldBaseMixin
      , 'setValidity'
    );
  };

  //statics
  function evaluateValidity (val) {
    if (!this.isValueValid(val)) {
      return false;
    }
    if (this.__parent && lib.isFunction(this.__parent.validateFieldNameWithValue)) {
      return this.__parent.validateFieldNameWithValue(this.getConfigVal('fieldname'), val);
    }
    return true;
  };
  //endofstatics

  mylib.FieldBase = FieldBaseMixin;
}
module.exports = createFieldBaseMixin;
},{}],12:[function(require,module,exports){
function createFormMixin (lib, mylib) {
  'use strict';

  var HashDistributorMixin = mylib.HashDistributor,
    HashCollectorMixin = mylib.HashCollector,
    DataHolderMixin = mylib.DataHolder;

  function FormMixin (options) {
    HashDistributorMixin.call(this, options);
    HashCollectorMixin.call(this, options);
    DataHolderMixin.call(this, options);
    this.settingdata = false;
    this.changedinternally = null;
  }
  FormMixin.prototype.destroy = function () {
    this.changedinternally = null;
    this.settingdata = null;
    DataHolderMixin.prototype.destroy.call(this);
    HashDistributorMixin.prototype.destroy.call(this);
    HashCollectorMixin.prototype.destroy.call(this);
  };
  FormMixin.prototype.hookToCollectorValidity = function () {
    var jqundofinder;
    HashCollectorMixin.prototype.hookToCollectorValidity.call(this);
    this.__children.traverse(hookchecker.bind(this));
    jqundofinder = this.getConfigVal('jqueryundofinder');
    if (jqundofinder && this.$element) {
      this.$element.find(jqundofinder).on('click', this.undoChanges.bind(this));
    }
  };
  FormMixin.prototype.set_data = function (data) {
    var ret = true;
    this.settingdata = true;
    this.set('initiallyvalid', null);
    this.set('valid', null);
    if (false === this.dataHolderUnderReset) {
      this.resetData();
    }
    if (lib.isVal(data)) {
      ret = HashDistributorMixin.prototype.set_data.call(this, data);
    }
    this.recheckChildren();
    this.set('changedinternally', false);
    this.settingdata = false;
    return ret;
  };
  FormMixin.prototype.set_value = function (value) {
    var ci, hd, ret = HashCollectorMixin.prototype.set_value.call(this, value);
    if (!this.settingdata && lib.isVal(value)) {
      hd = this.hashdata;
      ci = lib.traverseShallowConditionally(this.collectorvalue, changedpiesewise.bind(null, hd));
      if (ci!==true) {
        ci = false;
      }
      //console.log('changedinternally?', this.hashdata, this.collectorvalue, ci);
      this.set('changedinternally', ci);
      hd = null;
    }
    return ret;
  };

  function changedpiesewise (hash, val, name) {
    if (!lib.isEqual(hash[name], val)) {
      return true;
    }
    //console.log('changedinternally? for', name, hash[name], 'eq', val);
  }

  FormMixin.prototype.undoChanges = function () {
    this.set('data', lib.extend({}, this.hashdata));
  };

  FormMixin.prototype.onChangedInternallyProc = function (chld, ci) {
    var v = this.get('valid');
    chld.set('enabled', v&&ci);
  }

  FormMixin.addMethods = function (klass) {
    HashDistributorMixin.addMethods(klass);
    HashCollectorMixin.addMethods(klass);
    DataHolderMixin.addMethods(klass);
    lib.inheritMethods(klass, FormMixin
      ,'hookToCollectorValidity'
      ,'set_data'
      ,'set_value'
      ,'undoChanges'
      ,'onChangedInternallyProc'
    );
  };


  //statics
  function hookchecker (chld) {
    if (chld && chld.clicked && lib.isFunction(chld.clicked.attach)) {
      //Clickable
      if (chld.getConfigVal('submitbutton')) {
        this.hashCollectorListeners.push(this.attachListener('changed', 'value', this.onChangedInternallyProc.bind(this, chld)));
      }
    }
  }
  //endof statics

  mylib.Form = FormMixin;
};
module.exports = createFormMixin;

},{}],13:[function(require,module,exports){
function createHashCollectorMixin (lib) {
  'use strict';

  function HashCollectorMixin (options) {
    this.hashCollectorChannels = options.hashcollectorchannels || null;
    this.activeHashCollectorChannel = options.activehashcollectorchannel || null;
    this.collectorinitialvalid = null;
    this.collectorvalid = null;
    this.collectorvalue = null;
    this.hashCollectorListeners = [];
    this.wantsSubmit = this.createBufferableHookCollection(); //new lib.HookCollection();
    this.hardcodedFields = options ? options.hardcoded_fields : null;
  }
  HashCollectorMixin.prototype.destroy = function () {
    this.hardcodedFields = null;
    if (this.wantsSubmit) {
      this.wantsSubmit.destroy();
    }
    this.wantsSubmit = null;
    if (this.hashCollectorListeners) {
      lib.arryDestroyAll(this.hashCollectorListeners);
    }
    this.hashCollectorListeners = null;
    this.collectorvalue = null;
    this.collectorvalid = null;
    this.collectorinitialvalid = null;
    this.hashCollectorChannels = null;
  };
  HashCollectorMixin.prototype.get_value = function () {
    return lib.extend({}, this.collectorvalue, this.hardcodedFields);
  };
  HashCollectorMixin.prototype.set_value = function (value) {
    this.collectorvalue = value;
    return true;
  };
  HashCollectorMixin.prototype.get_initiallyvalid = function () {
    return this.collectorinitialvalid;
  };
  HashCollectorMixin.prototype.set_initiallyvalid = function (val) {
    //console.log(this.id, 'setting initiallyvalid to', val, 'with', this.mydata);
    this.collectorinitialvalid = val;
    return true;
  };
  HashCollectorMixin.prototype.get_valid = function () {
    return this.collectorvalid;
  };
  HashCollectorMixin.prototype.set_valid = function (valid) {
    if (!lib.isVal(this.collectorvalid) && lib.isVal(valid)) {
      this.set('initiallyvalid', valid);
    }
    this.collectorvalid = valid;
    return true;
  };
  HashCollectorMixin.prototype.get_activeHashCollectorChannel = function () {
    return this.activeHashCollectorChannel;
  };
  HashCollectorMixin.prototype.set_activeHashCollectorChannel = function (ahcc) {
    this.activeHashCollectorChannel = ahcc;
    maybePropagateActiveHashCollectorChannel.call(this, ahcc);
    this.recheckChildren();
    return true;
  };
  HashCollectorMixin.prototype.fireSubmit = function () {
    if (!this.get('valid')) {
      return;
    }
    this.wantsSubmit.fire(this.get('value'));
  };
  HashCollectorMixin.prototype.recheckChildren = function () {
    var fldname, vldfromchildren, valsfromchildren;
    fldname = (this.hashCollectorChannels && this.hashCollectorChannels[this.activeHashCollectorChannel])
    ? (this.hashCollectorChannels[this.activeHashCollectorChannel] || 'fieldname')
    :
    'fieldname';
    vldfromchildren = getValidityFromChildren.call(this);
    //console.log('finally', this.id, 'valid', vldfromchildren, 'with', this.mydata);    
    this.set('valid', vldfromchildren);
    valsfromchildren = getValuesFromChildren.call(this, fldname);
    /*
    if (vldfromchildren) {
      console.log(this.id, 'valid with values', valsfromchildren);
    }
    console.log(this.id, 'valid', vldfromchildren, valsfromchildren);
    */
    this.set('value', valsfromchildren);
  };
  HashCollectorMixin.prototype.hookToCollectorValidity = function () {
    var hookvalid = this.getConfigVal('hookvalid');
    if (hookvalid) {
      hookTo.call(this, hookvalid, 'enabled');
      hookTo.call(this, hookvalid, 'actual');
    }
    if (this.__children) {
      this.__children.traverse(chld2mehooker.bind(this));
    }
  };


  HashCollectorMixin.addMethods = function (klass) {
    lib.inheritMethods(klass, HashCollectorMixin
      ,'get_value'
      ,'set_value'
      ,'get_initiallyvalid'
      ,'set_initiallyvalid'
      ,'get_valid'
      ,'set_valid'
      ,'get_activeHashCollectorChannel'
      ,'set_activeHashCollectorChannel'
      ,'fireSubmit'
      ,'recheckChildren'
      ,'hookToCollectorValidity'
    );
    HashCollectorMixin.addPostInitialization(klass);
  };
  HashCollectorMixin.addPostInitialization = function (klass) {
    klass.prototype.postInitializationMethodNames = 
      klass.prototype.postInitializationMethodNames.concat(['hookToCollectorValidity']);
  };

  function datagetter (fldname, data, chld) {
    var fieldname = chld.getConfigVal(fldname),
      val;
    if (lib.isUndef(fieldname)) {
      //console.warn('Child', chld.constructor.name, chld.id, 'has no fieldname');
      return;
    }
    if (fieldname === null) {
      //this chld has no fields to give
      return;
    }
    try {
      val = chld.get('value');
      if (lib.isArray(fieldname)) {
        if (!(lib.isVal(val) && 'object' === typeof val)) {
          return;
        }
        //console.log('traversing', fieldname, 'with val', val);
        fieldname.forEach(writepiecewisetodata.bind(null, data, val));
        data = null;
        val = null;
        return;
      }
      writetodata(data, val, fieldname);
    } catch (e) {
      /*
      console.warn('Could not get "value" from', chld);
      console.warn(e);
      */
      return;
    }
  }
  function writepiecewisetodata (data, val, fieldname) {
    //console.log('writetodata', data, 'val', val[fieldname], 'to', fieldname);
    writetodata(data, val[fieldname], fieldname);
    //writetodata(data, lib.readPropertyFromDotDelimitedString(data, fieldname), fieldname);
  }
  function writetodata (data, val, fieldname) {
    data[fieldname] = val;
    //lib.writePropertyFromDotDelimitedString(data, fieldname, val, true);
  }

  //static method, "this" matters
  function hookTo (hookvalid, targetname) {
    var target = hookvalid[targetname];
    if (!target) {
      return;
    }
    if (lib.isArray(target)) {
      target.forEach(hooker.bind(this, targetname));
      return;
    }
    hooker.call(this, targetname, target);
  }

  //static method, "this" matters
  function hooker (targetname, target) {
    var chld = this.getElement(target);
    if (!chld) {
      return;
    }
    this.hashCollectorListeners.push(this.attachListener('changed', 'valid', chld.set.bind(chld, targetname)));
  }

  //static method, "this" matters
  function chld2mehooker (chld) {
    this.hashCollectorListeners.push(chld.attachListener('changed', 'valid', this.recheckChildren.bind(this)));
    this.hashCollectorListeners.push(chld.attachListener('changed', 'value', this.recheckChildren.bind(this)));
  }

  //static method, "this" matters
  function getValuesFromChildren (fldname) {
    var ret = {}, _r = ret, _fn = fldname;
    if (!this.__children) {
      return ret;
    }
    this.__children.traverse(datagetter.bind(null, _fn, _r));
    _fn = null;
    _r = null;
    return ret;
  }

  //static method, "this" matters
  function getValidityFromChildren () {
    var ret, _r;
    if (!this.__children) {
      return false;
    }
    ret = {valid: null, anypristine: false};
    _r = ret;
    this.__children.traverse(validandpristinegetter.bind(this, _r));
    //console.log(this.id, 'valid', ret.valid, 'any pristine', ret.anypristine);
    _r = null;
    if (ret.anypristine) {
      ret = void 0;
    } else {
      ret = ret.valid;
    }
    return ret;
  };

  //static method, "this" matters
  function validandpristinegetter (validobj, chld) {
    var valid, pristine;
    if (!chld) {
      return;
    }
    if (validobj.anypristine===true) {
      return;
    }
    if (validobj.valid===false) {
      return;
    }
    if (!chld.get('required')) {
      try {
        if (chld.get('valid')) {
          validobj.valid = true;
        }
      } catch (e) {
        //console.log('Could not get "valid" from', chld);
      }
      return;
    }
    try {
      pristine = chld.get('pristine');
      if (pristine) {
        //console.log(chld.id, 'is pristine');
        validobj.anypristine = true;
        return;
      } else {
        //console.log(chld.id, 'is NOT pristine');
      }
    } catch (e) {
      //console.log('Could not get "pristine" from', chld);
    }
    try {
      valid = chld.get('valid');
      //console.log('"valid" of', chld, 'is', valid);
      if (!valid) {
        //console.log(chld.id, 'is not valid', valid);
        validobj.valid = lib.isVal(valid) ? false : null;
        return;
      }
      validobj.valid = true;
    } catch (e) {
      //console.log('Could not get "valid" from', chld);
    }
  }

  function maybePropagateActiveHashCollectorChannel (ahcc) {    
    this.__children.traverse(maybeAssignActiveHashCollectorChannel.bind(null, ahcc));
    ahcc = null;
  }
  function maybeAssignActiveHashCollectorChannel (ahcc, chld) {
    if (chld.hashCollectorChannels) {
      chld.set('activeHashCollectorChannel', ahcc);
    }
  }


  return HashCollectorMixin;
}
module.exports = createHashCollectorMixin;

},{}],14:[function(require,module,exports){
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
    this.__children.traverse(datasetter.bind(this, data));
    data = null;
    return true;
  };

  HashDistributorMixin.addMethods = function (klass) {
    lib.inheritMethods(klass, HashDistributorMixin
      ,'get_data'
      ,'set_data'
    );
  };

  function datasetter (data, chld) {
    try {
      chld.set('data', data);
    } catch(e) {
      //console.warn(this.id, 'could not set data on', chld.constructor.name, chld.id);//, e);
    }
  }

  return HashDistributorMixin;
}
module.exports = createHashDistributorMixin;

},{}],15:[function(require,module,exports){
function createFormRenderingMixins (execlib, applib) {
  'use strict';

  var lib = execlib.lib,
    ret = {
      HashDistributor: require('./hashdistributorcreator')(lib),
      HashCollector: require('./hashcollectorcreator')(lib),
      DataHolder: require('./dataholdercreator')(lib),
      BitMaskCheckboxes: require('./bitmaskcheckboxescreator')(lib),
      Radios: require('./radioscreator')(lib),
      TextFromHash: require('./textfromhashcreator')(lib),
      InputHandler: require('./inputhandlercreator')(lib),
      NumericSpinner: require('./numericspinnercreator')(lib),
      Logic: require('./logiccreator')(lib, applib)
    };

  require('./fieldbasecreator')(lib, ret);
  require('./formcreator')(lib, ret);
  return ret;
}
module.exports = createFormRenderingMixins;

},{"./bitmaskcheckboxescreator":9,"./dataholdercreator":10,"./fieldbasecreator":11,"./formcreator":12,"./hashcollectorcreator":13,"./hashdistributorcreator":14,"./inputhandlercreator":16,"./logiccreator":17,"./numericspinnercreator":18,"./radioscreator":19,"./textfromhashcreator":20}],16:[function(require,module,exports){
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

},{}],17:[function(require,module,exports){
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

},{}],18:[function(require,module,exports){
function createNumericSpinner (lib) {
  'use strict';

  function NumericSpinnerMixin (options) {
    this.quantitynav = null;
  }
  NumericSpinnerMixin.prototype.destroy = function () {
    if (this.quantitynav) {
      this.quantitynav.remove();
    }
    this.quantitynav = null;
  };
  NumericSpinnerMixin.prototype.initializeNumericSpinner = function () {
    var input;
    if (!this.$element) {
      return;
    }
    if (this.$element.is('input')) {
      console.warn(this.constructor.name, this.id, 'must be a DOM element that contains the numeric input');
      return;
      //input = this.$element;
    } else {
      input = this.$element.find('input');
      if (!(input && input.length>0)) {
        console.warn('No input found on', this.$element);
        return;
      }
      if (input.length>1) {
        console.warn('More than one input found on', this.$element);
        return;
      }
    }
    this.quantitynav = jQuery('<div class="quantity-nav"><div class="quantity-button quantity-up">+</div><div class="quantity-button quantity-down">-</div></div>');
    this.quantitynav.find('.quantity-up').click(this.onSpinnerButtonClicked.bind(this, 1));
    this.quantitynav.find('.quantity-down').click(this.onSpinnerButtonClicked.bind(this, -1));
    this.quantitynav.insertAfter(input);
  };
  NumericSpinnerMixin.prototype.onSpinnerButtonClicked = function (inc) {
    var input, step, oldval, newval;
    if (!this.$element) {
      return;
    }
    input = this.$element.find('input');
    oldval = parseInt(input.val()) || 0;
    step = this.numericSpinnerValueOf(input, 'step', 1);
    newval = oldval + inc*step;
    if (!this.isNumericValueValid(newval, input)) {
      if (!this.isNumericValueValid(oldval, input)) {
        newval = this.numericSpinnerValueOf(input, 'min', 0);
        if (!this.isNumericValueValid(newval, input)) {
          return;
        }
      } else {
        return;
      }
    }
    input.val(newval);
    input.trigger('change');
  };
  NumericSpinnerMixin.prototype.isNumericValueValid = function (val, input) {
    var step, min, max;
    if (!lib.isNumber(val)) {
      return false;
    }
    input = input || this.$element.find('input');
    if (!(input && input.length)) {
      return false;
    }
    step = this.numericSpinnerValueOf(input, 'step', 1);
    max = this.numericSpinnerValueOf(input, 'max', 0);
    min = this.numericSpinnerValueOf(input, 'min', 0);
    if (val>max) {
      return false;
    }
    if (val<min) {
      return false;
    }
    if ((val-min)%step !== 0) {
      return false;
    }
    return true;
  };
  NumericSpinnerMixin.prototype.numericSpinnerValueOf = function (input, name, dflt) {
    var ret = parseInt(this.getConfigVal(name) || input.attr(name));
    if (lib.isNumber(ret)) {
      return ret;
    }
    return dflt;
  };

  NumericSpinnerMixin.addMethods = function (klass) {
    lib.inheritMethods(klass, NumericSpinnerMixin
      ,'initializeNumericSpinner'
      ,'onSpinnerButtonClicked'
      ,'numericSpinnerValueOf'
      ,'isNumericValueValid'
    );
    klass.prototype.preInitializationMethodNames = 
      klass.prototype.preInitializationMethodNames.concat(['initializeNumericSpinner']);
  };

  return NumericSpinnerMixin;
}
module.exports = createNumericSpinner;

},{}],19:[function(require,module,exports){
function createRadiosMixin (lib) {
  'use strict';

  function RadiosMixin (options) {
    if (!options) {
      throw new Error ('RadiosMixin needs the options hash in its ctor');
    }
    if (!options.hashfield) {
      throw new Error ('RadiosMixin needs the "hashfield" name in its ctor options');
    }
    if (!lib.isArray(options.values)) {
      throw new Error ('RadiosMixin needs the "values" array of finder Strings in its ctor options');
    }
    this.radiochangeder = radioChanged.bind(this);
  }
  RadiosMixin.prototype.destroy = function () {
    if (this.radiochangeder) {
      if (this.$element) {
        this.$element.find(':radio').off('click', this.radiochangeder);
      }
    }
    this.radiochangeder = null;
  };
  RadiosMixin.prototype.hashToText = function (data) {
    if (lib.isFunction(this.setDataReceived)) {
      this.setDataReceived();
    }
    this.set('value', lib.isVal(data) ? data[this.getConfigVal('hashfield')] : null);
    return null;
  };
  RadiosMixin.prototype.setTheInputElementValue = function (val) {
    setValueToRadios.call(this, val);
    this.changed.fire('valid', lib.isNumber(val) && val>0);
  };
  RadiosMixin.prototype.getTheInputElementValue = function () {
    return this.value;
  };
  /*
  RadiosMixin.prototype.set_value = function (val) {
    setValueToRadios.call(this, val);
    this.changed.fire('valid', lib.isNumber(val) && val>0);
    return true;
  };
  */
  RadiosMixin.prototype.get_valid = function () {
    var checked;
    if (!this.$element) {
      return false;
    }
    checked = this.$element.find('input:checked');
    return checked&&checked.length===1;
  };

  RadiosMixin.prototype.radiosMaybeStartListening = function () {
    setValueToRadios.call(this, null);
    if (this.$element) {
      this.$element.find(':radio').prop('checked', false);
    }
    if (!this.getConfigVal('interactive')) {
      this.$element.find(':radio').prop('disabled', true);
      return;
    }
    this.$element.find(':radio').on('click', this.radiochangeder);
  };

  RadiosMixin.addMethods = function (klass) {
    lib.inheritMethods(klass, RadiosMixin
      ,'hashToText'
      ,'get_value'
      //,'set_value'
      ,'setTheInputElementValue'
      ,'getTheInputElementValue'
      ,'get_valid'
      ,'radiosMaybeStartListening'
    );
    klass.prototype.postInitializationMethodNames = 
      klass.prototype.postInitializationMethodNames.concat(['radiosMaybeStartListening']);
  };

  //static method - "this" matters
  function setValueToRadios (val) {
    var values = this.getConfigVal('values');
    if (lib.isArray(values)) {
      values.reduce(radiosCheckboxSetter.bind(this, val), 1);
      val = null;
    }
  }

  //static method - "this" matters
  function radiosCheckboxSetter (val, res, finder) {
    var subelement = this.$element.find(finder);
    if (!(subelement && subelement.length===1)) {
      return;
    }
    subelement.attr('name', this.getConfigVal('hashfield'));
    subelement.val(res);
    subelement.prop('checked', res===val);
    res ++;
    return res;
  };

  //static method - "this" matters
  function getValueFromRadios () {
    var checked, ret;
    if (!this.$element) {
      return null;
    }
    checked = this.$element.find('input:checked');
    if (!(checked && checked.length===1)) {
      return null;
    }
    ret = parseInt(checked.val());
    if (lib.isNumber(ret)) {
      return ret;
    }
    return null;
  }

  //static method - "this" matters
  function radioChanged () {
    this.set('value', getValueFromRadios.call(this));
  }
  
  return RadiosMixin;
}
module.exports = createRadiosMixin;

},{}],20:[function(require,module,exports){
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
      this.setValidity(val);
      return val;
    }
    return null;
  };
  TextFromHashMixin.prototype.readTextValueFromHash = function (data, fieldname) {
    var ret = lib.readPropertyFromDotDelimitedString(data, fieldname), default_value;
    if (!lib.isVal(ret)) {
      default_value = this.getConfigVal('default_value');
      if (lib.isVal(default_value)) {
        return default_value;
      }
    }
    return ret;
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

},{}]},{},[8]);
