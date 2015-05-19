/*
 * Service to be used by controllers to interact with the api to retreive
 * the list of Dark Launch Codes with the given filters applied. Contains logic to 
 * construct the endpoints to the api. This service returns the $http promise object
 *
 * Endpoints are constructed using a filter object:
 *		{
 *			filterBy: {field to filter on},
 *			filter: {string to filter on},
 *			dataCenter: {Data Center slug},
 *			prefix; {prefix to search or create within}
 *		}
 *
 * Codes are assumed to have the following fields at minimum:
 *		{
 *			key: {key field of the code (without prefix)},
 *			restriction: {the code's restriction type},
 *			value: {the value of the key's restriction},
 *			description: {the key's description},
 *			availableToJS: {"true" if the code is available to javascript, "false" otherwise (string values)}
 *		}
 * 
 * Author: Nav Bhatti
 * Date: May 15th, 2015
 *
 */
(function(){
	app.factory('codes', function($http, API_CONFIG, loading){

		// Set the base URL based on the config file. 
		var URL = API_CONFIG.API_URL

		// Constructs a URL to be used by an http GET request to the API.
		function getURL(filters){
			var url = URL + "/codes/" + filters.dataCenter;

			if( filters.prefix ){
				url = url + "/" + encodeURIComponent(filters.prefix);
			}

			if( filters.filterBy && filters.filter ){
				url = url + "/" + filters.filterBy + "/" + filters.filter;
			}

			return url;
		}

		// Constructs a URL to be used by an http GET request to the facade.
		function postURL(code, filters){
			return URL + "/codes/" + filters.dataCenter + "/" +  encodeURIComponent(code.key);
		}

		/*
		 * Cleans and validates a code object for creation or edit.
		 * Also adds the prefix onto the key to resolve the key's 
		 * fully qualified name.
		 */
		function sanitize( code, filters ){

			code.key = filters.prefix + "/" + code.key;

			code.restriction = code.restriction || 'boolean';

			code.value = code.value || "false";

			code.description = code.description || "";

			if(code.availableToJS !== undefined && code.availableToJS !== "false"){
				code.availableToJS = 'true';
			}else{
				code.availableToJS = 'false';
			}

			return code;
		}

		var codes = {

			/*
			 * Saves the code using the the prefix name in the filter.
			 *
			 * Returns a promise object representing the POST request to the API
			 */
			save : function(code, filters){
				code = sanitize(code, filters);

				var url = postURL(code, filters);

				return $http.post(url, code);
			},


			/*
			 * Loads the list of codes with the given filters
			 *
			 * Returns a promise object representing the GET request to the API
			 */
			load : function(filters){
				var url = getURL(filters);

				return $http.get( url );
			},

			/*
			 * Deletes a given code from the database using the prefix name in the filter.
			 *
			 * Returns a promise object representing the DELETE request to the API 
			 */
			remove : function( code, filters){
				code = sanitize(code, filters);
				var url = postURL(code, filters);

				return $http.delete( url );
			}
		};


		return codes;
	});
}());
