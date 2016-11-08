module.exports = function(config) {
    config.set({

        autoWatch: true,

        basePath: './',

        browsers: ['Chrome'],

        files: [
            '../../js/*.js',
            'node_modules/jquery/dist/jquery.min.js',
            'node_modules/angular/angular.js',
            'node_modules/angular-animate/angular-animate.js',
            'node_modules/angular-aria/angular-aria.js',
            'node_modules/angular-mocks/angular-mocks.js',
            'node_modules/angular-sanitize/angular-sanitize.js',
            'node_modules/angular-material/angular-material.min.js',
            'node_modules/chart.js/dist/Chart.js',
            'node_modules/angular-chart/angular-chart.min.js',
            'build/*.js',
            'build/demo.json',
            'tests/*.js'
        ],

        frameworks: ['jasmine'],

        plugins: [
            'karma-coverage',
            'karma-eslint',
            'karma-jasmine',
            'karma-json-fixtures-preprocessor',
            'karma-junit-reporter',
            'karma-mocha-reporter',
            'karma-phantomjs-launcher',
            'karma-chrome-launcher'
        ],

        preprocessors: {
            // 'build/*.js': ['coverage', 'eslint']
            'build/player.js': ['coverage', 'eslint'],
            'build/creator.js': ['coverage', 'eslint'],
            'build/demo.json': ['json_fixtures']
        },

        //plugin-specific configurations
        eslint: {
            stopOnError: true,
            stopOnWarning: false,
            showWarnings: true,
            engine: {
                configFile: '.eslintrc.json'
            }
        },

        jsonFixturesPreprocessor: {
            variableName: '__demo__'
        },

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
                { type: 'html', subdir: 'report-html' },
                { type: 'cobertura', subdir: '.', file: 'coverage.xml' }
            ]
        },

        junitReporter: {
            outputFile: './test_out/unit.xml',
            suite: 'unit'
        },

        mochaReporter: {
            output: 'autowatch'
        }

    });
};