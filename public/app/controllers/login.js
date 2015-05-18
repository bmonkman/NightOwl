/*
 * Controller that handles the login page of the application
 *
 * Dependencies:
 *  scope, $http: angular services
 *  auth: authentication service
 *
 * Author: Nav Bhatti
 * Date: May 15th, 2015 
 */

(function(){
app.controller('LoginController', function($scope, $http, auth) {

    // Function to handle the login action
    $scope.loginHandler = function(success){
      if(success){
        $scope.loadCodes();
        $scope.selectTab("list")
      }
      else {
          alert("Invalid Login");
      }
    };

    // Function called when the login button is clicked
    $scope.login = function(user, pw) {
        auth.login(user,pw, $scope.loginHandler)
    };


});
})();
