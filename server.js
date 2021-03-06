/*---------- DEPENDENCIES ----------*/
var express = require('express');
var app = express();
app.use(express.static('public'));

var bodyParser = require('body-parser');
var jsonParser = bodyParser.json();

/*---------- CONSTRUCTORS -----------*/

var Storage = function() {
    this.items = [];
    this.id = 0;
    this.users = [];
};

Storage.prototype.add = function(name) {
    var item = {
        name: name,
        id: this.id
    };
    this.items.push(item);
    this.id += 1;
    return item;
};

Storage.prototype.addByID = function(name, id) {
    var item = {
        name: name,
        id: id
    };
    this.items.push(item);
    return item;
};

Storage.prototype.addUser = function(body) {
    this.users.push(body);
    this.items = this.items.concat(body.items);
    return body;
};


var storage = new Storage();
storage.add('Broad beans');
storage.add('Tomatoes');
storage.add('Peppers');
storage.addUser({"username": "Joe", "items": [{"name": "Plantain", "id": 7 }]});

/*---------- GET REQUESTS ----------*/
app.get('/items', function(request, response) {
    response.status(200).json(storage.items);
});

app.get('/items/:id', function(request, response) {
    var item = storage.items[request.params.id];

    if (item) {
        return response.status(200).json(item);
    }
    response.sendStatus(404);
});

app.get('/users', function(request, response) {
    response.status(200).json(storage.users);
});

app.get('/users/:username/items', function(request, response) {
    // loop through the users array and if the requested username matches an existing username, returns the user's items array.
    for (var i = 0; i < storage.users.length; i++) {
        if (request.params.username === storage.users[i].username) {
            return response.status(200).json(storage.users[i].items);
        }
    }
    response.sendStatus(404);
});

/*---------- POST REQUESTS ----------*/
app.post('/items', jsonParser, function(request, response) {
    // screens for requests with empty arrays for their body and requests with empty strings set for 'name'.
    if (request.body == [] || request.body.name === "") {
        return response.sendStatus(400);
    }

    var item = storage.add(request.body.name);
    response.status(201).json(item);
});

app.post('/users', jsonParser, function(request, response) {
    // screens for requests with empty arrays for their body and requests with empty strings set for 'name'.
    if (request.body == [] || request.body.name === "") {
        return response.sendStatus(400);
    }

    var body = storage.addUser(request.body);
    response.status(201).json(body);
});

/*---------- DELETE REQUEST ----------*/
app.delete('/items/:id', function(request, response) {
    var id = request.params.id;

    // Ensures that requested id exists
    if (!storage.items[id]) {
        return response.sendStatus(404);
    }

    var item = storage.items[id];
    storage.items.splice(id, 1);
    response.status(200).json(item);
});

app.delete('/users/:username', function(request, response) {
    // loop through the users array and if the requested username matches an existing username, deletes the object for that user.
    for (var i = 0; i < storage.users.length; i++) {
        if (request.params.username === storage.users[i].username) {
            var user = storage.users[i];
            for (var j = 0; j < user.items.length; j++) {
                for(var k = 0; k < storage.items.length; k++) {
                    if(user.items[j].id === storage.items[k].id) {
                        storage.items.splice(k, 1);
                    }
                }
            }
            storage.users.splice(i, 1);
            return response.status(200).json(user);
        }
    }
    response.sendStatus(404);
});

/*---------- PUT REQUEST ----------*/
app.put('/items/:id', jsonParser, function(request, response) {
    var putID = parseInt(request.params.id);
    var putName = request.body.name;

// screens for requests with empty strings set for name
  if (putName !== "") {
    // loops through the items array and checks to see if there is an item for the requested id; if so, updates item name.
    for (var i = 0; i < storage.items.length; i++) {
        if (storage.items[i].id === putID) {
            storage.items[i].name = putName;
            return response.status(200).json(storage.items[i]);
        }
    }
    var item = storage.addByID(putName, putID);
    return response.status(201).json(item);
  }else {
    return response.sendStatus(400);
  }
});

app.put('/users/:username', jsonParser, function(request, response) {
    var putUserName = request.params.username;
    var bodyUserName = request.body.username;

    if(putUserName !== '') {
        for(var i = 0; i < storage.users.length; i++) {
            if(storage.users[i].username === putUserName) {
                storage.users[i].username = bodyUserName;
                return response.status(200).json(storage.users[i]);
            }
        }
    }
    return response.sendStatus(404);
});

app.listen(process.env.PORT || 8080);

exports.app = app;
exports.storage = storage;
