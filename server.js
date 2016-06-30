var express = require('express');

var bodyParser = require('body-parser');

var Storage = function() {
    this.items = [];
    this.id = 0;
};

Storage.prototype.add = function(name) {
    var item = {name: name, id: this.id};
    this.items.push(item);
    this.id += 1;
    return item;
};

var storage = new Storage();
storage.add('Broad beans');
storage.add('Tomatoes');
storage.add('Peppers');

var jsonParser = bodyParser.json();

var app = express();
app.use(express.static('public'));

app.get('/items', function(request, response) {
    response.json(storage.items);
});

app.post('/items', jsonParser, function(request, response) {
	if (!request.body) {
		return response.sendStatus(400);
	}
	var item = storage.add(request.body.name);
	response.status(201).json(item);
});

app.delete('/items/:id', function(request, response) {
	var id = request.params.id
	
	if (!storage.items[id]) {
		return response.sendStatus(404);
	}

	var item = storage.items[id];
	storage.items.splice(id, 1);
	response.status(200).json(item);
});

app.put('/items/:id', jsonParser, function(request, response) {
	var id = request.params.id;
	var name = request.body.name;
		// console.log(id, "<--id");
		// console.log(name, "<--name");
		// console.log(!storage.items[id], "<--truthy?");
		// console.log(request.body, "<---request");
	if (!storage.items[id]) {
		storage.add(name); 
		response.status(201).json(name);
	}
});

app.listen(process.env.PORT || 8080);