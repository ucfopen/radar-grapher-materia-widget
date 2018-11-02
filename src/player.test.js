describe('Player', function () {
	require('angular/angular.js');
	require('angular-mocks/angular-mocks.js');

	var $scope
	var $controller
	var $timeout
	var widgetInfo
	var qset

	beforeEach(() => {
		jest.resetModules()

		// mock materia
		global.Materia = {
			Engine: {
				start: jest.fn(),
				end: jest.fn(),
				setHeight: jest.fn()
			},
			Score: {
				submitQuestionForScoring: jest.fn()
			}
		}

		// load qset
		widgetInfo = require('./demo.json')
		qset = widgetInfo.qset;

		// load the required code
		angular.mock.module('RadarGrapherEngine')
		angular.module('ngMaterial', [])
		angular.module('ChartJsProvider', [])
		angular.module('chart.js', [])
		require('angular-chart.js/dist/angular-chart.min.js')
		require('./player')

		// mock scope
		$scope = {
			$apply: jest.fn(),
			$on: jest.fn()
		}

		// initialize the angualr controller
		inject(function(_$controller_, _$timeout_){
			$timeout = _$timeout_;
			// instantiate the controller
			$controller = _$controller_('RadarGrapherEngineCtrl', { $scope: $scope });
		})

	})


	it('should start properly', function(){
		$scope.start(widgetInfo, qset.data);
		expect(widgetInfo.name).toBe('Radar Grapher');
		//make sure the items include there are 6 items (U-Z)
		expect(qset.data.items.length).toBe(6);
		//make sure the the correct type of options are used
		expect(qset.data.items[0].options.label).toBeDefined();
		expect(qset.data.items[0].options.min).toBeDefined();
		expect(qset.data.items[0].options.max).toBeDefined();
	});

	it('should pad the responses after submit', function () {
		$scope.responses = [2,12.2];
		$scope.submit();
		expect($scope.data[0]).toEqual([11,19]);
	});

	it('should set inProgress to false after submit', function () {
		$scope.submit();
		expect($scope.inProgress).toBe(false);
	});
});

