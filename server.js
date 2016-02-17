var express = require('express');
var app = express();
var bodyParser = require('body-parser');
var db = require('./db.js');
var _ = require('underscore');

var PORT = process.env.PORT || 3000;
var todos = [];
var todoNextId = 1;

// When json request comes in express parse it to json & we can access req.body
app.use(bodyParser.json())

app.get('/', function(req, res) {
	res.send('Todo api root');
});

// GET /todos (Get all todo items)
// Query parameters
app.get('/todos',function (req, res) {
	
	var queryParams = req.query;
	var where = {};

	if(queryParams.hasOwnProperty('completed') && queryParams.completed === 'true') {
		where.completed = true;
	} else if (queryParams.hasOwnProperty('completed') && queryParams.completed === 'false') {

		where.completed = false;
	}

	if(queryParams.hasOwnProperty('q') && queryParams.q.length > 0) {

		where.description = {
			$like: '%' + queryParams.q + '%'
		};
	}
	db.todo.findAll({
		where: where
	}).then(function(todos){

		res.json(todos);
	}, function(e){
		res.status(500).send();
	});
});

// GET /todos/:id (Get todo items of given id)
app.get('/todos/:id',function (req, res) {
	
	var todoId = parseInt(req.params.id, 10);
	db.todo.findById(todoId).then(function(todo){
		if(todo) {
			res.json(todo.toJSON());	
		} else {
			res.status(404).send();
		}		
	}, function(e){
		res.status(500).send();
	});	
});

// POST /todos (Add todo item using POST) 
app.post('/todos',function (req, res){
	
	var body = req.body;
	db.todo.create(body).then(function(todo){
		res.json(todo.toJSON());
	},function(e){
		res.status(400).send();
	});
});

// DELETE /todos/:id
app.delete('/todos/:id', function (req, res){
	
	var todoId = parseInt(req.params.id, 10);
	db.todo.destroy({
	   where: {
	      id: todoId //this will be your id that you want to delete
	   }
	}).then(function(rowDeleted){ // rowDeleted will return number of rows deleted	
	   	console.log(rowDeleted);
	   	if(rowDeleted === 0){
	   		res.status(404).send();
   		} else {
   			res.status(200).send();  
   		}	 	
	}, function(e){
	    res.status(500).send(); 
	});
});

// PUT /todos/:id
app.put('/todos/:id', function (req, res) {

	var todoId = parseInt(req.params.id, 10);
	var body = req.body;
	var attributes = {};

	if(body.hasOwnProperty('completed')){
		attributes.completed = body.completed;
	} 
	if(body.hasOwnProperty('description')){
		attributes.description = body.description;
	} 
    
    db.todo.findById(todoId).then(function(todo){
    	if(todo) {
   			// call to another promise
    		todo.update(attributes).then(function(todo){
	    	
		    	res.json(todo.toJSON());	   
		    },function(e) {
		    	res.status(400).json(e);
		    });
    	} else {
    		res.status(404).send();
    	}
    },function(e) {
    	res.status(500).send();
    });
});

// POST /users (Add user using POST) 
app.post('/users',function (req, res){
	
	var body = _.pick(req.body, 'email', 'password');

	db.user.create(body).then(function(user){
		res.json(user.toPublicJSON());
	},function(e){
		res.status(400).json(e);
	});
});

db.sequelize.sync().then(function(){

	app.listen(PORT, function(){
		console.log('Express listening on port : ' + PORT + ' !');
	});	
});
