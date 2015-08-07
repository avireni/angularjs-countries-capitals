angular.module('geonameLib', [])
	.constant('GEONAME_API_BASEURL', 'http://api.geonames.org/')
	.constant('GEONAME_USERNAME', 'demo')

	.factory('geonameURL', ['$http', '$q', 'GEONAME_API_BASEURL', 'GEONAME_USERNAME',
						 function($http,   $q,   GEONAME_API_BASEURL,   GEONAME_USERNAME){

		return function(path, params){
			var params = params || {};
			params.username = GEONAME_USERNAME;
			params.type = 'JSON';
			var defer = $q.defer();
			$http.get(GEONAME_API_BASEURL + path,
				{
					params: params,
					cache: true
				})
				.success(function(data){
					defer.resolve(data);
				});
				return defer.promise;
			}

	}])
	.factory('geonameCountries', ['geonameURL',
							     function(geonameURL){
		return function(){
			return geonameURL('countryInfo');
		}

	}])

	.factory('geonameCountry', ['geonameURL',
							     function(geonameURL){
		return function(name){
			return geonameURL('countryInfo', {country: name});
		}

	}])

	.factory('geonameNeighbors', ['geonameURL',
							     function(geonameURL){
		return function(name){
			return geonameURL('neighbours', {country: name});
		}

	}])

	.factory('geonameCapital', ['geonameURL',
							     function(geonameURL){
		return function(name){
			return geonameURL('search', {country: name, featureCode: 'PPLC'});
		}

	}]);
