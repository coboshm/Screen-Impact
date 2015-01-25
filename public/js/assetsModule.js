/**
 * Created by cobos on 23/01/15.
 */
var assetsModule = angular.module('AssetsModule', []);

assetsModule.controller('AssetsController', ['$rootScope', '$scope', '$http', 'Assets',

    function($rootScope, $scope, $http, Assets) {

        var preview = function() {
        };

        var DeleteRow = function (id) {
            $http({
                url: '/apiWeb/assetsDelete',
                method: 'POST',
                data: {
                    id: id
                }
            }).success(function(res) {
                $scope.assets = Assets.query(function(assets) {});
            }).error(function(data, status, headers, config) {});
        }

        $scope.assets = [];
        $scope.assets = Assets.query(function(assets) {});

        $scope.init = function() {
        };

        $rootScope.$on(EVENTS.UPDATED_FILE, function(event) {
            $scope.assets = Assets.query(function(assets) {});
        });

        var DurationTime = function(secs) {
            var hours = Math.floor(secs / (60 * 60));

            var divisor_for_minutes = secs % (60 * 60);
            var minutes = Math.floor(divisor_for_minutes / 60);

            var divisor_for_seconds = divisor_for_minutes % 60;
            var seconds = Math.ceil(divisor_for_seconds);

            if (hours == 0) {
                if (minutes == 0) {
                    if (seconds == 0) {
                        ret = '--';
                    } else {
                        ret = seconds + ' seconds';
                    }
                } else {
                    ret = minutes + ':' + seconds + ' minutes';
                }
            } else {
                ret = hours + ':' + minutes + ':' + seconds + ' minutes';
            }
            return ret;
        }

        function bytesToSize(bytes) {
            var sizes = ['Bytes', 'KB', 'MB', 'GB', 'TB'];
            if (bytes == 0) return '0 Byte';
            var i = parseInt(Math.floor(Math.log(bytes) / Math.log(1024)));
            return Math.round(bytes / Math.pow(1024, i), 2) + ' ' + sizes[i];
        };


        $scope.init();

        return {
            preview: preview,
            durationTime: DurationTime,
            bytesSize: bytesToSize,
            deleteRow: DeleteRow
        };
    }
]);