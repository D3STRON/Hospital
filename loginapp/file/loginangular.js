var app = angular.module('loginangular',["ngRoute"]);

app.config(['$routeProvider','$locationProvider',function($routeProvider, $locationProvider){
  
   $routeProvider
        .when('/',{
           
        	redirectTo		: '/signuppatient'
            
        })
		.when('/signupdoctor',{
			templateUrl     : './views/DocSignUpPage.html',
			controller      : 'docsignupController'
			
		})
		.when('/loginpatient',{
           
        	templateUrl		: './views/LoginPage.html',
            controller      : 'loginController'
        })
        .when('/signuppatient',{
           
        	templateUrl		: './views/SignUpPage.html',
            controller 		: 'singinController'
          
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

app.controller('singinController',function($scope, $http,  $location){
	$scope.data={email:'', password:''};
	$scope.add= function()
	{	
	if($scope.data.email.length>0 && $scope.data.password.length>0){
		$http({
		method: 'POST',	
        url: 'http://localhost:8000/signuppatient',
        params:$scope.data
    }).then(function (httpResponse) {
        console.log('response:', httpResponse);
    });
		
	 $scope.data ={email:'', password:''};
	 $location.path( "/MainPage" );//for redirection from angular side
	}
	};
});

app.controller('mainController',function($scope, $http,  $location){
    $scope.selected={email:''};
	$scope.select=function(event)
	{
		//alert(event.target.id);
		$scope.selected.email=event.target.id;
	}
	
	$http.get("/userinfo")
                .then(function(response) {
                    $scope.data= response.data.email;
                });
	$http.get("/docinfo")
                .then(function(response) {
                    $scope.doctors= response.data;
                });			
   
		$scope.logout= function()
		{
			$http({
		method: 'POST',	
        url: 'http://localhost:8000/signuppatient',
        params:{}
      }).then(function (httpResponse) {
        console.log('response:', httpResponse);
    });
	$location.path( "/signuppatient" )
		}
});

app.controller('loginController',function($scope ,$http){
	$scope.data={email:'',password:''}
})

app.controller('docsignupController',function($scope, $http){
	$scope.data={email:'',password:'', department:''}
	$scope.add= function()
	{  
		$http({
		method: 'POST',	
        url: 'http://localhost:8000/signupdoctor',
        params:$scope.data
        }).then(function (httpResponse) {
        console.log('response:', httpResponse);
        });
		$scope.data={email:'',password:'', department:''}
	}	
})
