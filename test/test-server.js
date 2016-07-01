var chai = require('chai');
var chaiHttp = require('chai-http');
var server = require('../server.js');
var should = chai.should();
var app = server.app;
var storage = server.storage;

chai.use(chaiHttp);

describe('Shopping List', function() {
    it('should list items on GET', function(done) {
        chai.request(app)
            .get('/items')
            .end(function(err, response) {
                should.equal(err, null);
                response.should.have.status(200);
                response.should.be.json;
                response.body.should.be.a('array');
                response.body.should.have.length(4);
                response.body[0].should.be.a('object');
                response.body[0].should.have.property('id');
                response.body[0].should.have.property('name');
                response.body[0].id.should.be.a('number');
                response.body[0].name.should.be.a('string');
                response.body[0].name.should.equal('Broad beans');
                response.body[1].name.should.equal('Tomatoes');
                response.body[2].name.should.equal('Peppers');
                done();
            });
    });

    it('should list item with given ID on GET', function(done) {
        chai.request(app)
            .get('/items/0')
            .end(function(err, response) {
                should.equal(err, null);
                response.should.have.status(200);
                response.should.be.json;
                response.body.should.be.a('object');
                response.body.should.have.property('id');
                response.body.should.have.property('name');
                response.body.id.should.be.a('number');
                response.body.name.should.be.a('string');
                response.body.name.should.equal('Broad beans');
                done();
            });

    });

    it('should list users on GET', function(done) {
        chai.request(app)
            .get('/users')
            .end(function(err, response) {
                should.equal(err, null);
                response.should.have.status(200);
                response.should.be.json;
                response.body.should.be.a('array');
                response.body.should.have.length(1);
                response.body[0].should.be.a('object');
                response.body[0].should.have.property('username');
                response.body[0].should.have.property('items');
                response.body[0].items.should.be.a('array');
                response.body[0].username.should.be.a('string');
                response.body[0].items[0].name.should.equal('Plantain');
                response.body[0].items[0].id.should.equal(7);
                response.body[0].username.should.equal('Joe');
                storage.items[3].name.should.equal('Plantain');
                done();
            });
    });

    it('should list user\'s items with username on GET', function(done) {
        chai.request(app)
            .get('/users/Joe/items')
            .end(function(err, response) {
                should.equal(err, null);
                response.should.have.status(200);
                response.should.be.json;
                response.body.should.be.a('array');
                response.body.should.have.length(1);
                response.body[0].should.be.a('object');
                response.body[0].should.have.property('name');
                response.body[0].should.have.property('id');
                response.body[0].name.should.be.a('string');
                response.body[0].id.should.be.a('number');
                response.body[0].name.should.equal('Plantain');
                response.body[0].id.should.equal(7);
                done();
            });
    });

    it('should add an item on POST', function(done) {
        chai.request(app)
            .post('/items')
            .send({
                'name': 'Kale'
            })
            .end(function(err, response) {
                should.equal(err, null);
                response.should.have.status(201);
                response.should.be.json;
                response.body.should.be.a('object');
                response.body.should.have.property('name');
                response.body.should.have.property('id');
                response.body.name.should.be.a('string');
                response.body.id.should.be.a('number');
                response.body.name.should.equal('Kale');
                storage.items.should.be.a('array');
                storage.items.should.have.length(5);
                storage.items[4].should.be.a('object');
                storage.items[4].should.have.property('id');
                storage.items[4].should.have.property('name');
                storage.items[4].id.should.be.a('number');
                storage.items[4].name.should.be.a('string');
                storage.items[4].name.should.equal('Kale');
                done();
            });
    });

    it('should add a user including items on POST', function(done) {
        chai.request(app)
            .post('/users')
            .send(
                {"username": "Chris", "items": [{"name": "Eggs", "id": 9}]}
            )
            .end(function(err, response) {
                should.equal(err, null);
                response.should.have.status(201);
                response.should.be.json;
                response.body.should.be.a('object');
                response.body.should.have.property('username');
                response.body.should.have.property('items');
                response.body.username.should.be.a('string');
                response.body.items.should.be.a('array');
                response.body.username.should.equal('Chris');
                response.body.items[0].name.should.equal('Eggs');
                response.body.items[0].id.should.equal(9);
                storage.items.should.have.length(6);
                storage.items[5].name.should.equal('Eggs');
                storage.items[5].id.should.equal(9);
                done();
            });
    });

    it('should edit an item on PUT', function(done) {
        chai.request(app)
            .put('/items/1')
            .send({
                'name': 'Kale'
            })
            .end(function(err, response) {
                should.equal(err, null);
                response.should.have.status(200);
                response.should.be.json;
                response.body.should.be.a('object');
                response.body.should.have.property('name');
                response.body.should.have.property('id');
                response.body.name.should.be.a('string');
                response.body.id.should.be.a('number');
                response.body.name.should.equal('Kale');
                storage.items.should.be.a('array');
                storage.items.should.have.length(6);
                storage.items[1].should.be.a('object');
                storage.items[1].should.have.property('id');
                storage.items[1].should.have.property('name');
                storage.items[1].id.should.be.a('number');
                storage.items[1].name.should.be.a('string');
                storage.items[1].name.should.equal('Kale');
                done();
            });
    });

    it('should add an item on PUT when ID is empty', function(done) {
        chai.request(app)
            .put('/items/10')
            .send({
                'name': 'Carrot'
            })
            .end(function(err, response) {
                should.equal(err, null);
                response.should.have.status(201);
                response.should.be.json;
                response.body.should.be.a('object');
                response.body.should.have.property('name');
                response.body.should.have.property('id');
                response.body.name.should.be.a('string');
                response.body.id.should.be.a('number');
                response.body.name.should.equal('Carrot');
                storage.items.should.be.a('array');
                storage.items.should.have.length(7);
                storage.items[6].should.be.a('object');
                storage.items[6].should.have.property('id');
                storage.items[6].should.have.property('name');
                storage.items[6].id.should.be.a('number');
                storage.items[6].name.should.be.a('string');
                storage.items[6].name.should.equal('Carrot');
                storage.items[6].id.should.equal(10);
                done();
            });
    });

    it('should add a user on PUT')


    it('should delete an item on DELETE', function(done) {
        chai.request(app)
            .delete('/items/1')
            .end(function(err, response) {
                should.equal(err, null);
                response.should.have.status(200);
                response.should.be.json;
                response.body.should.be.a('object');
                response.body.should.have.property('name');
                response.body.should.have.property('id');
                response.body.name.should.be.a('string');
                response.body.id.should.be.a('number');
                response.body.name.should.equal('Kale');
                storage.items.should.have.length(6);
                storage.items[1].id.should.equal(2);
                done();
            });
    });

    it('should delete a user on DELETE', function(done) {
        chai.request(app)
            .delete('/users/Joe')
            .end(function(err, response) {
                should.equal(err, null);
                response.should.have.status(200);
                response.should.be.json;
                response.body.should.be.a('object');
                response.body.should.have.property('username');
                response.body.should.have.property('items');
                response.body.username.should.be.a('string');
                response.body.items.should.be.a('array');
                response.body.username.should.equal('Joe');
                storage.items.should.have.length(5);
                storage.users.should.have.length(1);
                storage.users[0].username.should.equal('Chris');
                done();
            });
    });


});
