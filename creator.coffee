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
	$scope.cards = [
		{
			'question': 'Question 1'
			'label': 'Label 1'
		}
		{
			'question': 'Question 2'
			'label': 'Label 2'
		}
		{
			'question': 'Question 3'
			'label': 'Label 3'
		}
	]

	Materia.CreatorCore.start $scope
]

RadarGrapher.config ($mdThemingProvider) ->
	$mdThemingProvider.theme('toolbar-dark', 'default')
		.primaryPalette('indigo')
		.dark()
