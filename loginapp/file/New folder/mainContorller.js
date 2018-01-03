
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