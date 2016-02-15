var express = require('express');
var app = express();
var PORT = process.env.PORT || 3000;

var todos = [{
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
}]

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

app.listen(PORT, function(){
	console.log('Express listening on port : ' + PORT + ' !');
});