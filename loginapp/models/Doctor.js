var mongoose = require('mongoose');
var Schema = mongoose.Schema;
var doctorSchema = new mongoose.Schema({
	email: String,
	password: String,
	department: String,
	patients:[]
});
var Doctor = mongoose.model('Doctor',doctorSchema);
module.exports = Doctor;