/*
 * The main controller for the application. Loads the config file
 * an initializes necessary $scope objects. Contains implementation 
 * for loading both codes and audits so these function can be performed
 * on page transition.
 *
 * Dependencies:
 *  scope, $http: angular services
 *  API_CONFIG: configuration file
 *  auth: authentication service
 *  codes: dark launch code service
 *  audits: audit entries service
 *  loading: loading indicator service
 *
 * Author: Nav Bhatti
 * Date: May 15th, 2015 
 */

(function(){
	app.controller('MainController', function($scope, $http, API_CONFIG, auth, codes, audits, loading) {
		
        // Start on the login page
		$scope.selected = 'login';

        // Function called on load of the application. Iniitalizes relevant $scope variables
        function init(){
            // Load the config file
            $scope.config = API_CONFIG;

            // The create code interface should be hidden
            $scope.createMode = false;

            // All codes should start undeditable
            $scope.editMode = [];

            // The new code to be created
            $scope.newCode = {};

            // The list of prefixes for the given datacenter
            $scope.prefixes = [];

            // DataCenter currently selected
            $scope.dc = {};

            // Filters to apply to API requests
            $scope.filters = {};

            // Object representing the sorting of the Dark Launch Codes
            $scope.sort = {};

            // Set the datacenter to the first object in the config, will also attempt to load the codes
            $scope.setDataCenter($scope.config.dataCenters[0]);

            // Set the audit filters to default values
            $scope.auditFilters = {
                filterBy : $scope.config.auditFilters[0],
                filter : ''
            };

            // Load the audits on application load
            $scope.loadAudits();
        }

        // Loads the list of codes based on the currently set filters
        $scope.loadCodes = function(){

            // Show the loading indicator
            loading.start();

            // Load the list of codes using the service
            codes.load( $scope.filters )
            .success(function(data){
                // Populate the list of codes in the view
                listCodes(data.codes);
            })
            .error(function(data, status){
                // If the user's session has expired, reload the application
                if(status == 401 && $scope.selected !== "login") // HACK to prevent reload when on the login page
                    location.reload();
            })
            .finally(function(){
                loading.stop()
            });
        }

        // Loads the audits based on the currently set auditFilters
        $scope.loadAudits = function(){
            audits.load($scope.auditFilters, function(success, data){
                if(success){
                    // Set the list of audits in the view
                    $scope.auditList = data;
                } 
                // If the user's session has expired, reload the applcation
                else if( data === 401 ){
                    if ($scope.selected !== 'login')// HACK to prevent reload when on the login page
                        location.reload();
                }
            });
        }

        // Return's true if the passed view is currently being displayed
        $scope.isSelected = function(val) {
            return $scope.selected === val;
        }

        // Selects the view that will be displayed, and shows it using an animation
        $scope.selectTab = function(val) {
            // If the requested view is not being displayed
            if( $scope.selected != val ){
                // id of the element to slide up
                var oldElem = $("#" + $scope.selected);

                // id of the element to slide down
                var newElem = $("#" + val);

                // Begin the animation
                oldElem.slideUp(400, function(){
                    newElem.slideDown(400, function() {
                        if(val != "login"){
                            // If not moving to the login page, show the sidebar
                            $("#wrapper").removeClass("toggled");
                        }if( val == "audit" ){
                            // If moving to the audit page, load the audits
                            $scope.loadAudits();
                        }if( val == "list" && $scope.selected != "login" ){ // HACK to prevent two requests on application load
                            // If moving to the list page, load the codes
                            $scope.loadCodes();
                        }
                        // Set the selected view to the new view
                        $scope.selected = val;

                        // Apply any changes that have occured
                        $scope.$apply();
                    });
                });
            }
        }

        // Log out of the application
		$scope.logout = function(){
	    	auth.logout();
	    };

        // Sets the data center to the selected value and reloads the codes
        $scope.setDataCenter = function(dataCenter){
            $scope.dc = dataCenter;
            $scope.prefixes = buildList(dataCenter.prefixes);

            // Build the default filters
            $scope.filters = {
                dataCenter : dataCenter.value,
                filterBy : $scope.config.filters[0],
                prefix: $scope.prefixes[0],
                filter : ''
            };

            // Load the codes
            $scope.loadCodes();
        }

        // Resets the filters based on the current Data Center
        $scope.resetFilters = function(){
            if($scope.dc !== undefined)
                $scope.setDataCenter( $scope.dc );
            else
                $scope.setDataCenter( $scope.config.dataCenters[0] );
        }

        // Show the audits for the selected code
        $scope.showAudits = function(code){
            $scope.auditFilters.filterBy = "Code";
            $scope.auditFilters.filter = "^" + $scope.filters.prefix + "/" + code.key + "$";
            $scope.selectTab("audit");
        }

        // Builds the list of possible prefixes recursively
        function buildList(object, branch){
            var array = [];
            for(key in object){

                // If in the base of the tree
                if(!branch){
                    array.push(key)
                    if(!$.isEmptyObject(object[key]))
                        array = array.concat(buildList(object[key], key));
                }
                // Build the current branch recursively
                else{
                    array.push(branch + "/" + key);
                    if(!$.isEmptyObject(object[key]))
                        array = array.concat(buildList(object[key], branch + "/" + key));
                }

            }
            return array;
        }

        // Trims the prefix from the code's key field
        function trimKeys( codes ){
            for (var i = 0; i < codes.length; i++) {
                codes[i].key = codes[i].key.replace($scope.filters.prefix + "/", "");
				codes[i].hoursSinceChanged = parseInt(codes[i].hoursSinceChanged);
            }
            return codes;
        }

        // List the codes on the view and set the sorting to the default values
        function listCodes( codes ){
            if( codes.length > 0 ){
                $scope.sort.keys = Object.keys( codes[0] );
                $scope.sort.descending = "false";
                $scope.sort.type = $scope.sort.keys[0];
                $scope.launchCodes = trimKeys( codes );
            }else{
                $scope.launchCodes = [];
            }
            $scope.selectTab("list");
        }



        // Initialize the application
        init();


	});

})();
