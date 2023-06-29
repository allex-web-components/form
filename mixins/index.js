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
  require('./formvalidatorcreator')(lib, ret);
  return ret;
}
module.exports = createFormRenderingMixins;
