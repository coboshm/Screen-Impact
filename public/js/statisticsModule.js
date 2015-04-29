/**
 * Created by cobos on 23/01/15.
 */
var statisticsModule = angular.module('statisticsModule', ['n3-line-chart', 'ui.bootstrap']);

statisticsModule.controller('StatisticsController', ['$rootScope', '$scope', '$http', 'Assets', 'Groups', 'Screens',

    function($rootScope, $scope, $http,  Assets, Groups, Screens) {

        $scope.init = function(){
            $scope.allGroups = Groups.query(function(groups) {});
            $scope.allAssets = Assets.query(function(groups) {});
            $scope.allScreens = Screens.query(function(groups) {});
        };

        $scope.time_from = new Date();
        $scope.time_to = new Date();
        $scope.time_from.setHours($scope.time_to.getHours() - 2);

        $scope.hstep = 1;
        $scope.mstep = 1;


        $scope.assets = [];
        $scope.groups = [];
        $scope.screens = [];
        $scope.day = new Date();
        $scope.from = null;
        $scope.to = null;

        $scope.init();

        $scope.data = [];


        $scope.options = {
            axes: {
                x: {
                    type: "date",
                    key: "createdAt"
                },
                y: {type: 'column', min: 0}
            },series: [
                {
                    y: "people",
                    label: "Impact Graph",
                    color: "#298A08",
                    type: "area",
                    thickness: "1px"
                }
            ],
            lineMode: "linear",
            tension: 0.7,
            columnsHGap: 5,
            tooltip: {mode: 'axes', interpolate: false}
        };

        var filtred = function() {
            if ($scope.day == null ||$scope.day == undefined) return false;
            if (($scope.time_from >= $scope.time_to) && !$scope.edit_all) return false;
            if ($scope.groups.length == 0 && $scope.assets.length == 0 && $scope.screens.length == 0) return false;
            return true;
        };

        var actualize = function() {
            $scope.from = new Date($scope.day.getFullYear(), $scope.day.getMonth(), $scope.day.getDate(), $scope.time_from.getHours(), $scope.time_from.getMinutes(), 0);
            $scope.to = new Date($scope.day.getFullYear(), $scope.day.getMonth(), $scope.day.getDate(), $scope.time_to.getHours(), $scope.time_to.getMinutes(), 0);
            var playlist = {
                screens: $scope.screens,
                from: $scope.from,
                to: $scope.to,
                assets: $scope.assets,
                groups: $scope.groups
            };
            $http({
                url: '/apiWeb/data_statistics',
                method: 'POST',
                data: playlist
            }).success(function(res) {
                $scope.data = [];
                for (var i = 0; i < res.length; ++i ) {
                    $scope.data.push({
                        'createdAt': new Date(res[i].createdAt),
                        'people': res[i].people
                    });
                }
            }).error(function(data, status, headers, config) {

            });
        };

        return {
            filtred: filtred,
            actualize: actualize
        };
    }
]);



