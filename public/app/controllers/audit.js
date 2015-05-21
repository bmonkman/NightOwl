
/*
 * Controller to handle the view for the audit logs
 *
 * Authors:
 *		Nav Bhatti
 *		Casey Hammond
 *
 * Date: May 15th, 2015
 */
(function(){
app.controller('AuditController', function($scope, $http, audits) {
	
	// Reloads the audits based on the currently set filters
    $scope.filterAudits = function(){
        $scope.loadAudits();
    };

});
})();
