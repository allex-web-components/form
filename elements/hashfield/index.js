function createHashFields (execlib, applib, mixins) {
  'use strict';

  require('./plaincreator')(execlib, applib, mixins);
  require('./numbercreator')(execlib, applib, mixins);
}
module.exports = createHashFields;