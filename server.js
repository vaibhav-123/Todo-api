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
	
	// Without database
	/*var queryParams = req.query;
	var filteredTodos = todos;

	if(queryParams.hasOwnProperty('completed') && queryParams.completed === 'true') {

		filteredTodos = _.where(todos, {completed : true});

	} else if (queryParams.hasOwnProperty('completed') && queryParams.completed === 'false') {

		filteredTodos = _.where(todos, {completed : false});
	}

	if(queryParams.hasOwnProperty('q') && queryParams.q.length > 0) {

		filteredTodos = _.filter(filteredTodos, function(todo) {
			return todo.description.indexOf(queryParams.q) > -1;
		});
	} 	

	res.json(filteredTodos);*/

	// With database
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
	
	// without database
	/*var todoId = parseInt(req.params.id, 10);
	var matchedElement = _.findWhere(todos, {id : todoId});

	if (matchedElement) {
		res.json(matchedElement);        
	} else {
		res.status(404).send();
	}*/

	// With database
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
	
	// without database

	/*// .pick is used to access  completed & description fields
	body = _.pick(body, 'completed', 'description');

	if(!_.isBoolean(body.completed) || !_.isString(body.description) || body.description.trim().length === 0) {
		// Bad request
		res.status(400).send();
	} else {
		body.description = body.description.trim();
		body.id = todoNextId++; 
		todos.push(body);
		res.json(todos[todoNextId - 2]);
	}*/

	// with database
	console.log(body);
	db.todo.create(body).then(function(todo){
		res.json(todo.toJSON());
	},function(e){
		res.status(400).send();
	});
});

// DELETE /todos/:id
app.delete('/todos/:id', function (req, res){
	var todoId = parseInt(req.params.id, 10);
	var matchedElement = _.findWhere(todos, {id : todoId});

	if(matchedElement) {

		todos = _.without(todos, matchedElement);
		res.json(matchedElement);
	} else {
		res.status(404).send();
	}
});

// PUT /todos/:id
app.put('/todos/:id', function (req, res) {

	var todoId = parseInt(req.params.id, 10);
	var matchedElement = _.findWhere(todos, {id : todoId});
	var body = req.body;
	var validAttributes = {};

	if(!matchedElement) {
		return res.status(404).send();
	}

	if(body.hasOwnProperty('completed') && _.isBoolean(body.completed)){
		validAttributes.completed = body.completed;
	} else if (body.hasOwnProperty('completed')) {
		return res.status(400).send();
	}

	if(body.hasOwnProperty('description') && _.isString(body.description) && body.description.trim().length > 0){
		validAttributes.description = body.description;
	} else if (body.hasOwnProperty('description')) {
		return res.status(400).send();
	}
    
    // matched element gets modified
	_.extend(matchedElement, validAttributes);
	res.json(matchedElement);

});

db.sequelize.sync().then(function(){

	app.listen(PORT, function(){
		console.log('Express listening on port : ' + PORT + ' !');
	});	
});
