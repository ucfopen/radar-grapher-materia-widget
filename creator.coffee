###

Materia
It's a thing

Widget: Radar Grapher, Creator
Author: Ivey Padgett
Updated: 1/20/2016

###

# Create an angular module to house our controller
RadarGrapher = angular.module 'RadarGrapherCreator', ['ngMaterial']

RadarGrapher.controller 'RadarGrapherController', ['$scope', ($scope) ->
	$scope.widgetTitle = "My Radar Grapher Widget"

	Materia.CreatorCore.start $scope
]

RadarGrapher.config ($mdThemingProvider) ->
	$mdThemingProvider.theme('toolbar-dark', 'default')
		.primaryPalette('indigo')
		.dark()
