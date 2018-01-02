var app = angular.module('loginangular',["ngRoute"]);

app.config(['$routeProvider','$locationProvider',function($routeProvider, $locationProvider){
  
   $routeProvider
        .when('/',{
           
        	redirectTo		: '/signup',
          
        })
        .when('/signup',{
           
        	templateUrl		: 'SignUpPage.html',
            controller 		: 'authController'
          
        })
         .when('/MainPage',{
           
        	templateUrl		: 'MainPage.html',
            controller      : 'mainController'
        })
        $locationProvider.html5Mode({
    enabled: true,
    requireBase: false
    });
}]);
app.controller('authController',function($scope, $http,  $location){
	$scope.data={email:'', password:''};
	$scope.add= function()
	{	
	if($scope.data.email.length>0 && $scope.data.password.length>0){
		$http({
		method: 'POST',	
        url: 'http://localhost:8000/signup',
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
   
   
    $http.get("/userinfo")
                .then(function(response) {
                    $scope.data= response.data.email;
					alert('Helo '+$scope.data);
                });
   
		$scope.logout= function()
		{
			$http({
		method: 'POST',	
        url: 'http://localhost:8000/signup',
        params:{}
      }).then(function (httpResponse) {
        console.log('response:', httpResponse);
    });
	$location.path( "/signup" )
		}
});
