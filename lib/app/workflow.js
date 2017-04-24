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
  { id: "B1r71fOBr", title: 'Risk Assessment Form', steps: [
    {code: 'risk-assessment', name: 'Risk Assessment', templates: {
      form: '<risk-assessment-form></risk-assessment-form>',
      view: '<risk-assessment value="result.submission"></risk-assessment>'
    }}
  ]},
  { id: "SyVXyMuSr", title: 'Vehicle Inspection Form', steps: [
    {code: 'vehicle-inspection', name: 'Vehicle Inspection', templates: {
      form: '<vehicle-inspection-form></vehicle-inspection-form>',
      view: '<vehicle-inspection value="result.submission"></vehicle-inspection>'
    }}
  ]}
];

module.exports = function(mediator) {
  return store.init('workflows', workflows, mediator);
};
