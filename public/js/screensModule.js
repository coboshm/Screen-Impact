/**
 * Created by cobos on 23/01/15.
 */
var screensModule = angular.module('screensModule', []);

screensModule.controller('ScreensController', ['$rootScope', '$scope', '$http',

    function($rootScope, $scope, $http) {


        $scope.init = function(){};

        $scope.init();

        return {
        };
    }
]);


screensModule.controller('NewScreenController', ['$rootScope', '$scope', '$http', '$timeout', '$location', '$window',

    function($rootScope, $scope, $http, $timeout, $location, $window) {

        $scope.step = 0;

        var back = function() {
            $scope.step--;
        };

        var next = function() {
            $scope.step++;
        };

        $scope.init = function(){
        };

        $scope.init();

        return {
            next: next,
            back: back
        };

    }
]);


