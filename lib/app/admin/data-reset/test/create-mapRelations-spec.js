var assert = require('assert');

var relationsMapper = require('../map_relations');


describe('Test create', function() {
  var mappings = [
    {seedId: 'oldId1', newId: 'newId1'},
    {seedId: 'oldId2', newId: 'newId2'},
    {seedId: 'oldId3', newId: 'newId3'}
  ];


  it('Should map oldId2 to newId2', function(done) {
    var workflow = {workflowId: 'oldId2'};

    var mappedItem = relationsMapper.mapRelations('workorders', workflow, mappings);

    assert.equal(mappedItem.workflowId, 'newId2');
    done();
  });


  it('Should map oldId2 to oldId2 - wrong type', function(done) {
    var workflow = {workflowId: 'oldId2'};

    var mappedItem = relationsMapper.mapRelations('wrong_type', workflow, mappings);

    assert.equal(mappedItem.workflowId, 'oldId2');
    done();
  });


  it('Should map wrongId to wrongId - wrong mappings', function(done) {
    var workflow = {workflowId: 'wrongId'};

    var mappedItem = relationsMapper.mapRelations('workorders', workflow, mappings);

    assert.equal(mappedItem.workflowId, 'wrongId');
    done();
  });

  //memberships
  it('Should map oldId2 to newId2', function(done) {
    var membership = {group: 'oldId2'};

    var mappedItem = relationsMapper.mapRelations('membership', membership, mappings);

    assert.equal(mappedItem.group, 'newId2');
    done();
  });


  it('Should map oldId2 to oldId2 - wrong type', function(done) {
    var membership = {group: 'oldId2'};

    var mappedItem = relationsMapper.mapRelations('wrong_type', membership, mappings);

    assert.equal(mappedItem.group, 'oldId2');
    done();
  });


  it('Should map wrongId to wrongId - wrong mappings', function(done) {
    var membership = {group: 'wrongId'};

    var mappedItem = relationsMapper.mapRelations('membership', membership, mappings);

    assert.equal(mappedItem.group, 'wrongId');
    done();
  });

});