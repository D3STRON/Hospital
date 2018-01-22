var express =require('express')
var bcrypt = require('bcryptjs')
var passport = require('passport');
var jwt = require('jsonwebtoken')
var User =require('../models/userModel')
var Doctor= require('../models/doctorModel')

var router =express.Router()

router.get('*',function(req,res){
   res.sendfile('./angular/index.html')
})

router.post('/signup',function(req,res){
	var newUser=req.body
	newUser.medical_records=[]
	User.createNewUser(newUser)
	res.send(true)
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

router.post('/authenticator', passport.authenticate('jwt', {session:false}), 
(req, res, next) => {	
 if(req.body.doc==true){
  Doctor.find({},function(err,data){
		if(err)throw err
		else{
			res.json(data)
		}
	})
  }
  else{
	  User.findOne(req.body,function(err,data){
		  if(err) throw err
		  else{
			  res.json(data)
		  }
	  })
  }
});

router.post('/MainPage',passport.authenticate('jwt',{session:false}),
(req,res,next)=>{
   Doctor.findOne({email:req.body.doctor},function(err,data){
	   if(err) throw err
	   else{
           for(i=0;i<data.patients.length;i++)
		   {
			   if(data.patients[i]===req.body.patient)
			   {
			     return res.send(false)	   
			   }
		   }
		   data.patients.push(req.body.patient)
		   Doctor.createNewDoctor(data)
		   return res.send(true)
	   }
   })  
})

router.post('/signupdoctor',function(req,res){
	req.body.patients=[]
	Doctor.createNewDoctor(req.body)
	res.send(true)
})

router.post('/Add-Record',function(req,res){
	User.findOne({email:'Destron'},function(err,data){
		data.medical_records.push(req.body)
		data.password='hello'
		console.log(data)
		User.createNewUser(data)
		res.send(true)
	})
})

module.exports=router;