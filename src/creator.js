
// Create an angular module to house our controller
let RadarGrapher = angular.module('RadarGrapherCreator', ['ngMaterial', 'chart.js', 'ngSanitize']);

RadarGrapher.config(['$mdThemingProvider', ($mdThemingProvider) =>
	$mdThemingProvider.theme('toolbar-dark', 'default')
		.primaryPalette('indigo')
		.dark()
]);

RadarGrapher.config(['ChartJsProvider', (ChartJsProvider) =>
	ChartJsProvider.setOptions({
		colours: ['#ff4081'],
		scaleOverride: true,
		scaleSteps: 5,
		scaleStepWidth: 20,
		scaleStartValue: 0, // The chart is always from 0 to 100
		scaleShowLine: false,
		pointLabelFontSize: 15,
		responsive: false,
		angleLineWidth: 4
	})
]);

RadarGrapher.controller('RadarGrapherController', ['$scope','$mdToast','$sanitize','$compile','Resource', ($scope, $mdToast, $sanitize, $compile, Resource) => {

	$scope.widgetTitle = "My Radar Grapher Widget";

	$scope.data = [[]];
	$scope.labels = [];

	$scope.fillColor = 'rgba(255,64,129, 0.5)';

	$scope.labelCharLimit = 18;
	// $scope.charLimitRegex = /^[A-Za-z0-9 ]{1,24}$/

	$scope.cards = [];

	// Track the total question count, so labels and questions do not repeat
	// if one is deleted.
	let questionCount = 0;

	/* Materia Interface Methods */

	$scope.initNewWidget = (widget, baseUrl) =>
		$scope.$apply(() => setup())
	;

	$scope.onSaveComplete = (title, widget, qset, version) => true;

	$scope.onQuestionImportComplete = items => true;

	$scope.onMediaImportComplete  = media => null;

	$scope.initExistingWidget = (title,widget,qset,version,baseUrl) =>

		$scope.$apply(function() {

			$scope.widgetTitle = title;

			for (let item of Array.from(qset.items)) {
				$scope.cards.push({
					question: item.questions[0].text,
					label: item.options.label,
					min: item.options.min,
					max: item.options.max
				});

				questionCount++;
			}

			return populateData();
		})
	;

	var setup = function() {
		$scope.addQuestion();
		$scope.addQuestion();
		return $scope.addQuestion();
	};

	var populateData = function() {
		for (let card of Array.from($scope.cards)) {
			$scope.labels.push(card.label);
			$scope.data[0].push(0);
		}

		return $scope.invalid = false;
	};

	// Add new	questions when the plus button is clicked as long as there are
	// less than 10 questions.
	$scope.addQuestion = function() {
		if ($scope.cards.length >= 10) {
			$scope.showToast("Maximum of 10 questions reached");
			return;
		}
		questionCount++;
		const newIndex = $scope.cards.length + 1;
		// $scope.cards.push {}
		$scope.cards.push({
			'question': `Question ${questionCount}`,
			'label': `Label ${questionCount}`,
			'min': 'Min',
			'max': 'Max'
		});
		$scope.labels.push(`Label ${questionCount}`);
		return $scope.data[0].push(0);
	};

	$scope.deleteQuestion = function(index) {
		if ($scope.cards.length <= 3) {
			$scope.showToast("Minimum of 3 questions reached");
			return;
		}
		$scope.cards.splice(index, 1);
		$scope.labels.splice(index, 1);
		return $scope.data[0].splice(index, 1);
	};

	$scope.updateLabels = (index, label) => $scope.labels[index] = label;

	$scope.showToast = message =>
		$mdToast.show(
			$mdToast.simple()
				.textContent(message)
				.position('bottom right')
				.hideDelay(3000)
		)
	;

	$scope.onSaveClicked = function(mode) {
		if (mode == null) { mode = 'save'; }
		const _isValid = $scope.validation();

		if (_isValid) {
			console.log("saving qset");
			const qset = Resource.buildQset($sanitize($scope.widgetTitle), $scope.cards);
			if (qset) { return Materia.CreatorCore.save($sanitize($scope.widgetTitle), qset); }
		} else {
			Materia.CreatorCore.cancelSave("Please make sure every question is complete");
			return false;
		}
	};

	$scope.validation = function() {
		$scope.invalid = false;

		for (let card of Array.from($scope.cards)) {
			if (!card.question || !card.label || !card.min || !card.max) {
				$scope.invalid = true;
				return false;
			}
		}
		return true;
	};

	$scope.onQuestionImportComplete = items =>
		__range__(0, items.length, false).map((i) =>
			$scope.cards.push({
				question: items[i].questions[0].text,
				label: items[i].label,
				min: items[i].min,
				max: items[i].max
			}))
	;

	// console.log RadarGrapher
	return Materia.CreatorCore.start($scope);
}

]);

RadarGrapher.factory('Resource', ['$sanitize', ($sanitize) => {
	return {
		buildQset(title, questions) {
			const qsetItems = [];
			const qset = {};

			if (title === '') {
				Materia.CreatorCore.cancelSave('Please enter a title.');
				return false;
			}

			for (let question of Array.from(questions)) {
				const item = this.processQsetItem(question);
				if (item) { qsetItems.push(item); }
			}

			qset.items = qsetItems;
			return qset;
		},

		processQsetItem(item, index) {
			const question = $sanitize(item.question);
			const label = $sanitize(item.label);
			const min = $sanitize(item.min);
			const max = $sanitize(item.max);

			return {
				materiaType: "question",
				id: null,
				type: 'MC',
				options: {
					label,
					min,
					max
				},
				questions: [{ text: question }],
				answers: [{
					text: '[No Answer]',
					value: 0
				}
				]
			};
		}
	};
}
]);

RadarGrapher.directive('labelLimitEnforcer', [() =>
{
	return {
		restrict: 'A',
		link: ($scope, $element, $attrs) => {
			return $element.bind('keypress', function(e) {
				// Allow backspace, delete, and arrow keys (for Firefox)
				const allowedCodes = [8, 37, 39, 46];
				if (!(Array.from(allowedCodes).includes(e.keyCode)) && ($element[0].value.length >= $scope.labelCharLimit)) {
					e.preventDefault();
					return false;
				}
			});
		}
	}
}]);

function __range__(left, right, inclusive) {
	let range = [];
	let ascending = left < right;
	let end = !inclusive ? right : ascending ? right + 1 : right - 1;
	for (let i = left; ascending ? i < end : i > end; ascending ? i++ : i--) {
		range.push(i);
	}
	return range;
}
