/**
 * Created by cobos on 23/01/15.
 */
var groupsModule = angular.module('groupsModule', []);

groupsModule.controller('GroupsController', ['$rootScope', '$scope', '$http', 'Groups',

    function($rootScope, $scope, $http, Groups) {

        $scope.groups = Groups.query(function(groups) {})
        $scope.init = function(){};
        $scope.init();


        return {
        };
    }
]);


groupsModule.controller('NewGroupController', ['$rootScope', '$scope', '$http', '$timeout', '$location', '$window',

    function($rootScope, $scope, $http, $timeout, $location, $window) {

        var createGroup = function() {

        }

        $scope.init = function(){
        };

        $scope.init();

        return {
            createGroup: createGroup
        };

    }
]);


