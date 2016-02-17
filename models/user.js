var crypto = require('crypto');
var randomString = require("randomstring");
var _ = require('underscore');

module.exports = function(sequelize, DataTypes) {

return	sequelize.define('user', {
		email: {
			type: DataTypes.STRING,
			allowNull: false,
			unique: true,
			validate: {   
				isEmail: true
			}
		},
		salt: {
			type: DataTypes.STRING
		},
		password_hash: {
			type: DataTypes.STRING
		},
		password: {
			type: DataTypes.VIRTUAL,
			allowNull: false,
			validate: {
				len:[7, 50]  
			},
			set: function(value){		 
			    var salt = randomString.generate(10);
				var hmac = crypto.createHmac('sha256', salt);
				hmac.update(value);
				var hashedPassword = hmac.digest('hex');
				this.setDataValue('password', value);
				this.setDataValue('salt', salt);
				this.setDataValue('password_hash', hashedPassword);
			}
		}
	}, {
		hooks: {
			beforeValidate: function(user, options){
				
				if(typeof user.email === 'string') {
					user.email = user.email.toLowerCase(); 
				}	
			}
		},
		instanceMethods: {
			toPublicJSON: function() {
				var json = this.toJSON();
				return _.pick(json, 'id', 'email', 'createdAt', 'updatedAt');
			}
		}
	});
};	