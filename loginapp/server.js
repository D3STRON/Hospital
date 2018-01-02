var express= require('express');
var mongoose = require('mongoose');
var path =require('path');
var url= require('url');
var bodyparser= require('body-parser');
var app= express();
var temp={};
mongoose.connect('mongodb://localhost/loginapp');
//app.set('view engine','ejs');

var userSchema = new mongoose.Schema({
	email: String,
	password: String
});
var User= mongoose.model('User',userSchema);
app.listen(8000, function() {
    console.log('Listening on 8000');
});
//******Important***************//rs
app.use(express.static(__dirname + '/file'));     //serve static assets
app.get('*', function(req, res) {	
	if(req.path==='/signup'){
	 res.sendfile('./file/index.html'); // load the single view file (angular will handle the page changes on the front-end)   	
    }
	else if(req.path==='/userinfo')
	{
		res.json(temp)
	}
	else
	{
		if(temp==undefined || temp.email==undefined)
		{
			res.redirect('/signup')
		}
		else
		{
			res.sendfile('./file/index.html'); 
		}
	}
});

app.post('/signup', function(req,res){
	console.log(req.query);
	temp=req.query
});