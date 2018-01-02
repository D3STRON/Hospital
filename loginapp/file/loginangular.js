var app = angular.module('loginangular',["ngRoute"]);
var users=[]
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
	$scope.data={};
	$scope.add= function()
	{
		users.push($scope.data);	
		$http({
		method: 'POST',	
        url: 'http://localhost:8000/signup',
        params:$scope.data
    }).then(function (httpResponse) {
        console.log('response:', httpResponse);
    });
		
	 $scope.data ={ };
	 $location.path( "/MainPage" );//for redirection from angular side
	};
});

app.controller('mainController',function($scope, $http,  $location){
   
		if(users.length==0){
		   $location.path( "/signup" );
		}
		else
		{
			$http({
		method: 'POST',	
        url: 'http://localhost:8000/'
    }).then(function (httpResponse) {
        console.log('response:', httpResponse);
    });
		}
});
