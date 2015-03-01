/**
 * Created by cobos on 23/01/15.
 */
var groupsModule = angular.module('groupsModule', []);

groupsModule.controller('GroupsController', ['$rootScope', '$scope', '$http', 'Groups',

    function($rootScope, $scope, $http, Groups) {

        $scope.groups = Groups.query(function(groups) {})
        $scope.show_edit = false;
        $scope.init = function(){};
        $scope.init();



        var DeleteRow = function (id) {
            $http({
                url: '/apiWeb/groupDelete',
                method: 'POST',
                data: {
                    id: id
                }
            }).success(function(res) {
                $scope.groups = Groups.query(function(groups) {});
            }).error(function(data, status, headers, config) {});
        };

        var editRow = function (group) {
            $scope.show_edit = true;
            $rootScope.$emit(EVENTS.EDIT_GROUP, group);
        }

        $rootScope.$on(EVENTS.BACK_EDIT_GROUP, function(event) {
            $scope.show_edit = false;
            $scope.groups = Groups.query(function(groups) {});
        });

        return {
            editRow: editRow,
            deleteRow: DeleteRow
        };
    }
]);


groupsModule.controller('NewGroupController', ['$rootScope', '$scope', '$http', '$timeout', '$location', '$window', 'Screens',

    function($rootScope, $scope, $http, $timeout, $location, $window, Screens) {

        $scope.allScreens = Screens.query(function(screens) {});

        var back = function() {
            $rootScope.$emit(EVENTS.BACK_EDIT_GROUP);
        };

        var isValid = function() {
            if ($scope.title == '') return false;
            return true;
        }


        var editGroup = function() {
            var group = {
                title: $scope.title,
                id : $scope.id,
                screens: $scope.screens
            };
            $http({
                url: '/apiWeb/edit_group',
                method: 'POST',
                data: group
            }).success(function(res) {
                $window.location.href="/groups";
            }).error(function(data, status, headers, config) {
                $scope.error = true;
                $scope.serverErrorMessage = data;
            });
        };

        var createGroup = function() {
            var group = {
                title: $scope.title,
                screens: $scope.screens
            };
            $http({
                url: '/apiWeb/new_group',
                method: 'POST',
                data: group
            }).success(function(res) {
                $window.location.href="/groups";
            }).error(function(data, status, headers, config) {
                $scope.error = true;
                $scope.serverErrorMessage = data;
            });
        }

        $rootScope.$on(EVENTS.EDIT_GROUP, function(event, group) {
            $scope.title = group.title;
            $scope.id = group._id;
            $scope.allScreens = Screens.query(function(screens) {});
            $scope.screens = group.screens;
        });

        $scope.init = function(){
        };

        $scope.init();

        return {
            createGroup: createGroup,
            editGroup: editGroup,
            back: back,
            isValid: isValid
        };

    }
]);


