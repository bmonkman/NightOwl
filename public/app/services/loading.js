/*
 * Service to be used by other services or controllers to control
 * the loading indicator for the application. sets elements with
 * the .data class to be disabled while loading is in progess
 *
 * Author: Nav Bhatti
 *
 * Date: May 15th, 2015
 */
(function(){
	app.factory('loading', function(API_CONFIG){

		// Get the id of the loading element from the config.
		var id = API_CONFIG.loadingID

		var loading = {
			
			// Show the loading indicator and disable .data elements
			start: function(){
				$(id).fadeIn(400);
				$(".data").css({
					"opacity": '0.5',
					"pointer-events": 'none'
				});
			},

			// Indicate that the user's operation was a success
			success: function(){
				$(id).html("Success!");
			},

			// Reset the loading indicator and enable .data elements
			stop: function(){
				setTimeout(function(){
					$(id).fadeOut(400, function(){
						$(id).html("Loading...");
					});
				}, 1200);
				$(".data").css({
					"opacity": '1',
					"pointer-events": 'all'
				});
			}
		};

		
		return loading;
	});
}());