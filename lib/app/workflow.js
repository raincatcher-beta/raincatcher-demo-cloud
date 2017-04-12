'use strict';

var store = require('../storage/storage-init');

var workflows = [
  { id: "HJ8QkzOSH", title: 'Static forms', steps: [
    {code: 'risk-assessment', name: 'Risk Assessment', templates: {
      form: '<risk-assessment-form></risk-assessment-form>',
      view: '<risk-assessment value="result.submission"></risk-assessment>'
    }},
    {code: 'vehicle-inspection', name: 'Vehicle Inspection', templates: {
      form: '<vehicle-inspection-form></vehicle-inspection-form>',
      view: '<vehicle-inspection value="result.submission"></vehicle-inspection>'
    }}
  ]},

  { id: "B1r71fOBr", title: 'App forms', steps: [
    {code: 'identification', name: 'Identification', formId: '56c1fce7c0a909d74e823317'},
    {code: 'signoff', name: 'Signoff', formId: '56bdf252206b0cba6f35837b'}
  ]},

  { id: "SyVXyMuSr", title: 'Mixed forms', steps: [
    {code: 'signoff', name: 'Sign-off Workorder', formId: '56bdf252206b0cba6f35837b'},
    {code: 'risk-assessment', name: 'Risk Assessment', templates: {
      form: '<risk-assessment-form></risk-assessment-form>',
      view: '<risk-assessment value="result.submission"></risk-assessment>'
    }},
    {code: 'vehicle-inspection', name: 'Vehicle Inspection', templates: {
      form: '<vehicle-inspection-form></vehicle-inspection-form>',
      view: '<vehicle-inspection value="result.submission"></vehicle-inspection>'
    }}
  ]}
];

module.exports = function(mediator) {
  store.init('workflows', workflows, mediator);
};
