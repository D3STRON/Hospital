var app = angular.module('loginangular',["ngRoute"]);

app.config(['$routeProvider','$locationProvider',function($routeProvider, $locationProvider){
  
   $routeProvider
        .when('/',{
           
        	redirectTo		: '/login'
            
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
   $scope.selected={patient:JSON.parse($window.localStorage.getItem('user')).email, doctor:''};
	$scope.Cardiology=[]
	$scope.Opthamology=[]
	$scope.Physiology=[]
	$scope.department=[]
	$scope.doctors=[]
   $http({
	   method: 'GET',
	   url: '/authenticator',
	   headers:{
		   'Content-type':'application/json',
		   'Authorization':$window.localStorage.getItem('id_token')
	   }
    }).catch(function(err)
	{
		if(err.status==401)
		{
           $location.path('/login')
		}
	}).then(function(response){
		//$scope.doctors=response.data
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
	})
   
   $scope.setlist= function(k)
	{
		$scope.doctors=$scope.department[k]
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
	$scope.data={email:'',password:'', department:''}
	$scope.add= function()
	{  
		$http.post('/signupdoctor',$scope.data)
		$scope.data={email:'',password:'', department:''}
	}	
})
