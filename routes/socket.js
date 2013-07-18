var underscore = require('underscore');
// Keep track of which names are used so that there are no duplicates
var userNames = (function () {
  var names = {};

  var claim = function (name) {
    if (!name || names[name]) {
      return false;
    } else {
      names[name] = true;
      return true;
    }
  };

  // find the lowest unused "guest" name and claim it
  var getGuestName = function () {
    var name,
      nextUserId = 1;

    do {
      name = 'Guest ' + nextUserId;
      nextUserId += 1;
    } while (!claim(name));

    return name;
  };

  // serialize claimed names as an array
  var get = function () {
    var res = [];
    for (user in names) {
      res.push(user);
    }

    return res;
  };

  var free = function (name) {
    if (names[name]) {
      delete names[name];
    }
  };

  return {
    claim: claim,
    free: free,
    get: get,
    getGuestName: getGuestName
  };
}());

var chatMessages = (function(){
	var messages = [];
	
	var get = function(){
		return messages;
	};
	
	var add = function(newMessage){
		messages.push(newMessage);
	};
	
	return {
    	get: get,
    	add: add
  	};
	
}());

var checklist = (function(){
	
	var items = [{id: 0, title: 'AgriMine', completed: false}, 
				{id: 1, title: 'MDM', completed:false},
				{id: 2, title: 'AgriMine Reports', completed:false},
				{id: 3, title: 'GSR', completed:false},
				{id: 4, title: 'Sales Management', completed:false},
				{id: 5, title: 'MDM', completed:false},
				{id: 6, title: 'MDM', completed:false},
				{id: 7, title: 'MDM', completed:false},
				{id: 8, title: 'MDM', completed:false},
				{id: 9, title: 'MDM', completed:false},
				{id: 10, title: 'MDM', completed:false},
				{id: 11, title: 'MDM', completed:false},
				{id: 12, title: 'MDM', completed:false},
				{id: 13, title: 'MDM', completed:false},
				{id: 14, title: 'MDM', completed:false},
				{id: 15, title: 'MDM', completed:false},
				{id: 16, title: 'MDM', completed:false},
				{id: 17, title: 'MDM', completed:false}
				
	];
	
	var getItems = function(){
		return items;
	};
	
	var completeItem = function(item){
		var item = underscore.findWhere(items, {id: item.id});
		item.completed = !item.completed;
	}
	return{
		getItems: getItems,
		completeItem: completeItem
	}
	
}());

// export function for listening to the socket
module.exports = function (socket) {
  var name = userNames.getGuestName();

  // send the new user their name and a list of users
  socket.emit('init:chat', {
    name: name,
    users: userNames.get(),
    messages: chatMessages.get()
  });

  // notify other clients that a new user has joined
  socket.broadcast.emit('user:join', {
    name: name
  });

  // broadcast a user's message to other users
  socket.on('send:message', function (data) {
  
  	var newMessage = {
      user: name,
      text: data.message
    };
    
    socket.broadcast.emit('send:message', newMessage);
    chatMessages.add(newMessage);
    
  });

  // clean up when a user leaves, and broadcast it to other users
  socket.on('disconnect', function () {
    socket.broadcast.emit('user:left', {
      name: name
    });
    userNames.free(name);
  });
  
  // checklist
  socket.on('checklist:itemCompleted', function(item){
  	checklist.completeItem(item);
  	socket.broadcast.emit('checklist:itemCompleted', checklist.getItems());
  });
  
  // send the new user their name and a list of users
  socket.emit('init:checklist', {
    checklistItems: checklist.getItems()
  });

};