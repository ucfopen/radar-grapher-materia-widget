###

Materia
It's a thing

Widget: Radar Grapher, Creator
Author: Ivey Padgett
Updated: 1/20/2016

###

# Create an angular module to house our controller
RadarGrapher = angular.module 'RadarGrapherCreator', ['ngMaterial', 'chart.js', 'ngSanitize']

RadarGrapher.config (ChartJsProvider) ->
		ChartJsProvider.setOptions {
			colours: ['#ff4081']
			scaleOverride: true
			scaleSteps: 5
			scaleStepWidth: 20
			scaleStartValue: 0 # The chart is always from 0 to 100
			scaleShowLine: false
			pointLabelFontSize: 15
			responsive: false
			angleLineWidth: 4
		}

RadarGrapher.config ($mdThemingProvider) ->
		$mdThemingProvider.theme('toolbar-dark', 'default')
			.primaryPalette('indigo')
			.dark()

RadarGrapher.controller 'RadarGrapherController', ($scope, $mdToast, $sanitize, $compile, Resource) ->

	$scope.widgetTitle = "My Radar Grapher Widget"

	$scope.data = [[]]
	$scope.labels = []

	$scope.fillColor = 'rgba(255,64,129, 0.5)'

	$scope.labelCharLimit = 18

	$scope.cards = []

	$scope.setup = ->
		$scope.addQuestion()
		$scope.addQuestion()
		$scope.addQuestion()

	# Track the total question count, so labels and questions do not repeat
	# if one is deleted.
	questionCount = 0

	# Add new	questions when the plus button is clicked as long as there are
	# less than 10 questions.
	$scope.addQuestion = ->
		if $scope.cards.length >= 10
			$scope.showToast("Maximum of 10 questions reached")
			return
		questionCount++
		$scope.cards.push {
			'question': 'Question '+questionCount
			'label': 'Label '+questionCount
			'min': 'Min'
			'max': 'Max'
		}
		$scope.labels.push 'Label '+questionCount
		$scope.data[0].push 0

	$scope.deleteQuestion = (index) ->
		if $scope.cards.length <= 3
			$scope.showToast("Minimum of 3 questions reached")
			return
		$scope.cards.splice index, 1
		$scope.labels.splice index, 1
		$scope.data[0].splice index, 1

	$scope.updateLabels = (index, label) ->
		$scope.labels[index] = label

	$scope.showToast = (message) ->
		$mdToast.show(
			$mdToast.simple()
				.textContent(message)
				.position('bottom right')
				.hideDelay(3000)
		)

	$scope.onSaveClicked = ->
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
				label: items[i].options.label
				min: items[i].options.min
				max: items[i].options.max

	Materia.CreatorCore.start $scope

RadarGrapher.factory 'Resource', ($sanitize) ->
	buildQset: (title, questions) ->
		qsetItems = []
		qset = {}

		if title is ''
			Materia.CreatorCore.cancelSave 'Please enter a title.'
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
		options: {
			label: label
			min: min
			max: max
		}
		questions: [{ text: question }]
		answers: [
			text: '[No Answer]'
			value: 0
		]

RadarGrapher.directive 'labelLimitEnforcer', () ->
	restrict: 'A',
	link: ($scope, $element, $attrs) ->
		$element.bind 'keypress', (e) ->
			if $element[0].value.length >= $scope.labelCharLimit
				e.preventDefault()
				return false