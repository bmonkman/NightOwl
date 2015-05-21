// Tests here

describe('Night Owl', function() {

  // Angular Controller service needed to instantiate a controller
  var $controller, config;

  // Load the module
  beforeEach(module('NightOwl'));

  beforeEach(inject(function(_$controller_, _API_CONFIG_){
    // The injector unwraps the underscores (_) from around the parameter names when matching
    $controller = _$controller_;
    config = _API_CONFIG_;
  }));

  describe("The Config File", function(){
    it('should have an API URL', function(){
      expect(config.API_URL).toBeDefined();
    });

    it('should have an installation', function(){
      expect(config.installation.name).toBeDefined();
      expect(config.installation.colour).toBeDefined();
    });

    it('should have a list of restrictions', function(){
      expect(config.restrictions).toBeDefined();
    });

    it('should have an ID for a loading indicator', function(){
      expect(config.loadingID).toBeDefined();
    });

    it('should have a list of filters for codes and audits', function(){
      expect(config.filters).toBeDefined();
      expect(config.auditFilters).toBeDefined();
    });

    it('should have a list of data centers', function(){
      expect(config.dataCenters).toBeDefined();
    });

  });



  describe('The Main Controller', function() {

    var dc = {
      // Nicename of the datacenter
      "name": "Data Center 1",

      // Value sent in the REST api URL
      "value" : "dc1",

      // Available Prefixes in the datacenter
      "prefixes":{ 
        "darklaunch" : {
          "dashboard": {
            "core" : {},
            "apiold":{}
          },

          "service":{
            "social-communication" : {}
          }
        }
      }
    };

    var prefixList = [
      "darklaunch",
      "darklaunch/dashboard",
      "darklaunch/dashboard/core",
      "darklaunch/dashboard/apiold",
      "darklaunch/service",
      "darklaunch/service/social-communication"
    ];

    var $scope, controller;

    beforeEach(function() {
      $scope = {};
      controller = $controller('MainController', { $scope: $scope });
    });


    it('should start on the login page', function() {
      expect($scope.selected).toEqual('login');
      expect($scope.isSelected('login')).toEqual(true);
    });

    it('should set the data center on the scope', function(){
      $scope.setDataCenter(dc);
      expect($scope.dc).toEqual(dc);
    });

    it('should build a list of prefixes', function(){
      $scope.setDataCenter(dc);
      expect($scope.prefixes).toEqual(prefixList);
    });

    it('should set the filters', function(){
      $scope.setDataCenter(dc);
      expect($scope.filters.dataCenter).toEqual(dc.value);
      expect($scope.filters.prefix).toEqual(prefixList[0]);
    });


  });

  describe('The List Controller', function() {
    var $scope, controller;

    beforeEach(function() {
      $scope = {};
      controller = $controller('ListController', { $scope: $scope });
    });

    it('should toggle the availableToJS property', function(){
      var code = {availableToJS: "false"};
      $scope.toggleJS(code);
      expect(code.availableToJS).toEqual("true");

      code = {availableToJS: "true"};
      $scope.toggleJS(code);
      expect(code.availableToJS).toEqual("false");

      code = {availableToJS: undefined};
      $scope.toggleJS(code);
      expect(code.availableToJS).toEqual("true");
    });

  });

  describe('The Audit Controller', function() {
    var $scope, controller, $http, urlTest;
      var url = config.API_URL + '/audit/';

    beforeEach(function() {
        $scope = {};
        urlTest = '';
        controller = $controller('AuditController', { $scope: $scope });
    });

      it('should filter audits by last 24 hours on default', function(){
          expect($scope.filterBy).toEqual('Last 24 Hours');
      });

      it('should filter audits by owner', function() {
          $scope.filterBy = 'Owner';
          $scope.filter = 'test';
          urlTest = url + '{"' + $scope.filterBy + '":{"$regex":"' + $scope.filter + '","$options":"-i"}}';
          expect($http.get(url)).toBeTruthy();
      });
      it('should filter audits by code', function() {
          $scope.filterBy = 'Code';
          $scope.filter = 'test';
          urlTest = url + '{"'+ $scope.filterBy +'":{"$regex":"' + $scope.filter + '","$options":"-i"}}';
          expect($http.get(url)).toBeTruthy();
      });
      it('should filter audits by message', function() {
          $scope.filterBy = 'Message';
          $scope.filter = 'test';
          urlTest = url + '{"' + $scope.filterBy + '":{"$regex":"' + $scope.filter + '","$options":"-i"}}';
          expect($http.get(url)).toBeTruthy();
      });
      it('should filter audits by all', function() {
          $scope.filterBy = 'All';
          $scope.filter = 'test';
          urlTest = url + '{"$or":[{"owner":{"$regex":"' + $scope.filter + '","$options":"-i"}},{"code":{"$regex":"' + $scope.filter + '","$options":"-i"}},{"message":{"$regex":"' + $scope.filter + '","$options":"-i"}}]}';
          expect($http.get(url)).toBeTruthy();
      });

  });

    describe('The Login Controller', function() {
        var $scope, controller;

        beforeEach(function() {
            $scope = {};
            controller = $controller('LoginController', { $scope: $scope });
        });

        it('should login and move to list page', function(){
            $scope.login('dave','test');
            expect($scope.selected).toEqual('list');
        });

        it('should fail login and stay on login page', function(){
            $scope.login('dude','test');
            expect($scope.selected).toEqual('login');
        });

        it('should fail login and move to login page', function(){
            $scope.logout();
            expect($scope.selected).toEqual('login');
        });

    });

});