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

// {force: true} property drops all tables create new
sequelize.sync({force: true}).then(function() {
	console.log('Every is synced');

	// insert into table
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
	});
});