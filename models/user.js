var crypto = require('crypto');
var cryptojs = require('crypto-js');
var jwt = require('jsonwebtoken');
var randomString = require("randomstring");
var _ = require('underscore');

module.exports = function(sequelize, DataTypes) {

var user = sequelize.define('user', {
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
		classMethods: {
			authenticate: function(body){
				return new Promise(function(resolve, reject){

					if(typeof body.email === 'string' && typeof body.password === 'string') {
 		
				 		user.findOne({
				 			where: {
				 				email: body.email
				 			}
				 		}).then(function(user){

				            if(!user) {
				            	return reject();
				            }  

				            // create hash of password
				            var secret = user.salt;    
							var hash = crypto.createHmac('sha256', secret).update(body.password).digest('hex');
										
				 			if(hash === user.password_hash){
				 				return resolve(user);
				 			} else {
				 				return reject();
				 			}
				 		},function(e) {
				 			return reject();
				 		});

					} else {
						return reject();
					}
				})		
			}
		},
		instanceMethods: {
			toPublicJSON: function() {
				var json = this.toJSON();
				return _.pick(json, 'id', 'email', 'createdAt', 'updatedAt');
			},
			generateToken: function(type){
				if(!_.isString(type)) {
					return undefined;
				}

				try {
					// create jwt
					var stringData = JSON.stringify({id: this.get('id'), type: type});
					var encryptedData = cryptojs.AES.encrypt(stringData, 'abc123').toString();

					var token = jwt.sign({
						token: encryptedData
					}, 'qwerty098');
					return token;

				} catch (err) {
					return undefined;
				}
			}
		}
	});

	return user;
};	