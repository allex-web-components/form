function createElements (execlib, applib, mylib) {
  'use strict';

  require('./dummyfieldcreator')(execlib, applib);
  require('./formcreator')(execlib, applib, mylib.mixins);
  require('./formclickablecreator')(execlib, applib);
  require('./plainhashfieldcreator')(execlib, applib, mylib.mixins);
  require('./checkboxfieldcreator')(execlib, applib, mylib.mixins);
}
module.exports = createElements;
