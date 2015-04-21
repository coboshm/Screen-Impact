/**
 * Created by cobos on 23/01/15.
 */
var statisticsModule = angular.module('statisticsModule', ['n3-line-chart']);

statisticsModule.controller('StatisticsController', ['$rootScope', '$scope', '$http', 'Assets', 'Groups', 'Screens',

    function($rootScope, $scope, $http,  Assets, Groups, Screens) {

        $scope.init = function(){
            $scope.allGroups = Groups.query(function(groups) {});
            $scope.allAssets = Assets.query(function(groups) {});
            $scope.allScreens = Screens.query(function(groups) {});
        };


        $scope.assets = [];
        $scope.groups = [];
        $scope.screens = [];
        $scope.from = null;
        $scope.to = null;

        $scope.init();

        $scope.data = [{x: new Date(1396554805615), val_0: 0, val_1: 0, val_2: 0, val_3: 0},
            {x: new Date(1396641205615), val_0: 0.993, val_1: 3.894, val_2: 8.47, val_3: 14.347},
            {x: new Date(1396727605615), val_0: 1.947, val_1: 7.174, val_2: 13.981, val_3: 19.991},
            {x: new Date(1396814005615), val_0: 2.823, val_1: 9.32, val_2: 14.608, val_3: 13.509},
            {x: new Date(1396900405615), val_0: 3.587, val_1: 9.996, val_2: 10.132, val_3: -1.167},
            {x: new Date(1396986805615), val_0: 4.207, val_1: 9.093, val_2: 2.117, val_3: -15.136},
            {x: new Date(1397073205615), val_0: 4.66, val_1: 6.755, val_2: -6.638, val_3: -19.923},
            {x: new Date(1397159605615), val_0: 4.927, val_1: 3.35, val_2: -13.074, val_3: -12.625},
            {x: new Date(1397246005615), val_0: 4.998, val_1: -0.584, val_2: -14.942, val_3: 2.331},
            {x: new Date(1397332405615), val_0: 4.869, val_1: -4.425, val_2: -11.591, val_3: 15.873},
            {x: new Date(1397418805615), val_0: 4.546, val_1: -7.568, val_2: -4.191, val_3: 19.787},
            {x: new Date(1397505205615), val_0: 4.042, val_1: -9.516, val_2: 4.673, val_3: 11.698},
            {x: new Date(1397591605615), val_0: 3.377, val_1: -9.962, val_2: 11.905, val_3: -3.487},
            {x: new Date(1397678005615), val_0: 2.578, val_1: -8.835, val_2: 14.978, val_3: -16.557},
            {x: new Date(1397764405615), val_0: 1.675, val_1: -6.313, val_2: 12.819, val_3: -19.584},
            {x: new Date(1397850805615), val_0: 0.706, val_1: -2.794, val_2: 6.182, val_3: -10.731}];

        console.log($scope.data)

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
                    type: "column",
                    thickness: "3px"
                }
            ],
            lineMode: "linear",
            tension: 0.7,
            columnsHGap: 30,
            tooltip: {mode: 'axes', interpolate: false}
        };

        var filtred = function() {
            if (($scope.from >= $scope.to) && !$scope.edit_all) return false;
            if ($scope.groups.length == 0 && $scope.assets.length == 0 && $scope.screens.length == 0) return false;
            return true;
        };

        var actualize = function() {
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
                    })
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



