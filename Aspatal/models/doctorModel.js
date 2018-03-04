var mongoose = require('mongoose');
var bcrypt= require('bcryptjs')
var Schema = mongoose.Schema;
var doctorSchema = new mongoose.Schema({
	email: String,
	password: String,
	department: String,
	target: Number,
	patients:[]
});
var Doctor = mongoose.model('Doctor',doctorSchema);
module.exports = Doctor;

module.exports.createNewDoctor =function(newDoctor){
	bcrypt.genSalt(10, function(err, salt) {
	    bcrypt.hash(newDoctor.password, salt, function(err, hash) {
	        newDoctor.password = hash;
	Doctor(newDoctor).save(function(err){
		if(err)throw err
        else{
			console.log('New Doctor added')
		}
	  })
   });
});
}

module.exports.updateDoctor =function(updatedDoctor){
	
	Doctor(updatedDoctor).save(function(err){
		if(err)throw err
        else{
			console.log('New Doctor added')
		}
	  })
   
}

