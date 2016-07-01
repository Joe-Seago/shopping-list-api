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
                response.body.should.have.length(3);
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

    it('should add an item on post', function(done) {
    	chai.request(app)
            .post('/items')
            .send({'name': 'Kale'})
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
                storage.items.should.have.length(4);
                storage.items[3].should.be.a('object');
                storage.items[3].should.have.property('id');
                storage.items[3].should.have.property('name');
                storage.items[3].id.should.be.a('number');
                storage.items[3].name.should.be.a('string');
                storage.items[3].name.should.equal('Kale');
                done();
            });
    });
    it('should edit an item on put', function(done) {
        chai.request(app)
            .put('/items/1')
            .send({'name': 'Kale'})
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
                storage.items.should.have.length(4);
                storage.items[1].should.be.a('object');
                storage.items[1].should.have.property('id');
                storage.items[1].should.have.property('name');
                storage.items[1].id.should.be.a('number');
                storage.items[1].name.should.be.a('string');
                storage.items[1].name.should.equal('Kale');
                done();
            });
    });
    it('should add an item on put when ID is empty', function(done) {
        chai.request(app)
            .put('/items/10')
            .send({'name': 'Carrot'})
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
                storage.items.should.have.length(5);
                storage.items[4].should.be.a('object');
                storage.items[4].should.have.property('id');
                storage.items[4].should.have.property('name');
                storage.items[4].id.should.be.a('number');
                storage.items[4].name.should.be.a('string');
                storage.items[4].name.should.equal('Carrot');
                storage.items[4].id.should.equal(10);
                done();
            });
    });
    it('should delete an item on delete');
});
