'use strict';

/* Controllers */

/*
angular.module('myApp.controllers', []).
  controller('AppCtrl', function ($scope, socket) {
    socket.on('send:name', function (data) {
      $scope.name = data.name;
    });
  }).
  controller('MyCtrl1', function ($scope, socket) {
    socket.on('send:time', function (data) {
      $scope.time = data.time;
    });
  }).
  controller('MyCtrl2', function ($scope) {
    // write Ctrl here
  });
  
*/
  function ChecklistController($scope){
  
  window.scope = $scope;
  
  	$scope.checklistItems = [{id: 0, title: 'AgriMine', completed: true}, {id: 1, title: 'MDM', completed:false}];
  	
  	$scope.percentCompleted = function(){
  		return (_.where($scope.checklistItems, {completed:true}).length / ($scope.checklistItems.length * 1.0)) * 100;
  	}
  	
  	$scope.itemCompleted = function(item){
  		console.log(item);
  		item.completed = !item.completed;
  	}
  	
}
  
function ChatCtrl($scope, socket){
	 // Socket listeners
  // ================

  socket.on('init', function (data) {
    $scope.name = data.name;
    $scope.users = data.users;
    $scope.messages = data.messages;
  });

  socket.on('send:message', function (message) {
    $scope.messages.push(message);
  });

  socket.on('user:join', function (data) {
    $scope.messages.push({
      user: 'chatroom',
      text: 'User ' + data.name + ' has joined.'
    });
    $scope.users.push(data.name);
  });

  // add a message to the conversation when a user disconnects or leaves the room
  socket.on('user:left', function (data) {
    $scope.messages.push({
      user: 'chatroom',
      text: 'User ' + data.name + ' has left.'
    });
    var i, user;
    for (i = 0; i < $scope.users.length; i++) {
      user = $scope.users[i];
      if (user === data.name) {
        $scope.users.splice(i, 1);
        break;
      }
    }
  });
  
  // Methods published to the scope
  // ==============================


  $scope.sendMessage = function () {
    socket.emit('send:message', {
      message: $scope.message
    });

    // add the message to our model locally
    $scope.messages.push({
      user: $scope.name,
      text: $scope.message
    });

    // clear message box
    $scope.message = '';
  };

	
}
  
  
