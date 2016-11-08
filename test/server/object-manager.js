'use strict';

var _ = require('lodash')
  , testData = require('../test-data')
  , ArrayStore = require('fh-wfm-mediator/lib/array-store')
  ;

function ObjectManager(mediator, datasetId) {
  this.datasetId = datasetId;
  this.objects = [];
  this.reset();

  this.arrayStore = new ArrayStore(datasetId, this.objects);
  this.arrayStore.listen('cloud:', mediator);
}

ObjectManager.prototype.reset = function() {
  var self = this;
  self.objects.length = 0;
  testData.forEach(function(_object) {
    self.objects.push(_.clone(_object));
  });
  console.log('ObjectManager reset for dataset', this.datasetId);
};

ObjectManager.prototype.unsubscribe = function() {
  this.arrayStore.unsubscribe();
};

module.exports = ObjectManager;
