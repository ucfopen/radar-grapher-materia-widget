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

	$scope.removeHighlight = ->
		console.log $scope.cards

		# this.removeClass("highlight")

	$scope.widgetTitle = "My Radar Grapher Widget"

	$scope.data = [[]]
	$scope.labels = []

	$scope.fillColor = 'rgba(255,64,129, 0.5)'

	$scope.labelCharLimit = 24
	# $scope.charLimitRegex = /^[A-Za-z0-9 ]{1,24}$/

	# Input data for each question. Start with samples of 3.
	# $scope.cards = [
	# 	{
	# 		'question': 'Question 1'
	# 		'label': 'Label 1'
	# 		'min': 'Min'
	# 		'max': 'Max'
	# 	}
	# 	{
	# 		'question': 'Question 2'
	# 		'label': 'Label 2'
	# 		'min': 'Min'
	# 		'max': 'Max'
	# 	}
	# 	{
	# 		'question': 'Question 3'
	# 		'label': 'Label 3'
	# 		'min': 'Min'
	# 		'max': 'Max'
	# 	}
	# ]

	$scope.cards = []

	$scope.setup = ->
		$scope.addQuestion()
		$scope.addQuestion()
		$scope.addQuestion()


	# Track the total question count, so labels and questions do not repeat
	# if one is deleted.
	questionCount = 0

	populateData = ->

		for card in $scope.cards
			$scope.labels.push card.label
			$scope.data[0].push 0

		$scope.invalid = false

	populateData()

	# $scope.$on 'update', (evt, chart) ->

	# $scope.$on 'create', (evt, chart) ->

	# Add new	questions when the plus button is clicked as long as there are
	# less than 10 questions.
	$scope.addQuestion = ->
		if $scope.cards.length >= 10
			$scope.showToast("Maximum of 10 questions reached")
			return
		questionCount++
		newIndex = $scope.cards.length + 1
		# $scope.cards.push {}
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

	$scope.onSaveClicked = (mode = 'save') ->
		_isValid = $scope.validation()

		if _isValid
			console.log "saving qset"
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

	# console.log RadarGrapher
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
		label: label
		min: min
		max: max
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