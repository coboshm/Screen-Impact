/**
 * Created by cobos on 23/01/15.
 */
var assetsModule = angular.module('AssetsModule', []);

assetsModule.controller('AssetsController', ['$rootScope', '$scope', '$http', 'Assets',

    function($rootScope, $scope, $http, Assets) {

        var preview = function() {
        };

        $scope.assets = [];
        $scope.assets = Assets.query(function(assets) {
            console.log(assets);
        });

        $scope.init = function() {
        };


        $scope.init();

        return {
            preview: preview
        };
    }
]);