var app = angular.module('loginangular',["ngRoute"]);

app.config(['$routeProvider','$locationProvider',function($routeProvider, $locationProvider){
  
   $routeProvider
        .when('/',{
           
        	redirectTo		: '/login'
            
        })
		.when('/Login-Doctor',{
           
        	templateUrl		: './views/LoginDoctor.html',
			controller      : 'docloginController'
            
        })
		.when('/Add-Record',{
			templateUrl     : './views/addRecord.html',
			controller      : 'addrecordController'
		})
		.when('/signupdoctor',{
			templateUrl     : './views/DocSignUpPage.html',
			controller      : 'docsignupController'
			
		})
		.when('/login',{
           
        	templateUrl		: './views/LoginPage.html',
            controller      : 'loginController'
        })
        .when('/signup',{
           
        	templateUrl		: './views/SignUpPage.html',
            controller 		: 'singupController'
          
        })
         .when('/MainPage',{
           
        	templateUrl		: './views/MainPage.html',
            controller      : 'mainController'
        })
		.when('/ViewRecords',{
           
        	templateUrl		: './views/ViewRecords.html',
            controller      : 'viewrecordController'
        })
        $locationProvider.html5Mode({
    enabled: true,
    requireBase: false
    });
}]);

app.controller('singupController',function($scope, $http,  $location){
	$scope.data={}
	$scope.add= function()
	{
		$http.post('/signup',$scope.data)
		$location.path('/login')
		$scope.data={}
	}
});

app.controller('mainController',function($scope, $http,  $location, $window){
  $scope.Cardiology=[]
	$scope.Opthamology=[]
	$scope.Physiology=[]
	$scope.department=[]
	$scope.doctors=[]
	$scope.currentdept
   $http({
	   method: 'POST',
	   url: '/authenticator',
	   data:{getdoclist: true,user: JSON.parse($window.localStorage.getItem('user'))},//this is possibile only if the method:'POST' is used or else data cnat be sent to the back end by method: 'GET', 
	   headers:{
		   'Content-type':'application/json',
		   'Authorization':$window.localStorage.getItem('id_token')
	   }
    }).then (function (response){
		$scope.selected={patient:JSON.parse($window.localStorage.getItem('user')).email, doctor:''};
		for( i=0; i<response.data.length;i++)
					{
						if(response.data[i].department==='Opthamology')
						{
							$scope.Opthamology.push(response.data[i]);
						}
						else if(response.data[i].department==='Physiology')
						{
							$scope.Physiology.push(response.data[i]);
						}else
					    {
		                    $scope.Cardiology.push(response.data[i]);
						}	
					}//list of all the doctors
                    $scope.department.push($scope.Cardiology)
                    $scope.department.push($scope.Opthamology)	
                    $scope.department.push($scope.Physiology)
	}).catch(function(err)
	{
		if(err.status==401)
		{
           $location.path('/login')
		}
	})
   
   $scope.gotorecords= function(){
	   $location.path('/ViewRecords')
   }
   
   $scope.setlist= function(k)
	{
		$scope.currentdept=k
		$scope.doctors=$scope.department[$scope.currentdept]
	}
   
   $scope.select= function(event){
	   $scope.selected.doctor=$scope.doctors[event.target.id].email
	   $scope.doctors.splice(event.target.id,0)
	   $scope.department[$scope.currentdept].splice(event.target.id,1)
	   $http({
		   method:'POST',
		   url:'/MainPage',
		   data:$scope.selected,
		   headers:{
			   'Content-type':'application/json',
			   'Authorization':$window.localStorage.getItem('id_token')
		   }
	   }).catch(function(err){
		   if(err.status==401)
		   {
			   $location.path('login')
		   }
	   })
   }
   
   $scope.logout= function()
   {
	 $window.localStorage.clear()
	 $location.path('/login')
   }
});

app.controller('loginController',function($scope ,$http ,$location, $window){
	$scope.data={}
	$scope.add= function()
	{
		$http({
			method:'POST',
			url:'/authenticate',
			data: $scope.data,
			headers: {'Content-type':'application/json'}
		}).then(function(response){
			if(response.data.success)
			{
				$window.localStorage.setItem('id_token',response.data.token);// inportant how to store data to local storage press f12 and drop down local storage in application tab
				$window.localStorage.setItem('user',JSON.stringify(response.data.user));
				$location.path('/MainPage')
			}
			else
			{
				alert('Invalid username or password')
			}
		})
		$scope.data={}
	}
})

app.controller('docsignupController',function($scope, $http){
	$scope.data={email:'',password:'', department:'',target:0}
	$scope.add= function()
	{  
		$http.post('/signupdoctor',$scope.data)
		$scope.data={email:'',password:'', department:'',target:0}
	}	
})

