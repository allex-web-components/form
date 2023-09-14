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
    this.hashCollectorRecheckingChildren = false;
  }
  HashCollectorMixin.prototype.destroy = function () {
    this.hashCollectorRecheckingChildren = null;
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
    if (this.hashCollectorRecheckingChildren) {
      return;
    }
    this.hashCollectorRecheckingChildren = true;
    fldname = (this.hashCollectorChannels && this.hashCollectorChannels[this.activeHashCollectorChannel])
    ? (this.hashCollectorChannels[this.activeHashCollectorChannel] || 'fieldname')
    :
    'fieldname';
    vldfromchildren = getValidityFromChildren.call(this);
    //console.log('finally', this.id, 'valid', vldfromchildren, 'with', this.mydata);
    this.set('valid', lib.isVal(vldfromchildren) ? vldfromchildren : true);
    valsfromchildren = getValuesFromChildren.call(this, fldname);
    /*
    if (vldfromchildren) {
      console.log(this.id, 'valid with values', valsfromchildren);
    }
    console.log(this.id, 'valid', vldfromchildren, valsfromchildren);
    */
    this.set('value', valsfromchildren);
    this.hashCollectorRecheckingChildren = false;
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
  HashCollectorMixin.prototype.onChildValueChanged = function (chld, newvalue) {
    this.recheckChildren();
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
      ,'onChildValueChanged'
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

  //statics
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
  function hooker (targetname, target) {
    var chld = this.getElement(target);
    if (!chld) {
      return;
    }
    this.hashCollectorListeners.push(this.attachListener('changed', 'valid', chld.set.bind(chld, targetname)));
  }
  function chld2mehooker (chld) {
    this.hashCollectorListeners.push(chld.attachListener('changed', 'actual', this.recheckChildren.bind(this)));
    this.hashCollectorListeners.push(chld.attachListener('changed', 'valid', this.recheckChildren.bind(this)));
    this.hashCollectorListeners.push(chld.attachListener('changed', 'value', this.onChildValueChanged.bind(this, chld)));
    chld = null;
  }
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
  }
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
        if (validateChild.call(this, chld)) {
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
      valid = validateChild.call(this, chld);
      //console.log('"valid" of', chld, 'is', valid);
      if (!valid) {
        //console.log(chld.id, 'is not valid', valid); //UNCOMMENT THIS TO FIND OUT WHICH FIELD IS INVALID
        validobj.valid = lib.isVal(valid) ? false : null;
        return;
      }
      validobj.valid = true;
    } catch (e) {
      //console.log('Could not get "valid" from', chld);
    }
  }
  function validateChild (chld) {
    var chldfld, myvld, vlderr;
    if (!this.validation) {
      return chld.get('valid');
    }
    chldfld = chld.getConfigVal('fieldname');
    if (!chldfld) {
      return chld.get('valid');
    }
    myvld = this.validation[chldfld];
    if (!myvld) {
      return chld.get('valid');
    }
    vlderr = this.validateFieldNameWithValue(chldfld, chld.get('value'), chld.get('actual'));
    chld.set('valid', !vlderr);
    chld.set('tooltip', vlderr);
    return !vlderr;
  }
  function maybePropagateActiveHashCollectorChannel (ahcc) {    
    this.__children.traverse(maybeAssignActiveHashCollectorChannel.bind(null, ahcc));
    ahcc = null;
  }
  //endof statics

  function writepiecewisetodata (data, val, fieldname) {
    //console.log('writetodata', data, 'val', val[fieldname], 'to', fieldname);
    writetodata(data, val[fieldname], fieldname);
    //writetodata(data, lib.readPropertyFromDotDelimitedString(data, fieldname), fieldname);
  }
  function writetodata (data, val, fieldname) {
    data[fieldname] = val;
    //lib.writePropertyFromDotDelimitedString(data, fieldname, val, true);
  }
  function maybeAssignActiveHashCollectorChannel (ahcc, chld) {
    if (chld.hashCollectorChannels) {
      chld.set('activeHashCollectorChannel', ahcc);
    }
  }

  return HashCollectorMixin;
}
module.exports = createHashCollectorMixin;
