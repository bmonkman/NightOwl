var API_HELPER = (function () {
	var instance;

	function createInstance() {
		var helper = {

			API_URL : NIGHTOWL_CONFIG.API_URL,

			getToken : function(){
				return localStorage.getItem("key");
			},

			saveCode : function( code, _callback, filters ){
				var url = this.makePostURL(code);
				this.startLoading(null);
				$.post(url, code).success(function(data, status, headers, config) {
					console.log("saved!");
					console.log(url);
					API_HELPER.loadCodes( _callback, filters );
				})
			  .always(function() {
			    API_HELPER.stopLoading(null);
			  });
			},

			deleteCode : function( code, _callback, filters ){
				this.startLoading(null);
				$.ajax({
					url: this.makePostURL(code),
					type: 'delete',
					success: function(result) {
						console.log("deleted!");
						API_HELPER.loadCodes( _callback, filters );
					}
				})
			  .always(function() {
			    API_HELPER.stopLoading(null);
			  });
			},

			makeGetURL : function( filters ){
				var url = this.API_URL + "/codes/" + this.getToken() + "/" + filters.dc;
				if( filters.prefix ){
					url = url + "/" + filters.prefix;
				}
				if( filters.filterBy ){
					url = url + "/" + filters.filterBy + "/" + filters.filter;
				}
				return url;
			},

			loadCodes : function( _callback, filters ){

				if( !filters ){
					filters = { dc : "dc1" };
				}

				var url = this.makeGetURL(filters);
				//var url = "app/codes.json";

				this.startLoading(null);
				$.getJSON(url, function(json, textStatus) {
					console.log(url);
					console.log(json);
					_callback(json.codes);
				})
			  .always(function() {
			    API_HELPER.stopLoading(null);
			  });
			},

			login : function(user, pw, _callback){
				var url = this.API_URL + '/login/' + user + '/' + pw;
				$.getJSON(url, function(data) {
					_callback(data);
				});
			},

			makePostURL : function( code ){
				return this.API_URL + "/codes/" + this.getToken() + "/" + encodeURIComponent(code.key);
			},

			// Save Token
			saveToken : function(result){
				localStorage.setItem("key", result.key);
			},

			deleteToken : function(){
				localStorage.removeItem("key");
			},

			startLoading : function(element){
				console.log("START LOADING");
			},

			stopLoading : function(element){
				console.log("STOP LOADING");
			}
		};

		return helper;
	}

	if( !instance )
		instance = createInstance();

	return instance;
})();

