/*
 * Service to be used by controllers to authenticate users
 *
 * Author: Nav Bhatti
 * Date: May 15th, 2015
 *
 */
(function(){
	app.factory('auth', function($http, API_CONFIG, loading){
		var URL = API_CONFIG.API_URL;

		var auth = {

			/*
			 * Attempts to log in a user using a username and password
			 *
			 * Params:
			 *	user: username to be passed to the API
			 * 	pw: password to be passed to the API
			 *
			 *	_callback: function callback after promise is resolved.
			 * 		returns true on success, false on failure
			 */
			login: function(user, pw, _callback){
				var url = URL + '/auth/login';

				loading.start();
				$http.post( url, {name:user, pass:pw} )
		        .success(function(data) {
		            _callback(true);
		        })
		        .error(function() {
		        	_callback(false)
		        })
		        .finally(function(){
		        	loading.stop();
		        });
			},

			/*
			 * Logs out a currently logged in user. Attempts to 
			 * delete the session using the API. Reloads the 
			 * application on success.
			 *
			 */
			logout: function(){
				var url = URL + '/auth/logout';

				loading.start();
				$http.delete( url )
				.success(function(data){
					location.reload(true);
				})
				.finally(function(data){
					loading.stop();
				});

			},
		};


		return auth;
	});
}());
