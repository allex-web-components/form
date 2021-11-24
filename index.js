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
