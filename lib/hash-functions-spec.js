var hashFunctions = require('./hash-functions');
var hash = require('object-hash');
var _ = require('lodash');
var expect = require('chai').expect;

describe("Data Set Hash Functions", function() {

  describe("Result", function() {

    var mockResult = {
      id: "result1234",
      status: "New",
      stepResults: {
        somestepcode: {
          submission: {
            somekey1: "someval1"
          }
        },
        anotherstepcode: {
          submission: {
            otherval: "Anotherval"
          }
        }
      }
    };

    var expectedHash = "anotherstepcode,somestepcode,New";

    it("same objects should have same hashes", function() {
      expect(hashFunctions.result(mockResult)).to.equal(expectedHash);
    });

    it("different object should have different hashes", function() {
      expect(hashFunctions.result(_.omit(mockResult, 'status'))).to.not.equal(expectedHash);
    });

    it("should ignore fields that are not part of a result", function() {
      expect(hashFunctions.result(_.extend({meh: "arg"}, mockResult))).to.equal(expectedHash);
    });

  });

  describe("Workflow", function() {

    var mockWorkflow = {
      id: "workflow1234",
      steps: [{code: "step1code", templates: {view: "step1 view"}}, {code: "step2code", templates: {view: "step2 view"}}]
    };

    var mockHash = hash.sha1(mockWorkflow);

    it("same objects should have same hashes", function() {
      expect(hashFunctions.workflows(mockWorkflow)).to.equal(mockHash);
    });

    it("different object should have different hashes", function() {
      expect(hashFunctions.workflows(_.omit(mockWorkflow, 'id'))).to.not.equal(mockHash);
    });

    it("should ignore fields that are not part of a result", function() {
      expect(hashFunctions.workflows(_.extend({meh: "arg"}, mockWorkflow))).to.equal(mockHash);
    });

    it("different step order should have a different hash", function() {
      var testWorkflow = _.clone(mockWorkflow);

      var step1 = testWorkflow.steps[0];

      testWorkflow.steps[0] = testWorkflow.steps[1];
      testWorkflow.steps[1] = step1;

      expect(hashFunctions.workflows(testWorkflow)).to.not.equal(mockHash);
    });

  });


  describe("Workorder", function() {

    var mockWorkorder = {
      id: "workorder1234",
      title: "Test Workorder"
    };

    var mockHash = hash.sha1(mockWorkorder);

    it("same objects should have same hashes", function() {
      expect(hashFunctions.workorders(mockWorkorder)).to.equal(mockHash);
    });

    it("different object should have different hashes", function() {
      expect(hashFunctions.workorders(_.omit(mockWorkorder, 'id'))).to.not.equal(mockHash);
    });

    it("should ignore fields that are not part of a workorder", function() {
      expect(hashFunctions.workorders(_.extend({meh: "arg"}, mockWorkorder))).to.equal(mockHash);
    });

  });

});