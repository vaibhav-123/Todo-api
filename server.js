var express = require('express');
var app = express();
var bodyParser = require('body-parser');

var PORT = process.env.PORT || 3000;

/*var todos = [{
	id: 1,
	descrption: "Lunch",
	completed: false
}, {
	id: 2,
	descrption: "Go to market",
	completed: false
}, {
	id: 3,
	descrption: "Homework",
	completed: true
}]*/

var todos = [];
var todoNextId = 1;

// When json request comes in express parse it to json & we can access req.body
app.use(bodyParser.json())

app.get('/', function(req, res) {
	res.send('Todo api root');
});

// Get all todo items
app.get('/todos',function (req, res) {
	res.json(todos);
})

// Get todo items of given id
app.get('/todos/:id',function (req, res) {
	
	var todoId = parseInt(req.params.id, 10);
	var flag = 0;

	for (var i = 0; i < todos.length; i++) {
		if(todos[i].id === todoId) {
        	res.json(todos[i]);    
        	flag = 1;
        	break;
		}
	}

	if (flag == 0) {
		res.status(404).send();
	}
})

// Add todo item using POST 
app.post('/todos',function (req, res){

	var body = req.body;
	body.id = todoNextId; 
	todos.push(body);
    todoNextId++;
	res.json(todos[todoNextId - 2]);
})

app.listen(PORT, function(){
	console.log('Express listening on port : ' + PORT + ' !');
});