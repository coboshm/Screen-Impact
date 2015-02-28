/**
 * Created by cobos on 23/01/15.
 */
var assetsModule = angular.module('AssetsModule', ['ngVideo']);

assetsModule.controller('AssetsController', ['$rootScope', '$scope', '$http', '$timeout', '$location', 'Assets', 'UserCuota',

    function($rootScope, $scope, $http, $timeout, $location, Assets, UserCuota) {

        $scope.interface = {};


        var DeleteRow = function (asset) {
            $http({
                url: '/apiWeb/assetsDelete',
                method: 'POST',
                data: {
                    asset: asset
                }
            }).success(function(res) {
                $scope.assets = Assets.query(function(assets) {});
                $scope.userCuota = UserCuota.query(function(user) {});
            }).error(function(data, status, headers, config) {});
        };


        var toggleModal = function(play, tipo){
            if (tipo.split('/')[0] === 'image') {
                $scope.showModalPhoto = !$scope.showModalPhoto;
                $scope.photoSelected = play;
            } else {
                $scope.interface.sources.clear();
                $scope.showModal = !$scope.showModal;
                path = $location.absUrl().split('/');
                path_large = path[0] + '//' + path[2] + play;
                $scope.playing = path_large;
                $scope.interface.options.setAutoplay(true);
                $scope.interface.sources.add(path_large);
            }
        };



        $scope.assets = [];
        $scope.userCuota = [];
        $scope.showModal = false;
        $scope.photoSelected = '';


        $scope.assets = Assets.query(function(assets) {});
        $scope.userCuota = UserCuota.query(function(user) {});


        $scope.init = function() {
        };

        $rootScope.$on(EVENTS.UPDATED_FILE, function(event) {
            $scope.assets = Assets.query(function(assets) {});
            $scope.userCuota = UserCuota.query(function(user) {});
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
            durationTime: DurationTime,
            bytesSize: bytesToSize,
            deleteRow: DeleteRow,
            toggleModal: toggleModal
        };
    }
]);


assetsModule.directive('modal', function () {
    return {
        template: '<div class="modal fade">' +
            '<div class="modal-dialog">' +
            '<div class="modal-content">' +
            '<button type="button" ng-click="interface.controls.pause();" class="close_video" data-dismiss="modal" aria-hidden="true">&times;</button>' +
            '<div class="modal-body-video" ng-transclude></div>' +
            '</div>' +
            '</div>' +
            '</div>',
        restrict: 'E',
        transclude: true,
        replace:true,
        scope:true,
        link: function postLink(scope, element, attrs) {
            scope.title = attrs.title;

            scope.$watch(attrs.visible, function(value){
                if(value == true)
                    $(element).modal('show');
                else
                    $(element).modal('hide');
            });

            $(element).on('shown.bs.modal', function(){
                scope.$apply(function(){
                    scope.$parent[attrs.visible] = true;
                });
            });

            $(element).on('hidden.bs.modal', function(){
                scope.$apply(function(){
                    scope.$parent[attrs.visible] = false;
                });
            });
        }
    };
});

