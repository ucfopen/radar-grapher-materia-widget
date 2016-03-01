###

Materia
It's a thing

Widget: Radar Grapher, Creator
Author: Ivey Padgett
Updated: 1/20/2016

###

# Create an angular module to house our controller
RadarGrapher = angular.module 'RadarGrapherCreator', ['ngMaterial', 'chart.js', 'ngSanitize']

RadarGrapher.controller 'RadarGrapherController', ['$scope', '$mdToast', '$sanitize', 'Resource', ($scope, $mdToast, $sanitize, Resource) ->
	$scope.widgetTitle = "My Radar Grapher Widget"

	$scope.data = {
		labels: []
		datasets: []
	}

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

	populateData = ->
		dataArr = []
		for card in $scope.cards
			$scope.data.labels.push card.label
			dataArr.push 0
		$scope.data.datasets.push {
			fillColor: "rgba(255,64,129, 0.5)"
			data: dataArr
		}
		$scope.invalid = false

	populateData()

	# Add new	questions when the plus button is clicked as long as there are
	# less than 10 questions.
	$scope.addQuestion = ->
		if $scope.cards.length >= 10
			$scope.showToast("Maximum of 10 questions reached")
			return

		newIndex = $scope.cards.length + 1
		$scope.cards.push {}
		$scope.data.labels.push ""
		$scope.data.datasets[0].data.push 0

	$scope.deleteQuestion = (index) ->
		if $scope.cards.length <= 3
			$scope.showToast("Minimum of 3 questions reached")
			return
		$scope.cards.splice index, 1
		$scope.data.labels.splice index, 1
		$scope.data.datasets[0].data.splice index, 1

	$scope.updateLabels = (index, label) ->
		$scope.data.labels[index] = label

	$scope.showToast = (message) ->
		$mdToast.show(
			$mdToast.simple()
				.textContent(message)
				.position('bottom right')
				.hideDelay(3000)
		)

	$scope.onSaveClicked = (mode = 'save') ->
		_isValid = $scope.validation()

		if _isValid
			qset = Resource.buildQset $sanitize($scope.widgetTitle), $scope.cards
			if qset then Materia.CreatorCore.save $sanitize($scope.widgetTitle), qset
		else
			Materia.CreatorCore.cancelSave "Please make sure every question is complete"
			return false

	$scope.validation = ->
		$scope.invalid = false

		for card in $scope.cards
			if !card.question or !card.label or !card.min or !card.max
				$scope.invalid = true
				return false
		return true

	$scope.onQuestionImportComplete = (items) ->
		for i in [0...items.length]
			$scope.cards.push
				question: items[i].questions[0].text
				label: items[i].label
				min: items[i].min
				max: items[i].max

	Materia.CreatorCore.start $scope
]

RadarGrapher.factory 'Resource', ['$sanitize', ($sanitize) ->
	buildQset: (title, questions) ->
		qsetItems = []
		qset = {}

		if title is ''
			# Materia.CreatorCore.cancelSave 'Please enter a title.'
			return false

		for question in questions
			item = @processQsetItem question
			if item then qsetItems.push item

		qset.items = qsetItems
		return qset

	processQsetItem: (item, index) ->
		question = $sanitize item.question
		label = $sanitize item.label
		min = $sanitize item.min
		max = $sanitize item.max

		materiaType: "question"
		id: null
		type: 'MC'
		label: label
		min: min
		max: max
		questions: [{ text: question }]
		answers: [
			text: '[No Answer]'
			value: 0
		]
]

RadarGrapher.directive 'ngCircle', ->
	return {
		restrict: 'A'
		link: (scope, ele, attr) ->
			canvas = ele[0]
			ctx = canvas.getContext('2d')

			chartOptions = {
				scaleOverride: true
				scaleSteps: 5
				scaleStepWidth: 20
				scaleStartValue: 0 # The chart is always from 0 to 100
				scaleShowLine: false
				pointLabelFontSize: 15
				responsive: false
			}

			myChart = new Chart(ctx).Radar(scope.data, chartOptions)

			scope.$watch('data', () ->
				if myChart?
					myChart.destroy()
					cnv = '<canvas id="radar" class="chart" ng-circle></canvas>'
					document.getElementById("graph-container").innerHTML = cnv
					ctx = document.getElementById("radar").getContext('2d')
					myChart = new Chart(ctx).Radar(scope.data, chartOptions)
			, true)
	}

RadarGrapher.config ($mdThemingProvider) ->
	$mdThemingProvider.theme('toolbar-dark', 'default')
		.primaryPalette('indigo')
		.dark()
