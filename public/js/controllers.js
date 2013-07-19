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
function LoginController($scope) {
//    $document.ready(function () {
//        $('#myModal').modal('show');
//    });

}

function ChecklistController($scope, socket) {

    $scope.$on('$includeContentLoaded', function () {
        alert("blah");
    });

    window.scope = $scope;

    $scope.checklistItems = [];

    $scope.percentCompleted = function () {
        return (_.where($scope.checklistItems, { completed: true }).length / ($scope.checklistItems.length * 1.0)) * 100;
    }

    $scope.itemCompleted = function (item) {
        socket.emit('checklist:itemChecked', {item: item, user: $scope.name});
        item.completed = !item.completed;
    }

    socket.on('init:checklist', function (data) {
        $scope.checklistItems = data.checklistItems;
    });

    socket.on('checklist:updateChecklist', function (items) {
    alert('yes');
        $scope.checklistItems = items;
    });

}

function ChatCtrl($scope, socket) {
    // Socket listeners
    // ================

    socket.on('init:chat', function (data) {
        $scope.name = data.name;
        $scope.users = data.users;
        $scope.messages = data.messages;
    });

    socket.on('send:message', function (message) {
        $scope.messages.push(message);
    });

    socket.on('user:join', function (data) {
        $scope.users.push(data.name);
    });

    // add a message to the conversation when a user disconnects or leaves the room
    socket.on('user:left', function (data) {
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
  
  
