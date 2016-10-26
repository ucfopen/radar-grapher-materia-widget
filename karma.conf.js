module.exports = function(config) {
    config.set({

        autoWatch: false,

        basePath: './',

        browsers: ['PhantomJS','Chrome'],

        files: [
            '../../js/*.js',
            'node_modules/angular/angular.js',
            'node_modules/angular-animate/angular-animate.js',
            'node_modules/angular-aria/angular-aria.js',
            'node_modules/angular-mocks/angular-mocks.js',
            'node_modules/angular-sanitize/angular-sanitize.js',
            'node_modules/angular-material/angular-material.min.js',
            'node_modules/chart.js/dist/Chart.js',
            'node_modules/angular-chart/angular-chart.min.js',
            'build/*.js',
            'tests/*.js'
        ],

        frameworks: ['jasmine'],

        plugins: [
            'karma-coverage',
            'karma-jasmine',
            'karma-junit-reporter',
            'karma-mocha-reporter',
            'karma-phantomjs-launcher',
            'karma-chrome-launcher'
        ],

        singleRun: true,

        reporters: ['coverage', 'mocha'],

        //reporter-specific configurations

        coverageReporter: {
            check: {
                global: {
                    statements: 90,
                    branches:   90,
                    functions:  90,
                    lines:      90
                },
                each: {
                    statements: 90,
                    branches:   90,
                    functions:  90,
                    lines:      90
                }
            },
            reporters: [
                { type: 'cobertura', subdir: '.', file: 'coverage.xml' }
            ]
        },

        mochaReporter: {
            output: 'autowatch'
        }

    });
};