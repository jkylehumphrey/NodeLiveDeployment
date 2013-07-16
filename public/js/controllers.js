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
  
  
