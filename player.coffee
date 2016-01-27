###

Materia
It's a thing

Widget: Radar Grapher, Engine
Authors: Ivey Padgett

###
RadarGrapher = angular.module 'RadarGrapherEngine', ['ngMaterial', 'chart.js']

RadarGrapher.controller 'RadarGrapherEngineCtrl', ['$scope', ($scope) ->
	$scope.inProgress = true

	$scope.qset = null
	$scope.instance = null
	$scope.responses = []

	# Chart variables
	$scope.labels = ["test1", "test2", "test3"]
	$scope.data = []
	$scope.options = {}

	$scope.start = (instance, qset, version) ->
		$scope.instance = instance
		$scope.qset = qset
		$scope.$apply()

	$scope.submit = ->
		# The data variable has to be in the form of array[array[]] due to
		# the chart supporting multiple data sets on one chart
		$scope.data.push $scope.responses

		# Options for the chart
		$scope.options = {
			scaleOverride: true
			scaleSteps: 5
			scaleStepWidth: 20
			scaleStartValue: 0 # The chart is always from 0 to 100
			scaleShowLine: false
			pointLabelFontSize: 20
		}

		# Change the screen from questions to chart
		$scope.inProgress = false

	Materia.Engine.start($scope)
]
