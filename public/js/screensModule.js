/**
 * Created by cobos on 23/01/15.
 */
var screensModule = angular.module('screensModule', []);

screensModule.controller('ScreensController', ['$rootScope', '$scope', '$http', 'Screens', 'Groups',

    function($rootScope, $scope, $http, Screens, Groups) {

        $scope.init = function(){
            $scope.screens = Screens.query(function(screens) {});
            $scope.groups = Groups.query(function(groups) {});
        };

        var DeleteRow = function (code, id) {
            $http({
                url: '/apiWeb/screenDelete',
                method: 'POST',
                data: {
                    code: code,
                    id: id
                }
            }).success(function(res) {
                $scope.screens = Screens.query(function(playlists) {});
                $scope.groups = Groups.query(function(groups) {})
            }).error(function(data, status, headers, config) {});
        };

        var getGroup = function(screen) {
            var x = 0;
            var ret = '';
            for (var i = 1; i < $scope.groups.length; i++) {
                var screens = $scope.groups[i].screens;
                for (var j = 0; j < screens.length; j++ ) {
                    if (screen.title === screens[j].title && screen.addedAt === screens[j].addedAt) {
                        if (x !== 0) {
                            ret += ', ' + $scope.groups[i].title;
                        } else {
                            ret += $scope.groups[i].title;
                        }
                        x++;
                    }
                }
            }
            if (x == 0) return $scope.groups[0].title;
            else return ret;
        };


        $scope.init();

        return {
            getGroup: getGroup,
            deleteRow: DeleteRow
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


