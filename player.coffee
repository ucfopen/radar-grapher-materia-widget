###

Materia
It's a thing

Widget: Radar Grapher, Engine
Authors: Ivey Padgett

###
RadarGrapher = angular.module 'RadarGrapherEngine', ['ngMaterial', 'chart.js']

RadarGrapher.config ['ChartJsProvider', (ChartJsProvider) ->
		ChartJsProvider.setOptions {
			colours: ['#ff4081']
			scaleOverride: true
			scaleSteps: 5
			scaleStepWidth: 20
			scaleStartValue: 0 # The chart is always from 0 to 100
			scaleShowLine: false
			pointLabelFontSize: 15
			pointLabelFontStyle: 'bold'
			pointDotRadius: 2
			pointDotStrokeWidth: 0.1
			responsive: false
			angleLineWidth : 5
			angleLineColor: '#d5d5d5'
		}
	]

RadarGrapher.controller 'RadarGrapherEngineCtrl', ['$scope', ($scope) ->
	$scope.inProgress = true

	$scope.qset = null
	$scope.instance = null
	$scope.responses = []
	$scope.paddedResponses = []
	$scope.referenceLinesToggled

	$scope.printResults = ->
		window.print()

	$scope.graphToImage = ($event) ->
		image = new Image
		# Used to keep the permanent canvas untouched
		tempCanvas = document.createElement "canvas"

		# These two elements must be combined to make a single image
		wheel = document.getElementById 'outer-wheel'
		radar = document.getElementById 'radar'

		tempCanvas.width = wheel.width + 40
		tempCanvas.height = wheel.height + 40

		context = tempCanvas.getContext '2d'

		# Fills background to be white
		context.fillStyle = 'white'
		context.fillRect 0, 0, tempCanvas.width, tempCanvas.height

		context.drawImage wheel, 0, 20
		context.drawImage radar, 0, 20

		image = tempCanvas.toDataURL("image/png")

		$event.currentTarget.href = image
		$event.currentTarget.download = 'test.png'

	$scope.adjustResponses = ->
		return $scope.inProgress = !$scope.inProgress

	$scope.initResponse = (index) ->
		if $scope.responses[index] == undefined
			return $scope.responses[index] = 0
		else
			return $scope.responses[index]

	$scope.toggleReferenceLines = ->
		$scope.referenceLinesToggled = !$scope.referenceLinesToggled

		if $scope.referenceLinesToggled
			radar = document.getElementById 'radar'
			wheel = document.getElementById 'outer-wheel'

			radarWidth = radar.width
			radarHeight = radar.height

			ctx = wheel.getContext '2d'
			ctx.fillStyle = '#d5d5d5'
			ctx.strokeStyle = '#d5d5d5'
			ctx.lineWidth = 10

			i = 350

			while i > 107
				# Distance between each reference circle

				# generates rings on the radar graph to give user context
				ctx.beginPath()
				ctx.arc (radarWidth / 2), (radarHeight / 2), i, 0, 2 * Math.PI
				ctx.stroke()

				i -= 107
		else
			_drawOuterWheel()

	# Chart data. Includes the labels.
	# The chart can handle more than one set of data, but we will only use one.

	$scope.data = [[]]
	$scope.labels = []

	$scope.start = (instance, qset, version) ->
		$scope.instance = instance
		$scope.qset = qset
		populateLabels()
		$scope.$apply()

	populateLabels = ->
		for question in $scope.qset.items
			$scope.labels.push question.options.label

	$scope.submit = ->
		_padResponses()
		$scope.data[0] = $scope.paddedResponses

		# Change the screen from questions to chart
		$scope.inProgress = false
		$scope.referenceLinesToggled = false

	# Add 20 to each response to make room for the circle in the center of the graph.
	_padResponses = ->
		for response, i in $scope.responses
			# $scope.responses[i] = if response < 90 then response + 10 else response
			$scope.paddedResponses[i] = Math.floor($scope.responses[i] * 0.8) + 10

	# Draws the wheel that acts as a backdrop to the radar graph
	_drawOuterWheel = ->
		radar = document.getElementById 'radar'
		wheel = document.getElementById 'outer-wheel'

		radarWidth = radar.width
		radarHeight = radar.height

		wheel.width = radarWidth
		wheel.height = radarHeight

		ctx = wheel.getContext '2d'
		ctx.fillStyle = '#d5d5d5'
		ctx.strokeStyle = '#d5d5d5'
		ctx.lineWidth = 10

		ctx.beginPath()
		ctx.arc (radarWidth / 2), (radarHeight / 2), 457, 0, 2 * Math.PI
		ctx.stroke()

		# center of the radar graph
		ctx.beginPath()
		ctx.arc (radarWidth / 2), (radarHeight / 2), 50, 0, 2 * Math.PI
		ctx.fill()

	$scope.$on 'create', (evt, chart) ->
		_drawOuterWheel()


	Materia.Engine.start($scope)
]


RadarGrapher.controller 'PrintController', ['$scope', ($scope) ->

]
