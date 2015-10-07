'use strict';

var workflows = [
  { id: 0, title: 'Static forms', steps: [
    {code: 'begin-workflow', name: 'Begin Workflow', templates: {
      form: '<workorder-list-item workorder="workorder"></workorder-view-item>',
      view: '<workorder-list-item workorder="workorder"></workorder-view-item>',
      portal: {
        view: '<workorder-portal-view workorder="workorder" workflow="workflow"></workorder-portal-view>'
      }
    }},
    {code: 'risk-assessment', name: 'Risk Assessment', templates: {
      form: '<risk-assessment-form></risk-assessment-form>',
      view: '<risk-assessment value="workorder.steps[\'risk-assessment\'].submission"></risk-assessment>',
      portal: {
        view: '<risk-assessment-portal-view value="workorder.steps[\'risk-assessment\'].submission"></risk-assessment-portal-view>'
      }
    }},
    {code: 'vehicle-inspection', name: 'Vehicle Inspection', templates: {
      form: '<vehicle-inspection-form></vehicle-inspection-form>',
      view: '<vehicle-inspection value="workorder.steps[\'vehicle-inspection\'].submission"></vehicle-inspection>',
      portal: {
        view: '<vehicle-inspection-portal-view value="workorder.steps[\'vehicle-inspection\'].submission"></vehicle-inspection-portal-view>'
      }
    }},
    {code: 'workflow-complete', name: 'Workflow Complete', templates: {
      form: '<workflow-step-summary workorder="workorder" workflow="workflow"></workflow-step-summary>',
      view: ''
    }}
  ]},

  { id: 1, title: 'App forms', steps: [
    {code: 'begin-workflow', name: 'Begin Workflow', templates: {
      form: '<workorder-list-item workorder="workorder"></workorder-view-item>',
      view: '<workorder-list-item workorder="workorder"></workorder-view-item>',
      portal: {
        view: '<workorder-portal-view workorder="workorder" workflow="workflow"></workorder-portal-view>'
      }
    }},
    {code: 'appform-step', name: 'Some Appform', formId: '5602dcbf212b52816d2ab9d8'},
    {code: 'workflow-complete', name: 'Workflow Complete', templates: {
      form: '<workflow-step-summary workorder="workorder" workflow="workflow"></workflow-step-summary>',
      view: ''
    }}
  ]},

  { id: 2, title: 'Mixed forms', steps: [
    {code: 'begin-workflow', name: 'Begin Workflow', templates: {
      form: '<workorder-list-item workorder="workorder"></workorder-view-item>',
      view: '<workorder-list-item workorder="workorder"></workorder-view-item>',
      portal: {
        view: '<workorder-portal-view workorder="workorder" workflow="workflow"></workorder-portal-view>'
      }
    }},
    {code: 'appform-step', name: 'Some Appform', formId: '5602dcbf212b52816d2ab9d8'},
    {code: 'risk-assessment', name: 'Risk Assessment', templates: {
      form: '<risk-assessment-form></risk-assessment-form>',
      view: '<risk-assessment value="workorder.steps[\'risk-assessment\'].submission"></risk-assessment>',
      portal: {
        view: '<risk-assessment-portal-view value="workorder.steps[\'risk-assessment\'].submission"></risk-assessment-portal-view>'
      }
    }},
    {code: 'vehicle-inspection', name: 'Vehicle Inspection', templates: {
      form: '<vehicle-inspection-form></vehicle-inspection-form>',
      view: '<vehicle-inspection value="workorder.steps[\'vehicle-inspection\'].submission"></vehicle-inspection>',
      portal: {
        view: '<vehicle-inspection-portal-view value="workorder.steps[\'vehicle-inspection\'].submission"></vehicle-inspection-portal-view>'
      }
    }},
    {code: 'workflow-complete', name: 'Workflow Complete', templates: {
      form: '<workflow-step-summary workorder="workorder" workflow="workflow"></workflow-step-summary>',
      view: ''
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
      mediator.publish('workflows:loaded', workflows);
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
