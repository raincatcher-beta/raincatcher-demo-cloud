/**
* CONFIDENTIAL
* Copyright 2016 Red Hat, Inc. and/or its affiliates.
* This is unpublished proprietary source code of Red Hat.
**/
'use strict';

var ArrayStore = require('fh-wfm-mediator/lib/array-store')

var workflows = [
  { id: 1337, title: 'Static forms', steps: [
    {code: 'risk-assessment', name: 'Risk Assessment', templates: {
      form: '<risk-assessment-form></risk-assessment-form>',
      view: '<risk-assessment value="result.submission"></risk-assessment>'
    }},
    {code: 'vehicle-inspection', name: 'Vehicle Inspection', templates: {
      form: '<vehicle-inspection-form></vehicle-inspection-form>',
      view: '<vehicle-inspection value="result.submission"></vehicle-inspection>'
    }}
  ]},

  { id: 1338, title: 'App forms', steps: [
    {code: 'identification', name: 'Identification', formId: '56c1fce7c0a909d74e823317'},
    {code: 'signoff', name: 'Signoff', formId: '56bdf252206b0cba6f35837b'}
  ]},

  { id: 1339, title: 'Mixed forms', steps: [
    {code: 'signoff', name: 'Sign-off Workorder', formId: '56bdf252206b0cba6f35837b'},
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
  var arrayStore = new ArrayStore('workflows', workflows);
  arrayStore.listen('cloud:', mediator);
}
