angular.module('geonameApp', ['ngRoute', 'ngAnimate', 'geonameLib'])
.run(['$rootScope', '$location', '$timeout', function($rootScope, $location, $timeout) {
    $rootScope.$on('$routeChangeError', function() {
        $location.path("/error");
    });
    $rootScope.$on('$routeChangeStart', function() {
        $rootScope.isLoading = true;
    });
     $rootScope.$on('$routeChangeSuccess', function() {
       $timeout(function() {
         $rootScope.isLoading = false;
       }, 1000);
     });
}])
.config(['$routeProvider', function($routeProvider){

$routeProvider
	.when('/', {
	    templateUrl : './views/home.html',
	    controller: 'HomeCtrl'
	})
	.when('/countries', {
	    templateUrl : './views/countries.html',
	    controller : 'CountriesCtrl',
	    resolve: {
	    	countries: ['geonameCountries', function(geonameCountries){
	    		return geonameCountries();
	    	}]
	    }
	})
	.when('/countries/:country', {
	    templateUrl : './views/country.html',
	    controller : 'CountryCtrl',
	    resolve: {
	    	countryInfo: ['$route', 'geonameCountry', function($route, geonameCountry){
	    		return geonameCountry($route.current.params.country);
	    	}]
	    }
	})
	.when('/error', {
	    template : '<p>Error Page: Not Found</p>'
	})
	.otherwise({
	  redirectTo : '/error'
  });

}])
.controller('HomeCtrl', ['$rootScope', '$timeout',
	function($rootScope, $timeout){
	  $timeout(function() {
	    $rootScope.isLoading = false;
	  }, 1000);
}])
.controller('CountriesCtrl', ['$scope', '$rootScope', '$location', 'countries',
	function($scope, $rootScope, $location, countries){
	$scope.order = 'countryName';
	$rootScope.isLoading = false;

	$scope.changeLocation = function(location){
		$location.path('/countries/'+location);
	}

	$scope.countries = countries.geonames;
		console.log($scope.countries);

}])
.controller('CountryCtrl', ['$scope', '$rootScope', '$route', 'countryInfo', 'geonameNeighbors', 'geonameCapital',
	function($scope, $rootScope, $route, countryInfo, geonameNeighbors, geonameCapital){
	$scope.country = countryInfo.geonames[0];
		console.log(countryInfo);
	$scope.isLoadingCount = 0;

	geonameNeighbors($route.current.params.country).then(function(data){
		$scope.neighbors = data.geonames;
		$scope.isLoadingCount++;
		if($scope.isLoadingCount == 2){ $rootScope.isLoading = false;
	}
	});

	geonameCapital($route.current.params.country).then(function(data){
		$scope.capital = data.geonames[0];
		$scope.isLoadingCount++;
		if($scope.isLoadingCount == 2) {$rootScope.isLoading = false;
	}
																											});

}]);
