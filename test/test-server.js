var chai = require('chai');
var chaiHttp = require('chai-http');

global.environment = 'test';
var server = require('../server.js');
var Item = require('../models/item');
var seed = require('../db/seed');

var should = chai.should();
var app = server.app;

chai.use(chaiHttp);

describe('Shopping List', function() {
    before(function(done) {
        seed.run(function() {
            done();
        });
    });
    
    after(function(done) {
        Item.remove(function() {
            done();
        });
    });

    it('should list items on GET', function(done) {
        chai.request(app)
            .get('/items')
            .end(function(err, response) {
                response.should.have.status(200);
                response.should.be.json;
                response.body.should.be.a('array');
                response.body.should.have.length(3);                // 3 items in the seed data
                response.body[0].should.be.a('object');
                response.body[0].should.have.property('_id');
                response.body[0].should.have.property('name');
                response.body[0].name.should.be.a('string');
                response.body[0].name.should.equal('Broad beans');  // the 3 items in seed data, in order
                response.body[1].should.be.a('object');
                response.body[1].should.have.property('_id');
                response.body[1].should.have.property('name');
                response.body[1].name.should.be.a('string');
                response.body[1].name.should.equal('Tomatoes');
                response.body[2].should.be.a('object');
                response.body[2].should.have.property('_id');
                response.body[2].should.have.property('name');
                response.body[2].name.should.be.a('string');
                response.body[2].name.should.equal('Peppers');
                done();
            });
    });
    
    it('should add an item on POST', function(done) {
        chai.request(app)
            .post('/items')
            .send({'name': 'Beef'})
            .end(function(err, response) {
                should.equal(err, null);
                response.should.have.status(201);
                response.should.be.json;
                response.body.should.be.a('object');
                response.body.should.have.property('ADDED');
                response.body.ADDED.should.be.a('object');
                response.body.ADDED.should.have.property('_id');
                response.body.ADDED.should.have.property('name');
                response.body.ADDED.name.should.be.a('string');
                response.body.ADDED.name.should.equal('Beef');
                done();
            });
    });
    
    it('should edit an item on PUT',function(done) {        
        chai.request(app)
            .get('/items')                                 // get the items, get an id, pass it to the .send method
            .end(function(err,res) {
                chai.request(app)    
                    .put('/items/' + res.body[0]._id)
                    .send({'name':'Turkey'})      
                    .end(function(err,response) {
                        response.should.have.status(200);
                        response.should.be.json;
                        response.body.should.be.a('object');
                        response.body.should.have.property('UPDATED');
                        response.body.UPDATED.should.be.a('object');
                        response.body.UPDATED.should.have.property('_id');
                        response.body.UPDATED.should.have.property('name');
                        response.body.UPDATED.name.should.be.a('string');
                        response.body.UPDATED.name.should.equal('Turkey');
                        done();
                    });
            });
    });
    
    it('should delete an item on DELETE',function(done) {
        chai.request(app)
            .get('/items')
            .end(function(err,response){
                chai.request(app)
                    .delete('/items/' + response.body[2]._id)       // test by deleting the third[2] item - this gets its mongo _id
                    .end(function(err,response){
                        should.equal(err, null);  
                        response.should.have.status(200);
                        response.should.be.json;
                        response.body.should.be.a('object');
                        response.body.should.have.property('REMOVED');
                        response.body.REMOVED.should.be.a('object');
                        response.body.REMOVED.should.have.property('_id');
                        response.body.REMOVED.should.have.property('name');
                        response.body.REMOVED.name.should.equal('Peppers');
                        done();
                    });
            });
    }); 
    
    
});     // end describe callback