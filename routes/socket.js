var underscore = require('underscore');
// Keep track of which names are used so that there are no duplicates
var userNames = (function () {

	var userObj = require('./users.json');
	var czarId = userObj.czarId;
	var users = userObj.users;
	
	var getById = function(id){
		return _.findWhere(users, {id: id});
	};
	
	var logInByEmail = function(email){
		var user = underscore.findWhere(users, {email:email});
		if(user){
			user.loggedIn = true;
			return true;
		}
		else
			return false;
	};
	
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
} ());

var chatMessages = (function () {
    var messages = [];

    var get = function () {
        return messages;
    };

    var add = function (newMessage) {
        messages.push(newMessage);
    };

    return {
        get: get,
        add: add
    };

} ());

var checklist = (function () {

    var items = require('./checklist.json');

    var getItems = function () {
        return items;
    };

    var completeItem = function (item, user) {
        var item = underscore.findWhere(items, { id: item.id });
        item.completed = !item.completed;
        item.modBy = user;
        item.modAt = new Date();
    }
    return {
        getItems: getItems,
        completeItem: completeItem
    }

} ());

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
    socket.on('checklist:itemChecked', function (data) {
        checklist.completeItem(data.item, data.user);
        socket.emit('checklist:updateChecklist', checklist.getItems());
    });

    // send the new user their name and a list of users
    socket.emit('init:checklist', {
        checklistItems: checklist.getItems()
    });

};