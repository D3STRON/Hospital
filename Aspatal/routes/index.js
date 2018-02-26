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
			console.log(req.body.user_email)
			var temp=[]
			for(i=0;i<data.length;i++){
				var flag=1
				for(j=0;j<data[i].patients.length;j++){
					if(data[i].patients[j]===req.body.user_email)
					{
					   flag=0
					   break;
					}
				}
				if(flag==1){
					temp.push({email:data[i].email,department:data[i].department})
				}
			}
			res.json(temp)
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
           for(i=0;i<data.patients.length;i++)//if a patient clicks tries to take appointment of a doctor whose appointment he already has but the page isnt refreshed so the take appointment option is still available
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
	//console.log(req.body)
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

router.post('/Doctor-Updates',function(req,res){
	console.log(req.body)
   Doctor.findOne({email:req.body.email},function(err,data){
	   if(data!=null){
		   bcrypt.compare(req.body.password, data.password, (err, isMatch) => {
              if(err) throw err
              else if(isMatch){
				  data.target=req.body.target
				  Doctor.createNewDoctor(data)
				  res.json({user:'Found'})
			  }
			  else{
				  res.json({user:'Not Found'})
			  }
            });
	    }
		else{
		  res.json({user:'Not Found'})
		}
   })
})

module.exports=router;