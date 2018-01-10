var express =require('express')
var bcrypt = require('bcryptjs')
var passport = require('passport');
var jwt = require('jsonwebtoken')
var User =require('../models/userModel')
var Doctor= require('../models/doctorModel')

var router =express.Router()

router.get('/signup',function(req,res){
   res.sendfile('./angular/index.html')
})

router.get('/login', function(req,res){
	res.sendfile('./angular/index.html')
})

router.get('/MainPage',function(req,res){
	res.sendfile('./angular/index.html')
})

router.get('/signupdoctor',function(req,res){
	res.sendfile('./angular/index.html')
})

router.post('/signup',function(req,res){
	var newUser= req.body
	User.createNewUser(newUser)
})

router.post('/authenticate',function(req,res){
	   const email = req.body.email
	   const password = req.body.password
	   User.getUserByUsername(email,function(err, user){
		   if(err)throw err
		   if(!user){
			   return res.json({success: false, msg: 'User not found'})
		   }
		   
		   User.comparePassword(password, user.password ,function(err, isMatch){//compare the encrypted password
			   if(err) throw err;
			   if(isMatch){
				   const token = jwt.sign({data: user}, 'Secret', {
                         expiresIn: 604800 // 1 week
                   });
				res.json({//the response sent when user found in database
					success: true,
					token:'JWT '+token,
					user: {
						id: user._id,
						email: user.email
					}
				})   
			   }else{
				  return res.json({success: false, msg: 'Wrong password'}) 
			   }
		   })
	   })
})

router.get('/authenticator', passport.authenticate('jwt', {session:false}), 
(req, res, next) => {
  Doctor.find({},function(err,data){
		if(err)throw err
		else{
			res.json(data)
		}
	})
});

router.post('/signupdoctor',function(req,res){
	req.body.patients=[]
	Doctor.createNewDoctor(req.body)
	res.send(true)
})

module.exports=router;