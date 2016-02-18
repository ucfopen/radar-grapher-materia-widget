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

	# Chart data. Includes the labels.
	# The chart can handle more than one set of data, but we will only use one.
	$scope.data = {
		labels: []
		datasets: []
	}

	$scope.start = (instance, qset, version) ->
		$scope.instance = instance
		$scope.qset = qset
		populateLabels()
		$scope.$apply()

	populateLabels = ->
		for question in $scope.qset.items
			$scope.data.labels.push(question.label)

	$scope.submit = ->
		_padResponses()
		# The datasets objects take data and options for the dataset.
		$scope.data.datasets.push {
			fillColor: "rgba(255,64,129, 0.5)"
			data: $scope.responses
		}

		# Change the screen from questions to chart
		$scope.inProgress = false

	# Add 20 to each response to make room for the circle in the center of the graph.
	_padResponses = ->
		for response, i in $scope.responses
			$scope.responses[i] = response + 20

	Materia.Engine.start($scope)
]

# We draw a border around the graph, so we have to use a directive to grab the
# graph and draw a circle border on a canvas on top of it.
RadarGrapher.directive 'ngCircle', ->
	return {
		restrict: 'A'
		link: (scope, ele, attr) ->
			canvas = ele[0]
			ctx = canvas.getContext('2d')

			console.log scope.$parent.data
			myChart = new Chart(ctx).Radar(scope.$parent.data, {
				scaleOverride: true
				scaleSteps: 7 # We add padding to the graph to make room for the circle
				scaleStepWidth: 20
				scaleStartValue: 0 # The chart is always from 0 to 100
				scaleShowLine: false
				pointLabelFontSize: 20
				# This gets called multiple times but it will draw the circle without
				# the delay of onAnimationComplete.
				onAnimationProgress: ->
					# Canvas to draw the circle border
					blank = canvas.nextElementSibling
					blank.width = canvas.width
					blank.height = canvas.height

					ctx2 = blank.getContext('2d')
					ctx2.fillStyle = "#212121"
					ctx2.strokeStyle = "#212121"
					ctx2.beginPath()
					ctx2.lineWidth = 20
					ctx2.arc(canvas.width / 2, canvas.height / 2 - 3, 165, 0, 2 * Math.PI)
					ctx2.stroke()

					ctx2.beginPath()
					ctx2.arc(canvas.width / 2, canvas.height / 2 - 3, 20, 0, 2 * Math.PI)
					ctx2.fill()
			})
	}
