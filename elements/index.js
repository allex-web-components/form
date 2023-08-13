function createElements (execlib, applib, mylib) {
  'use strict';

  require('./dummyfieldcreator')(execlib, applib);
  require('./formcreator')(execlib, applib, mylib.mixins);
  require('./formpanecreator')(execlib, applib, mylib.mixins);
  require('./formclickablecreator')(execlib, applib, mylib.mixins);
  require('./hashfield')(execlib, applib, mylib.mixins);
  require('./frozenlookupfieldcreator')(execlib, applib, mylib.mixins);
  require('./checkboxfieldcreator')(execlib, applib, mylib.mixins);

  require('./formcollectioncreator')(execlib, applib, mylib.mixins);
}
module.exports = createElements;
