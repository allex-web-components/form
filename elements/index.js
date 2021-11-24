function createElements (execlib, applib, mylib) {
  'use strict';

  require('./formcreator')(execlib, applib, mylib.mixins);
  require('./formclickablecreator')(execlib, applib);
  require('./plainhashfieldcreator')(execlib, applib, mylib.mixins);
}
module.exports = createElements;
