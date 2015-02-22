/**
 * Created by cobos on 23/01/15.
 */
var screensModule = angular.module('screensModule', []);

screensModule.controller('ScreensController', ['$rootScope', '$scope', '$http', 'Screens',

    function($rootScope, $scope, $http, Screens) {

        $scope.screens = Screens.query(function(screens) {});
        $scope.init = function(){};

        $scope.init();

        return {
        };
    }
]);


screensModule.controller('NewScreenController', ['$rootScope', '$scope', '$http', '$timeout', '$location', '$window',

    function($rootScope, $scope, $http, $timeout, $location, $window) {

        $scope.step = 0;
        $scope.code = '';
        $scope.title = '';

        var back = function() {
            $scope.step--;
        };

        var next = function() {
            $scope.step++;
        };

        var createScreen = function() {
            var Screen = {
                code: $scope.code,
                title: $scope.title
            };
            $http({
                url: '/apiWeb/add_screen',
                method: 'POST',
                data: Screen
            }).success(function(res) {
                $window.location.href="/screens";
            }).error(function(data, status, headers, config) {
                $scope.error = true;
                $scope.serverErrorMessage = data;
            });
        }

        $scope.init = function(){
        };

        $scope.init();

        return {
            next: next,
            back: back,
            createScreen: createScreen
        };

    }
]);


