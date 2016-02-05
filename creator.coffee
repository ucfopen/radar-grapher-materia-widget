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

	# Input data for each question. Start with samples of 3.
	$scope.cards = [
		{
			'question': 'Question 1'
			'label': 'Label 1'
			'min': 'Min 1'
			'max': 'Max 1'
		}
		{
			'question': 'Question 2'
			'label': 'Label 2'
			'min': 'Min 2'
			'max': 'Max 2'
		}
		{
			'question': 'Question 3'
			'label': 'Label 3'
			'min': 'Min 3'
			'max': 'Max 3'
		}
	]

	Materia.CreatorCore.start $scope
]

RadarGrapher.config ($mdThemingProvider) ->
	$mdThemingProvider.theme('toolbar-dark', 'default')
		.primaryPalette('indigo')
		.dark()
