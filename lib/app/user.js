'use strict';

var _ = require('lodash');

var users = [
  {
    id: 156340,
    username: 'trever',
    name: 'Trever Smith',
    position: 'Senior Truck Driver',
    phone: '(265) 725 8272',
    email: 'trever@wfm.com',
    notes: 'Trever doesn\'t work during the weekends.',
    avatar: 'https://s3.amazonaws.com/uifaces/faces/twitter/kolage/128.jpg',
    banner: 'http://web18.streamhoster.com/pentonmedia/beefmagazine.com/TreverStockyards_38371.jpg'
  },
  {
    id: 546834,
    username: 'daisy',
    name: 'Daisy Dialer',
    position: 'Junior Dispatcher',
    phone: '(265) 754 8176',
    email: 'daisy@wfm.com',
    avatar: 'https://s3.amazonaws.com/uifaces/faces/twitter/madysondesigns/128.jpg'
  },
  {
    id: 122334,
    username: 'max',
    name: 'Max A. Million',
    position: 'Manager',
    phone: '(265) 716 3154',
    email: 'max@wfm.com',
    avatar: 'https://s3.amazonaws.com/uifaces/faces/twitter/davidburlton/128.jpg'
  },
  {
    id: 865435,
    username: 'phylis',
    name: 'Phylis Lexy',
    position: 'Phone Support',
    phone: '(265) 734 3446',
    email: 'phylis@wfm.com',
    avatar: 'https://s3.amazonaws.com/uifaces/faces/twitter/ladylexy/128.jpg'
  },
  {
    id: 373479,
    username: 'john',
    name: 'Johnny Fizall',
    position: 'Junior Truck Driver',
    phone: '(265) 721 1126',
    email: 'johnf@wfm.com',
    avatar: 'https://s3.amazonaws.com/uifaces/faces/twitter/jfkingsley/128.jpg',
  },
  {
    id: 235843,
    username: 'bill',
    name: 'Billy Baller',
    position: 'Junior Truck Driver',
    phone: '(265) 311 1527',
    email: 'billb@wfm.com',
    avatar: 'https://s3.amazonaws.com/uifaces/faces/twitter/peterme/128.jpg',
  },
  {
    id: 754282,
    username: 'sally',
    name: 'Sally Shorer',
    position: 'Junior Truck Driver',
    phone: '(265) 389 3496',
    email: 'sallys@wfm.com',
    avatar: 'https://s3.amazonaws.com/uifaces/faces/twitter/kfriedson/128.jpg',
  },
  {
    id: 994878,
    username: 'danny',
    name: 'Danny Doorman',
    position: 'Junior Truck Driver',
    phone: '(265) 447 2304',
    email: 'dannyd@wfm.com',
    avatar: 'https://s3.amazonaws.com/uifaces/faces/twitter/danbenoni/128.jpg',
  }
];

module.exports = function(mediator) {
  var topicList = 'user:list:load';
  console.log('Subscribing to mediator topic:', topicList);
  mediator.subscribe(topicList, function() {
    setTimeout(function() {
      mediator.publish('done:' + topicList, users);
    }, 0);
  });

  var topicLoad = 'user:load';
  console.log('Subscribing to mediator topic:', topicLoad);
  mediator.subscribe(topicLoad, function(id) {
    setTimeout(function() {
      var user = _.find(users, function(_user) {
        return _user.id == id;
      });
      mediator.publish('done:' + topicLoad + ':' + id, user);
    }, 0);
  });

  var topicSave = 'user:save';
  console.log('Subscribing to mediator topic:', topicSave);
  mediator.subscribe(topicSave, function(user) {
    setTimeout(function() {
      var index = _.findIndex(users, function(_user) {
        return _user.id == user.id;
      });
      users[index] = user;
      console.log('Saved user:', user);
      mediator.publish('done:' + topicSave + ':' + user.id, user);
    }, 0);
  });

  var topicCreate = 'user:create';
  console.log('Subscribing to mediator topic:', topicCreate);
  mediator.subscribe(topicCreate, function(user) {
    setTimeout(function() {
      user.id = users.length;
      users.push(user);
      console.log('Created user:', user);
      mediator.publish('done:' + topicCreate + ':' + user.createdTs, user);
    }, 0);
  });

}
