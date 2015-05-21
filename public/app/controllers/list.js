/*
 * The controller that handles the listing and CRUD functions
 * of the dark launch codes. Uses the 'codes' service to communication
 * with the API.
 *
 * Dependencies:
 *  scope: angular scope service
 *  codes: dark launch code service
 *  loading: loading indicator service
 *
 * Author: Nav Bhatti
 * Date: May 15th, 2015 
 */
(function(){
app.controller('ListController', function($scope, loading, codes) {


        // Functions to handle edit mode for a given code
		$scope.editModeOn = function(index){
			$scope.editMode[index] = true;
		}
		$scope.editModeOff = function(index){
			$scope.editMode[index] = false;
		}
		$scope.inEditMode = function(index){
			return ($scope.editMode[index] !== undefined && $scope.editMode[index] != false);
		}

		// Saves the given code using the codes service
		$scope.saveCode = function(code){

            if( code.key !== undefined ){
            	loading.start();
				codes.save(code, $scope.filters)
	            .success(function(data){
	                loading.success();
	                $scope.loadCodes();
	            })
	            .error(function(data, status){
	                if(status == 401 && $scope.selected !== "login")
	                    location.reload();
	            })
	            .finally(function(){
	                loading.stop();
	            });
           }else
           		alert("The code must have a key!");
		}

		// Deletes the given code using the codes service
		$scope.deleteCode = function(code){
            var prompt = "Are you sure you wish to delete\n" + $scope.filters.prefix + "/" + code.key + "?";
			if( window.confirm( prompt ) ){
				loading.start();
                codes.remove(code, $scope.filters)
                .success(function(){
                    loading.success();
                    $scope.loadCodes();
                })
                .error(function(data, status){
                    if(status == 401 && $scope.selected !== "login")
                        location.reload();
                })
                .finally(function(){
                    loading.stop()
                });
            }
		}

		// Creates a code via the "saveCode" function and sets this code to an empty object
        $scope.createCode = function(code){
            $scope.saveCode(code)
            code = {}; 
            $scope.resetFilters();
            // Hide the creation dialog
            $scope.createMode = false;
        }

        // Discard the changes made to this code
		$scope.discardChanges = function(index){
			$scope.loadCodes();
			$scope.editModeOff(index);
		}

		// Set the value of the availableToJS property
		$scope.toggleJS = function(code){
			if(code.availableToJS == "false" || code.availableToJS === undefined){
				code.availableToJS = "true";
			}else{
				code.availableToJS = "false";
			}
		}

	});

})();
