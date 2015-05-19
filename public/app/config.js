/*
 * NightOwl is a front-end dashboard for a RESTful facade to
 * a consul key/value store meant to be used for Dark Launch 
 * code administration by Hootsuite.
 * 
 * Authors: The Escape Characters
 * 		Nav Bhatti
 * 		Casey Hammond
 * 		Calvin Rempel
 *		Marc Vouve
 *
 * Date: May 15th, 2015
 *
 */

// Define the module and declare the config as a constant
var  app = angular.module('NightOwl', []).constant( 'API_CONFIG',{

	// URL of the NightOwl REST api
	"API_URL":"http://127.0.0.1",

	// id of the loading status indicator
	"loadingID" : "#loading",

	// Installation Type (staging vs production)
	"installation": {
		"name" : "production",
		"colour" : "red"
	},

	// List of restrictions. TODO: merge this with the metadata object
	"restrictions" : [
		"boolean",
		"member_list",
		"memberID",
		"percent"
	],

	// List of possible code filters
	"filters" : [
		"All",
		"Key",
		"Value",
		"Date",
		"Owner",
		"Description"
	],


	// Default filters that will be used on load
	"defaultFilters" : {
		"prefix" : "darklaunch",
		"dataCenter" : "dc1",
		"filterBy" : "All",
		"filter" : ""
	},

	// Metadata object, used to configure the restriction value inputs for code creation and editing
	"metadata" : {
		"restrictions":{
			"boolean":{"type":"select", "values":["true","false"]},
			"member_list":{"type":"text", "placeholder":"comma seperated list"},
			"memberID":{"type":"text"},
			"percent":{"type":"text", "placeholder":"between 0 and 100"}
		}
	},

	// Possible Data Center contexts
	"dataCenters": [
		{
			// Nicename of the datacenter
			"name": "Data Center 1",

			// Value sent in the REST api URL
			"value" : "dc1",

			// Available Prefixes in the datacenter
			"prefixes":{ 
				"darklaunch" : {
					"dashboard": {
						"core" : {},

						"api":{
							"1":{
								"ANDROID" : {},
								"APPLE" : {}
							},

							"2":{
								"ANDROID" : {},
								"APPLE" : {}
							}
						},

						"apiold":{}
					},

					"service":{
						"social-communication" : {}
					}
				}
			},
		},
		{"name": "Data Center 2", "value" : "dc2"},
		{"name": "Data Center 3", "value" : "dc3"}
	],

	// Possible filters for the audit list
	"auditFilters" : [
        "Last 24 Hours",
        "All",
        "User",
        "Code",
        "Message"
    ]
});
