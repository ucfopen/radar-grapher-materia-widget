###

Materia
It's a thing

Widget: Radar Grapher, Creator
Author: Ivey Padgett
Updated: 1/20/2016

###

# Create an angular module to house our controller
RadarGrapher = angular.module 'RadarGrapherCreator'

RadarGrapher.controller 'RadarGrapherController', ['$scope', ($scope) ->
	Materia.CreatorCore.start $scope
]
