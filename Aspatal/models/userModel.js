var mongoose= require('mongoose')
var bcrypt= require('bcryptjs')
var Schema= mongoose.Schema

var userSchema={
  email: {
		type: String,
		index:true
	},
  password: String,
  medical_records:[],
  appointments:{
	  cardiology:[],
	  physiology:[],
	  opthamology:[]
  }
}

var User= mongoose.model('User', userSchema)


module.exports= User

module.exports.createNewUser= function(newUser){
	bcrypt.genSalt(10, function(err, salt) {
	    bcrypt.hash(newUser.password, salt, function(err, hash) {
	        newUser.password = hash
	        User(newUser).save(function(err){
				if(err)throw err
				else 
				{
					console.log('Item saved')
				}
			})
	    });
	});
}

module.exports.updateUser= function(updatedUser){
	        User(updatedUser).save(function(err){
				if(err)throw err
				else 
				{
					console.log('Item saved')
				}
			})
}

module.exports.getUserById = function(id, callback){
  User.findById(id, callback);
}

module.exports.getUserByUsername = function(email, callback){
  const query = {email: email}
  User.findOne(query, callback);
}

module.exports.comparePassword = function(candidatePassword, hash, callback){
  bcrypt.compare(candidatePassword, hash, (err, isMatch) => {
    if(err) throw err;
    callback(null, isMatch);
  });
}