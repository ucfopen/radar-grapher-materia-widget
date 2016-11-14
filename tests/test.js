// var widgetInfo = window.__demo__['build/demo'];
// var qset = widgetInfo.qset;

describe('radar module', function () {
	var widgetInfo = window.__demo__['build/demo'];
	var qset = widgetInfo.qset;
	var $scope = {};
	var ctrl;
	var $compiler = {};

	describe('Player', function () {

		// beforeEach(module('RadarGrapherEngine'));
		module.sharedInjector();
		beforeAll(module('RadarGrapherEngine'));

		beforeEach(inject(function($rootScope, $controller){
			//instantiate $scope with all of the generic $scope methods/properties
			$scope = $rootScope.$new();
			ctrl = $controller('RadarGrapherEngineCtrl', { $scope: $scope });
		}));

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

		it('should have given the canvas element the correct width and height', function(){
			//we create the canvas elements for the upcoming create event to manipulate
			var canvas_elements = '<canvas id="radar">' + '</canvas>' +
					'<canvas id="outer-wheel">' + '</canvas>';
			//we make sure that the elements exist within the body tag
			document.body.insertAdjacentHTML(
				'afterbegin',
				canvas_elements);

			//we fire the create event which is caught in the player controller
			$scope.$emit('create');
			//we expect the canvas elements to be set up correctly
			expect(document.getElementById('outer-wheel').width).toBe(800);
			expect(document.getElementById('outer-wheel').height).toBe(500);
			//this is needed for canvas specific properties
			var ctx = document.getElementById("outer-wheel").getContext("2d");
			// var ctx = canvas.getContext("2d");
			expect(ctx.fillStyle).toBe('#d5d5d5');
			expect(ctx.strokeStyle).toBe('#d5d5d5');
			expect(ctx.lineWidth).toBe(20);
		});
	});

	describe('Creator', function () {

		module.sharedInjector();
		beforeAll(module('RadarGrapherCreator'));
		beforeEach(inject(function ($rootScope, $controller, _$compile_) {
			//instantiate $scope with all of the generic $scope methods/properties
			$scope = $rootScope.$new();
			ctrl = $controller('RadarGrapherController', {$scope: $scope});
			$compiler = _$compile_;
		}));
		beforeEach(function () {
			spyOn(Materia.CreatorCore, 'save').and.callFake(function (title, qset) {
				return {title: title, qset: qset};
			});
			spyOn(Materia.CreatorCore, 'cancelSave');
			spyOn($scope, 'addQuestion').and.callThrough();
			spyOn($scope,'showToast').and.callThrough();
		});

		it('should have initial variables declared' , function() {
			expect($scope.title).toBe("My Radar Grapher Widget");
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
			expect($scope.title).toBe(widgetInfo.name);
			expect($scope.cards[0].question).toBe("How do you feel about U?");
			expect($scope.cards[0].label).toBe("U");
			expect($scope.cards[0].min).toBe("Min");
			expect($scope.cards[0].max).toBe("Max");
			//expect populateData to have worked
			expect($scope.labels[0]).toBe("U");
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
			$scope.title = '';
			$scope.onSaveClicked();
			expect(Materia.CreatorCore.cancelSave).toHaveBeenCalledWith("Please enter a title.");
		});

		it('should not allow an input with length greater than labelCharLimit ', function() {
			var element = angular.element("<input value='' label-limit-enforcer/>");
			//test string greater than 20 characters should return
			element[0].value = 'thisistwentyonecharcs';
			element = $compiler(element)($scope);
			var keyReturn = element.triggerHandler('keypress');
			expect(keyReturn).toBe(false);
			//test a small string
			element[0].value = 'smallString';
			keyReturn = element.triggerHandler('keypress');
			expect(keyReturn).toBe(undefined);
		});
	});
});


