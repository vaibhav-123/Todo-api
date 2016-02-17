var Sequelize = require('sequelize');
var sequelize = new Sequelize(undefined, undefined, undefined, {
	'dialect': 'sqlite',
	'storage': __dirname + '/basic-sqlite-database.sqlite'
});

// Create modal (table)
var Todo = sequelize.define('todo', {
	description: {
		type: Sequelize.STRING,
		allowNull: false,
		validate: {
			notEmpty: true   // empty string not allowed
		}
	},
	completed: {
		type: Sequelize.BOOLEAN,
		allowNull: false,
		defaultValue: false
	}
});

var User = sequelize.define('user', {
	email: Sequelize.STRING
})

Todo.belongsTo(User);
User.hasMany(Todo);
// {force: true} property drops all tables create new
sequelize.sync({force: true}).then(function() {
	
	console.log('1st call..........................');
	
	User.create({
		email: "vr@example.com"	
	}).then(function(){
		return Todo.create({
			description: 'Feed the dog',
			completed: false
		})
	}).then(function(todo){
		User.findById(1).then(function(user){
				user.addTodo(todo);
				User.findById(1).then(function(user){
			
				user.getTodos().then(function(todos){
					todos.forEach(function(todo){
						console.log(todo.toJSON());
					})
				});	
			})
		})
	});

    console.log('2nd call..........................');
	

	/*// insert into table
	Todo.create({
		description: 'Feed the dog'
		//completed: false
	}).then(function(){

		return Todo.create({
			description: 'Clean room'
		})
		//console.log('Finished');
		//console.log(todo);
	}).then(function(){
		//return Todo.findById(1);
		return Todo.findAll({
			where: {
				completed: false
			}
		})
	}).then(function(todos){
		if(todos) {
			todos.forEach(function(todo){
				console.log(todo.toJSON());
			})
		} else {
			console.log('No todo found');
		}
	}).catch(function(e){
		console.log(e);
	});*/
});