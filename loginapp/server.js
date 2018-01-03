var express= require('express');
var mongoose = require('mongoose');
var path =require('path');
var url= require('url');
var bodyparser= require('body-parser');
var app= express();
var temp={};
mongoose.connect('mongodb://localhost/loginapp');
//app.set('view engine','ejs');

var doctorSchema = new mongoose.Schema({
	email: String,
	password: String,
	department: String,
	patients:[]
});
var Doctor= mongoose.model('Doctor',doctorSchema);
app.listen(8000, function() {
    console.log('Listening on 8000');
});
//******Important***************//rs
app.use(express.static(__dirname + '/file'));     //serve static assets
app.get('*', function(req, res) {	
	if(req.path.startsWith('/signup') || req.path.startsWith('/login')){
	 temp={}
	 res.sendfile('./file/index.html'); // load the single view file (angular will handle the page changes on the front-end)   	
    }
	else if(req.path==='/userinfo')
	{
		res.json(temp)
	}
	else if(req.path==='/docinfo')
	{
		Doctor.find({},function(err,data){
			if(err)throw err
			else{res.json(data)}
		})
	}
	else
	{
		if(temp==undefined || temp.email==undefined)
		{
			res.redirect('/signuppatient')
		}
		else
		{
			res.sendfile('./file/index.html'); 
		}
	}
});

app.post('/signuppatient', function(req,res){
	console.log(req.query);
	temp=req.query
});

app.post('/signupdoctor',function(req,res){
	var data={email:req.query.email, password:req.query.password, department:req.query.department, patinets:[]}
	            Doctor(data).save(function(err){
	            if(err) throw err;
	            else{
		        console.log('Item Saved');
				data={};
				}
                }); 
});
