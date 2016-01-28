'use strict';

var workflows = [
  { id: 0, title: 'Static forms', steps: [
    {code: 'risk-assessment', name: 'Risk Assessment', templates: {
      form: '<risk-assessment-form></risk-assessment-form>',
      view: '<risk-assessment value="result.submission"></risk-assessment>'
    }},
    {code: 'vehicle-inspection', name: 'Vehicle Inspection', templates: {
      form: '<vehicle-inspection-form></vehicle-inspection-form>',
      view: '<vehicle-inspection value="result.submission"></vehicle-inspection>'
    }}
  ]},

  { id: 1, title: 'App forms', steps: [
    {code: 'identification', name: 'Identification', formId: '569427547d760c8e14d7819f'},
    {code: 'signoff', name: 'Signoff', formId: '5694264d7d760c8e14d78198'}
  ]},

  { id: 2, title: 'Mixed forms', steps: [
    {code: 'signoff', name: 'Sign-off Workorder', formId: '5694264d7d760c8e14d78198'},
    {code: 'risk-assessment', name: 'Risk Assessment', templates: {
      form: '<risk-assessment-form></risk-assessment-form>',
      view: '<risk-assessment value="result.submission"></risk-assessment>'
    }},
    {code: 'vehicle-inspection', name: 'Vehicle Inspection', templates: {
      form: '<vehicle-inspection-form></vehicle-inspection-form>',
      view: '<vehicle-inspection value="result.submission"></vehicle-inspection>'
    }}
  ]},
];

var steps = [

];

module.exports = function(mediator) {
  // Deprecated
  mediator.subscribe('workflow:steps:load', function() {
    setTimeout(function() {
      mediator.publish('workflow:steps:loaded', workflows[2].steps);
    }, 0);
  });

  mediator.subscribe('workflows:load', function() {
    setTimeout(function() {
      mediator.publish('done:workflows:load', workflows);
    }, 0);
  });

  mediator.subscribe('workflow:save', function(workflow) {
    setTimeout(function() {
      var index = _.findIndex(workflows, function(_workflow) {
        return _workflow.id == workflow.id;
      });
      workflows[index] = workflow;
      console.log('Saved workflow:', workflow);
      mediator.publish('workflow:saved:' + workflow.id, workflow);
    }, 0);
  });
}
