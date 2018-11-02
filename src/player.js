/*
 * decaffeinate suggestions:
 * DS101: Remove unnecessary use of Array.from
 * DS102: Remove unnecessary code created because of implicit returns
 * DS205: Consider reworking code to avoid use of IIFEs
 * Full docs: https://github.com/decaffeinate/decaffeinate/blob/master/docs/suggestions.md
 */

const RadarGrapher = angular.module('RadarGrapherEngine', ['ngMaterial', 'chart.js']);

RadarGrapher.config(['ChartJsProvider', ChartJsProvider =>
		ChartJsProvider.setOptions({
			colours: ['#ff4081'],
			scaleOverride: true,
			scaleSteps: 5,
			scaleStepWidth: 20,
			scaleStartValue: 0, // The chart is always from 0 to 100
			scaleShowLine: false,
			pointLabelFontSize: 15,
			pointLabelFontStyle: 'bold',
			pointDotRadius: 2,
			pointDotStrokeWidth: 0.1,
			responsive: false,
			angleLineWidth : 5,
			angleLineColor: '#d5d5d5'
		})

	]);

RadarGrapher.controller('RadarGrapherEngineCtrl', ['$scope', function($scope) {
	$scope.inProgress = true;

	$scope.qset = null;
	$scope.instance = null;
	$scope.responses = [];
	$scope.paddedResponses = [];
	$scope.referenceLinesToggled;

	$scope.printResults = () => window.print();

	$scope.graphToImage = function($event) {
		let image = new Image;
		// Used to keep the permanent canvas untouched
		const tempCanvas = document.createElement("canvas");

		// These two elements must be combined to make a single image
		const wheel = document.getElementById('outer-wheel');
		const radar = document.getElementById('radar');

		tempCanvas.width = wheel.width + 40;
		tempCanvas.height = wheel.height + 40;

		const context = tempCanvas.getContext('2d');

		// Fills background to be white
		context.fillStyle = 'white';
		context.fillRect(0, 0, tempCanvas.width, tempCanvas.height);

		context.drawImage(wheel, 0, 20);
		context.drawImage(radar, 0, 20);

		image = tempCanvas.toDataURL("image/png");

		$event.currentTarget.href = image;
		return $event.currentTarget.download = $scope.instance.name + ".png";
	};

	$scope.adjustResponses = () => $scope.inProgress = !$scope.inProgress;

	$scope.initResponse = function(index) {
		if ($scope.responses[index] === undefined) {
			return $scope.responses[index] = 0;
		} else {
			return $scope.responses[index];
		}
	};

	$scope.toggleReferenceLines = function() {
		$scope.referenceLinesToggled = !$scope.referenceLinesToggled;

		if ($scope.referenceLinesToggled) {
			const radar = document.getElementById('radar');
			const wheel = document.getElementById('outer-wheel');

			const radarWidth = radar.width;
			const radarHeight = radar.height;

			const ctx = wheel.getContext('2d');
			ctx.fillStyle = '#d5d5d5';
			ctx.strokeStyle = '#d5d5d5';
			ctx.lineWidth = radarHeight / 150;

			let i = 0;

			return (() => {
				const result = [];
				while (i <= (radarHeight / 2.2)) {
				// Distance between each reference circle

				// generates rings on the radar graph to give user context
					ctx.beginPath();
					ctx.arc((radarWidth / 2), (radarHeight / 2), (radarHeight / 2.2) - i, 0, 2 * Math.PI);
					ctx.stroke();

					result.push(i += radarHeight / 9);
				}
				return result;
			})();
		} else {
			return _drawOuterWheel();
		}
	};

	// Chart data. Includes the labels.
	// The chart can handle more than one set of data, but we will only use one.

	$scope.data = [[]];
	$scope.labels = [];

	$scope.start = function(instance, qset, version) {
		$scope.instance = instance;
		$scope.qset = qset;
		populateLabels();
		return $scope.$apply();
	};

	var populateLabels = () =>
		Array.from($scope.qset.items).map((question) =>
			$scope.labels.push(question.options.label))
	;

	$scope.submit = function() {
		_padResponses();
		$scope.data[0] = $scope.paddedResponses;

		// Change the screen from questions to chart
		$scope.inProgress = false;
		return $scope.referenceLinesToggled = false;
	};

	// Add 20 to each response to make room for the circle in the center of the graph.
	var _padResponses = () =>
		Array.from($scope.responses).map((response, i) =>
			// $scope.responses[i] = if response < 90 then response + 10 else response
			($scope.paddedResponses[i] = Math.floor($scope.responses[i] * 0.8) + 10))
	;

	// Draws the wheel that acts as a backdrop to the radar graph
	// 	All values for outer wheel are based off of the values of the radar to
	//		aid in scaling
	var _drawOuterWheel = function() {
		const radar = document.getElementById('radar');
		const wheel = document.getElementById('outer-wheel');

		const radarWidth = radar.width;
		const radarHeight = radar.height;

		wheel.width = radarWidth;
		wheel.height = radarHeight;

		const ctx = wheel.getContext('2d');
		ctx.fillStyle = '#d5d5d5';
		ctx.strokeStyle = '#d5d5d5';
		ctx.lineWidth = radarWidth / 150;

		ctx.beginPath();
		ctx.arc((radarWidth / 2), (radarHeight / 2), radarHeight / 2.2, 0, 2 * Math.PI);
		ctx.stroke();

		// center of the radar graph
		ctx.beginPath();
		ctx.arc((radarWidth / 2), (radarHeight / 2),radarHeight/20, 0, 2 * Math.PI);
		return ctx.fill();
	};

	$scope.$on('create', (evt, chart) => _drawOuterWheel());


	return Materia.Engine.start($scope);
}
]);


RadarGrapher.controller('PrintController', ['$scope', function($scope) {}

]);
