/*
 * Service to be used by controllers to interact with the api to retreive
 * the list of audits with the given filters applied. Contains logic to 
 * construct the endpoints to the api.
 * 
 * Authors:
 * 	Casey Hammond
 * 	Nav Bhatti
 *
 * Date: May 15th, 2015
 *
 */

(function(){
	app.factory('audits', function($http, API_CONFIG, auth, loading){

		// Set the base URL to the one defined in the config
		var URL = API_CONFIG.API_URL;

		var audits = {

			/*
			 * Retreive the list of audits
			 *
			 * Params: 
			 * 	filters:the object representing the filters to apply to the request.
			 *		{
			 *			filterBy: field to filter on
			 *			filter : {filter string}
			 *		}
			 *
			 *	_callback: the callback function.
			 *		will be passed (true, data) in the event of a success
			 *		will be passed (false, status) in the event of an error
			 *
			 */ 			
			load: function(filters, _callback){

				// Define the base endpoint
				var url = URL + '/audit/';

				var filter = encodeURIComponent(filters.filter);

				// Set the query string based on the filterBy string
		        if(filters.filterBy == 'User') {
		            url = url + '{"owner":{"$regex":"' + filter + '","$options":"-i"}}';
		        }
		        else if(filters.filterBy == 'Code') {
		            url = url + '{"code":{"$regex":"' + filter + '","$options":"-i"}}';
		        }
		        else if(filters.filterBy == 'Message') {
		            url = url + '{"message":{"$regex":"' + filter + '","$options":"-i"}}';
		        }
		        else if(filters.filterBy == 'All') {
                    url = url + '{"$or":[{"owner":{"$regex":"' + filter + '","$options":"-i"}},{"code":{"$regex":"' + filter + '","$options":"-i"}},{"message":{"$regex":"' + filter + '","$options":"-i"}}]}';
               	}
                else if(filters.filterBy == 'Last 24 Hours') {
                    var d = new Date();
                    var day = d.getDate();
                    d.setDate(day-1);
                    var date = d.toJSON();

                    url = url + '{"time":{"$gt":"' + date + '"}}';
                }

                // Indicate the application is loading
		        loading.start();

		        $http.get(url)
		        .success(function(data){
		        	_callback(true, data);
		        })
		    	.error(function(data, status){
		    		_callback(false, status);
		    	})
		        .finally(function() {
		        	// Stop loading indicator
                    loading.stop();
                });
		    }
		}

		return audits;
	});

}());
