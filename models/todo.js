module.exports = function(sequelize, DataTypes){

return	sequelize.define('todo', {
		description: {
			type: DataTypes.STRING,
			allowNull: false,
			validate: {
				notEmpty: true   // empty string not allowed
			}
		},
		completed: {
			type: DataTypes.BOOLEAN,
			allowNull: false,
			defaultValue: false
		}
	});
};