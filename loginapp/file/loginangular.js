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
    $scope.selected={patient:'', doctor:''};
	$scope.Cardiology=[]
	$scope.Opthamology=[]
	$scope.Physiology=[]
	$scope.department=[]
	$scope.doctors=[]
	$http.get("/userinfo")
                .then(function(response) {
                    $scope.selected.patient= response.data.email;// to get the email of the logged in patient from server
					$scope.data=response.data; //for all the additional information
                });
	$http.get("/docinfo")
                .then(function(response) {
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
                });
    $scope.setlist= function(k)
	{
		$scope.doctors=$scope.department[k]
	}
    				
   $scope.select=function(event)
	{
		//alert(event.target.id);
		$scope.selected.doctor=$scope.doctors[event.target.id].email;
		$http({
		method: 'POST',	
        url: 'http://localhost:8000/MainPage/take-appointment',
        params:$scope.selected
      }).then(function (httpResponse) {
        console.log('response:', httpResponse);
    });
}
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
