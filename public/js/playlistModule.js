/**
 * Created by cobos on 23/01/15.
 */
var playlistModule = angular.module('playlistModule', ['ngVideo']);

playlistModule.controller('PlaylistController', ['$rootScope', '$scope', '$http',

    function($rootScope, $scope, $http) {

        var toggleModal = function(){
                $scope.showModalNew = !$scope.showModalNew;
        };

        $scope.showModalNew = false;

        $scope.init = function(){};

        $scope.init();

        return {
            toggleModal: toggleModal
        };
    }
]);



playlistModule.controller('NewPlaylistController', ['$rootScope', '$scope', '$http', '$timeout', '$location', 'Assets',

    function($rootScope, $scope, $http, $timeout, $location, Assets) {

        var toggleModal = function(){
            $scope.showModalNew = !$scope.showModalNew;
        };

        var addItem = function(asset) {
            console.log(asset);
        }

        var toggleModal2 = function(play, tipo){
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

        $scope.interface = {};
        $scope.showModalNew = false;
        $scope.from = null
        $scope.to = null
        $scope.assets = [];
        $scope.allAssets = [];
        $scope.showModal = false;
        $scope.photoSelected = '';

        $scope.allAssets = [];

        $scope.sortableOptions = {
            containment: '#sortable-container'
        };

        $scope.allAssets = Assets.query(function(assets) {});

        $scope.init = function(){
        };

        $scope.init();

        return {
            durationTime: DurationTime,
            toggleModal2: toggleModal2,
            toggleModal: toggleModal,
            addItem: addItem
        };

    }
]);




playlistModule.directive('modalplaylist', function () {
    return {
        template: '<div class="modal fade">' +
            '<div class="modal-dialog-large">' +
            '<div class="modal-content">' +
            '<button type="button" class="close_video" data-dismiss="modal" aria-hidden="true">&times;</button>' +
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

playlistModule.directive('modalinit', function () {
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


playlistModule.directive('myDirective', function($compile) {
    return {
        restrict: 'E',
        //scope: {
        //  item: '='
        //},
        template: '<div><p data-ng-bind="item.name"></p></div>',
        replace: true,
    };
});