app.controller('viewrecordController',function($scope,$http,$location,$window){
	$scope.currentdept=[]
	$scope.currentrecords=[]
	$scope.deptyears=[]
	$scope.deptrecords=[]
	$scope.ca_records=[]
	$scope.op_records=[]
	$scope.ph_records=[]
	$scope.ca_years=[]
	$scope.op_years=[]
	$scope.ph_years=[]
	$scope.patient
	$scope.key
	$http({
		url:'/authenticator',
		method:'POST',
		data:{user:JSON.parse($window.localStorage.getItem('user'))},
		headers:{
			'Content-type':'application/json',
			'Authorization':$window.localStorage.getItem('id_token')
		}
	}).then(function(res){
		$scope.patient=JSON.parse($window.localStorage.getItem('user')).email
		for(i=0;i<res.data.medical_records.length;i++)
		{   
            var temp=res.data.medical_records[i]; 
            if(temp.department==='Opthamology')
			{
				//console.log('op')
				$scope.op_records.push(temp)
				if($scope.op_years.length==0 || $scope.op_years[$scope.op_years.length-1].year!=temp.year)
				{
					$scope.op_years.push({year:temp.year, department:1})
				}
				console.log($scope.op_years[$scope.op_years.length-1].year)
			}
            else if(temp.department==='Physiology')
            {
				$scope.ph_records.push(temp)
				if($scope.ph_years.length==0 || $scope.ph_years[$scope.ph_years.length-1].year!=temp.year)
				{
					$scope.ph_years.push({year:temp.year, department:2})
				}
			}
            else if(temp.department==='Cardiology')
            {
				$scope.ca_records.push(temp)
				if($scope.ca_years.length==0 || $scope.ca_years[$scope.ca_years.length-1].year!=temp.year)
				{
					$scope.ca_years.push({year:temp.year, department:0})
				}
			}				
		}
		$scope.deptyears.push($scope.ca_years)
		$scope.deptyears.push($scope.op_years)
		$scope.deptyears.push($scope.ph_years)
		$scope.deptrecords.push($scope.ca_records)
		$scope.deptrecords.push($scope.op_records)
		$scope.deptrecords.push($scope.ph_records)
	}).catch(function(err)
	{
		if(err.status==401)
		{
           $location.path('/login')
		}
	})
	
	$scope.setdept=function(k)
	{
		$scope.currentrecords=[]
		$scope.currentdept=$scope.deptyears[k]
	}
	
	$scope.select=function(event)
	{
		$scope.currentrecords=[]
		$scope.key=JSON.parse(event.target.id)
		console.log($scope.key)
		for(i=0;i<$scope.deptrecords[$scope.key.department].length;i++)
		{
			if($scope.deptrecords[$scope.key.department][i].year==$scope.key.year)
			{
				$scope.currentrecords.push($scope.deptrecords[$scope.key.department][i])
			}
		}
	}
	
	$scope.gotoMainPage= function(){
		$location.path('/MainPage')
	}
	
	$scope.logout= function(){
		$window.localStorage.clear()
	     $location.path('/login')
	}
})

app.controller('addrecordController',function($scope,$http,$location, $window){
	$scope.date=''
	$scope.record={year:'',date:'',diagnosis:'',medication:'',department:''}
	$scope.patients=[]
	
	$http({
		url:'/authenticator',
		method:'POST',
		data:{getdocinfo:true,email:$window.localStorage.getItem('Doc_email')},
		headers:{
			'Content-type':'application/json',
			'Authorization':$window.localStorage.getItem('Doc_token')
		}
	}).then(function(res){
		$scope.patients=res.data.patients
	}).catch(function(err)
	{
		if(err.status==401)
		{
           $location.path('/Login-Doctor')
		}
	})
	$scope.push=function(){
		if($scope.date.length==0){
			alert('input date')
		}
		else{	
		    $scope.record.year=$scope.date.getFullYear()
            $scope.record.date=$scope.date.getDate()+"-"+getMonthinWords($scope.date.getMonth())	
            console.log($scope.record)			
			$http({
			method:'POST',
			url:'/Add-Record',
			data:$scope.record
		})
		}
	}
})

app.controller('docloginController',function($scope,$http,$window,$location){
	$scope.data={email:'',password:'',target:0}
	$scope.add= function(){
		$http({
		url:'/Doctor-Updates',
		method:'POST',
		data:$scope.data
	 }).then(function(res){
		if(res.data.user==='Found'){
			$window.localStorage.setItem('Doc_email',$scope.data.email)
			$window.localStorage.setItem('Doc_token',res.data.token)
			$location.path('/Add-Record')
		}
		else{
			alert('Invalid Username or Password')
		}
	 })
	}
})

var getMonthinWords= function(i)
{
	var month = new Array();
month[0] = "January";
month[1] = "February";
month[2] = "March";
month[3] = "April";
month[4] = "May";
month[5] = "June";
month[6] = "July";
month[7] = "August";
month[8] = "September";
month[9] = "October";
month[10] = "November";
month[11] = "December";
  return month[i]
}