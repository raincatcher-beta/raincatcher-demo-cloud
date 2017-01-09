var create = require('./create');
var remove = require('./remove');
var resetUsers  = require('./reset-users');


module.exports = function getResetDataFn(mediator) {
  var buildDataFunction = create.getBuildDataFunction(mediator);

  return function() {
    return remove.removeData(mediator)
      .then(buildDataFunction)
      .then(resetUsers);
  };

};


