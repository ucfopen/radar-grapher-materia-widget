// var widgetInfo = window.__demo__['build/demo'];
// var qset = widgetInfo.qset;

describe('radar module', function () {
    var widgetInfo = window.__demo__['build/demo'];
    var qset = widgetInfo.qset;
    console.log(widgetInfo);
    beforeEach(module('RadarGrapherEngine'));

    describe('RadarGrapherEngineCtrl', function () {
        var $scope = {};
        var ctrl;
        var $compiler = {};

        beforeEach(inject(function($rootScope, $controller, $compile){
            //instantiate $scope with all of the generic $scope methods/properties
            $scope = $rootScope.$new();
            ctrl = $controller('RadarGrapherEngineCtrl', { $scope: $scope });
            $compiler = $compile;
        }));

        it('should start properly', function(){
            $scope.start(widgetInfo, qset.data);
            expect(widgetInfo.name).toBe('Radar Grapher');
            //make sure the items include there are 6 items (U-Z)
            expect(qset.data.items.length).toEqual(6);
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
            expect(document.getElementById('outer-wheel').width).toEqual(800);
            expect(document.getElementById('outer-wheel').height).toEqual(500);
            console.log(document.body);
            //this is needed for canvas specific properties
            var ctx = document.getElementById("outer-wheel").getContext("2d");
            // var ctx = canvas.getContext("2d");
            expect(ctx.fillStyle).toEqual('#d5d5d5');
            expect(ctx.strokeStyle).toEqual('#d5d5d5');
            expect(ctx.lineWidth).toEqual(20);
        });
    });
});


