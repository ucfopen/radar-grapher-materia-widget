describe.skip('Creator', function () {
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
			CreatorCore: {
				start: jest.fn(),
				alert: jest.fn(),
				cancelSave: jest.fn(),
				save: jest.fn().mockImplementation((title, qset) => {
					//the creator core calls this on the creator when saving is successful
					$scope.onSaveComplete();
					return {title: title, qset: qset};
				})
			}
		}

		// load qset
		widgetInfo = require('./demo.json')
		qset = widgetInfo.qset;

		// load the required code
		angular.mock.module('RadarGrapherCreator')
		angular.module('ngMaterial', [])
		angular.module('ngSanitize', [])
		angular.module('ngAnimate', [])
		angular.module('ngAria', [])
		angular.module('ChartJsProvider', [])
		angular.module('chart.js', [])
		require('angular-chart.js/dist/angular-chart.min.js')
		require('angular-material/angular-material.js')
		require('./creator')

		// mock scope
		$scope = {
			$apply: jest.fn(),
			$on: jest.fn()
		}

		// initialize the angualr controller
		inject(function(_$controller_, _$timeout_){
			$timeout = _$timeout_;
			// instantiate the controller
			$controller = _$controller_('RadarGrapherController', { $scope: $scope });
		})

	})


	it('should have initial variables declared' , function() {
		expect($scope.widgetTitle).toBe("My Radar Grapher Widget");
		expect($scope.data).toEqual([[]]);
		expect($scope.labels).toEqual([]);
		expect($scope.fillColor).toBe('rgba(255,64,129, 0.5)');
		expect($scope.labelCharLimit).toBe(18);
		expect($scope.cards).toEqual([]);
	});

	it('should properly start and add questions', function(){
		$scope.initNewWidget();
		expect($scope.addQuestion).toHaveBeenCalledTimes(3);
		expect($scope.cards.length).toBe(3);
		//Make sure addQuestion worked properly
		for (var i=1; i <= $scope.cards.length ; i++) {
			expect($scope.cards[i-1].question).toBe('Question '+ i);
			expect($scope.cards[i-1].label).toBe('Label '+ i);
			expect($scope.cards[i-1].min).toBe('Min');
			expect($scope.cards[i-1].max).toBe('Max');
			expect($scope.labels[i-1]).toBe('Label '+ i);
		}
		expect($scope.data[0].length).toBe(3);
	});

	it('should initExisting Widget', function () {
		$scope.initExistingWidget(widgetInfo.name, widgetInfo, qset.data);
		expect($scope.widgetTitle).toBe(widgetInfo.name);
		expect($scope.cards[0].question).toBe("How do you feel about change?");
		expect($scope.cards[0].label).toBe("Like Change");
		expect($scope.cards[0].min).toBe("Dislike");
		expect($scope.cards[0].max).toBe("Like");
		//expect populateData to have worked
		expect($scope.labels[0]).toBe("Like Change");
		//6 numbers (U,V,W,X,Y,Z)
		expect($scope.data[0]).toEqual([0,0,0,0,0,0]);
	});

	it('should only allow up to ten questions', function(){
		for (var i=1; i<=11; i++ ){
			$scope.addQuestion();
		}
		expect($scope.showToast).toHaveBeenCalledWith('Maximum of 10 questions reached');
	});

	it('should delete a question', function(){
		for (var i=0; i<4; i++ ){
			$scope.addQuestion();
		}
		$scope.deleteQuestion();
		expect($scope.cards.length).toBe(3);
	});

	it('should update labels', function(){
		$scope.initNewWidget();
		$scope.updateLabels(0, 'changed');
		expect($scope.labels[0]).toBe('changed');
	});

	it('should not allow less than 3 questions', function(){
		$scope.initNewWidget();
		$scope.deleteQuestion();
		expect($scope.showToast).toHaveBeenCalledWith("Minimum of 3 questions reached");
	});

	it('should import questions properly', function(){
		var importing = [];
		var newQuestion = {
			materiaType: 'question',
			questions: [{text: 'Test Question'}],
			options: {
				"label": "Test",
				"min": "Min-Test",
				"max": "Max-Test"
			},
			answers: [{
				text:  'No Answer',
				value: 100
			}],
			id: null,
			type: 'MC'
		};
		importing.push(newQuestion);
		$scope.onQuestionImportComplete(importing);
		expect($scope.cards.length).toBe(1);
		expect($scope.cards[0].label).toBe('Test');
		expect($scope.cards[0].min).toBe('Min-Test');
		expect($scope.cards[0].max).toBe('Max-Test');
	});

	it('should save the widget properly', function(){
		//since we're spying on this, it should return an object with a title and a qset if it determines the widget is ready to save
		$scope.initNewWidget();
		var successReport = $scope.onSaveClicked();
		//make sure the title was sent correctly
		expect(successReport.title).toBe('My Radar Grapher Widget');
		for (var i=1 ; i <= successReport.qset.items.length ; i++) {
			expect(successReport.qset.items[i-1].questions[0].text).toBe('Question ' + i);
			expect(successReport.qset.items[i-1].options.label).toBe('Label ' + i);
			expect(successReport.qset.items[i-1].options.min).toBe('Min');
			expect(successReport.qset.items[i-1].options.max).toBe('Max');
		}
	});

	it('should cancel saving if a property does not exist', function(){
		$scope.initNewWidget();
		delete $scope.cards[0].max;
		$scope.onSaveClicked();
		expect(Materia.CreatorCore.cancelSave).toHaveBeenCalledWith("Please make sure every question is complete");
	});

	it('should cancel saving if there is no title', function(){
		$scope.initNewWidget();
		$scope.widgetTitle = '';
		$scope.onSaveClicked();
		expect(Materia.CreatorCore.cancelSave).toHaveBeenCalledWith("Please enter a title.");
	});

	it('should not allow an input with length greater than labelCharLimit ', function() {

		var element = angular.element("<input value='' label-limit-enforcer />");
		element = $compiler(element)($scope);
		$scope.$digest();

		// Function to test keypress events
		function keyPress(keyCode) {
			var keyEvent = new Event('keypress');
			keyEvent.which = keyCode;
			return keyEvent
		}

		// test that label-limit-enforcer is preventing keystroke due to character limit
		element[0].setAttribute('value','thisistwentyonecha');

		var negativeCharacterKey = keyPress(82);
		spyOn(negativeCharacterKey, 'preventDefault');

		element.triggerHandler(negativeCharacterKey);

		expect(negativeCharacterKey.preventDefault).toHaveBeenCalled();
		expect(element.attr('value')).toBe('thisistwentyonecha');

		// test that label-limit-enforcer is allowing keystroke
		element[0].setAttribute('value','cha');
		var positiveCharacterKey = keyPress(82);

		spyOn(positiveCharacterKey, 'preventDefault');

		element.triggerHandler(positiveCharacterKey);

		expect(positiveCharacterKey.preventDefault).not.toHaveBeenCalled();
	});
});
