angular.module('app').controller('viewrecordController',function($scope,$http,$location,$window){
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
		data:{email:JSON.parse($window.localStorage.getItem('user')).email},
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
            $scope.redord.date=$scope.date.getDate()+"-"+getMonthinWords($scope.date.getMonth())	
            console.log($scope.record)			
			$http({
			method:'POST',
			url:'/Add-Record',
			data:$scope.record
		})
		}
	}
})