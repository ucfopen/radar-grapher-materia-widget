###

Materia
It's a thing

Widget: Radar Grapher, Engine
Authors: Ivey Padgett

###
RadarGrapher = angular.module 'RadarGrapherEngine', ['ngMaterial']

RadarGrapher.controller 'RadarGrapherEngineCtrl', ['$scope', ($scope) ->
	$scope.qset = null
	$scope.instance = null
	$scope.responses = []

	$scope.start = (instance, qset, version) ->
		$scope.instance = instance
		$scope.qset = qset
		$scope.$apply()

	Materia.Engine.start($scope)
]
