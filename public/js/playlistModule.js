/**
 * Created by cobos on 23/01/15.
 */
var playlistModule = angular.module('playlistModule', ['ngVideo']);

playlistModule.controller('PlaylistController', ['$rootScope', '$scope', '$http', 'PlayLists',

    function($rootScope, $scope, $http, PlayLists) {


        $scope.playLists = [];
        $scope.show_edit = false;
        $scope.playLists = PlayLists.query(function(playlists) {});

        var DeleteRow = function (id) {
            $http({
                url: '/apiWeb/playlistDelete',
                method: 'POST',
                data: {
                    id: id
                }
            }).success(function(res) {
                $scope.playLists = PlayLists.query(function(playlists) {});
            }).error(function(data, status, headers, config) {});
        };

        var editRow = function (playlist) {
            $scope.show_edit = true;
            $rootScope.$emit(EVENTS.EDIT_PLAYLIST, playlist);
        }

        var editRow2 = function (playlist) {
            $scope.show_edit = true;
            $rootScope.$emit(EVENTS.EDIT_PLAYLIST2, playlist);
        }

        $rootScope.$on(EVENTS.BACK_EDIT_PLAYLIST, function(event) {
            $scope.show_edit = false;
            $scope.playLists = PlayLists.query(function(playlists) {});
        });

        var DurationTime = function(assets) {

            var secs = 0;
            for (i = 0; i < assets.length; i++) {
                secs += assets[i].duration;
            }

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

        $scope.init = function(){};

        $scope.init();

        return {
            deleteRow: DeleteRow,
            durationTime: DurationTime,
            editRow: editRow,
            editRow2: editRow2
        };
    }
]);



playlistModule.controller('NewPlaylistController', ['$rootScope', '$scope', '$http', '$timeout', '$location', '$window', 'Assets', 'Groups',

    function($rootScope, $scope, $http, $timeout, $location, $window, Assets, Groups) {

        var toggleModal = function(){
            $scope.showModalNew = !$scope.showModalNew;
        };

        var addItem = function(asset) {
            asset_new = angular.copy(asset);
            if (asset_new.tipo.split('/')[0] === 'image') {
                asset_new.duration = 5;
            }
            $scope.assets.push(asset_new);
        }

        var quitItem = function(asset) {
            var index = $scope.assets.indexOf(asset);
            $scope.assets.splice(index, 1);
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

        var back = function() {
            $rootScope.$emit(EVENTS.BACK_EDIT_PLAYLIST);
        };

        var editPlaylist = function() {
            var playlist = {
                id: $scope.id,
                title: $scope.title,
                from: $scope.from,
                to: $scope.to,
                assets: $scope.assets,
                groups: $scope.groups
            };
            $http({
                url: '/apiWeb/edit_playlist',
                method: 'POST',
                data: playlist
            }).success(function(res) {
                $window.location.href="/playlist";
            }).error(function(data, status, headers, config) {
                console.log(data);
                $scope.error = true;
                $scope.serverErrorMessage = data;
            });
        };

        var createPlaylist = function() {
            var playlist = {
                title: $scope.title,
                from: $scope.from,
                to: $scope.to,
                assets: $scope.assets,
                groups: $scope.groups
            };
            $http({
                url: '/apiWeb/new_playlist',
                method: 'POST',
                data: playlist
            }).success(function(res) {
                $window.location.href="/playlist";
            }).error(function(data, status, headers, config) {
                $scope.error = true;
                $scope.serverErrorMessage = data;
            });
        }

        var isValid = function() {
            if (($scope.from >= $scope.to) && !$scope.edit_all) return false;
            if ($scope.title == '') return false;
            if ($scope.assets.length == 0 && !$scope.edit_all) return false;

            return true;
        }


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

        $rootScope.$on(EVENTS.EDIT_PLAYLIST, function(event, playlist) {
            $scope.from = playlist.from;
            $scope.to = playlist.to;
            $scope.assets = playlist.assets;
            $scope.title = playlist.title;
            $scope.id = playlist._id;
            $scope.edit_all = false;
            $scope.allGroups = Groups.query(function(groups) {});
            $scope.groups = playlist.groups;
        });

        $rootScope.$on(EVENTS.EDIT_PLAYLIST2, function(event, playlist) {
            $scope.from = playlist.from;
            $scope.to = playlist.to;
            $scope.assets = playlist.assets;
            $scope.title = playlist.title;
            $scope.id = playlist._id;
            $scope.edit_all = true;
            $scope.groups = playlist.groups;
            $scope.allGroups = Groups.query(function(groups) {});
        });

        $scope.interface = {};
        $scope.showModalNew = false;
        $scope.from = null;
        $scope.to = null;
        $scope.id = null;
        $scope.assets = [];
        $scope.allAssets = [];
        $scope.showModal = false;
        $scope.photoSelected = '';
        $scope.title = '';

        $scope.allAssets = [];

        $scope.sortableOptions = {
            containment: '#sortable-container'
        };

        $scope.allAssets = Assets.query(function(assets) {});
        $scope.allGroups = Groups.query(function(groups) {});

        $scope.init = function(){
        };

        $scope.init();

        return {
            durationTime: DurationTime,
            toggleModal2: toggleModal2,
            toggleModal: toggleModal,
            addItem: addItem,
            createPlaylist: createPlaylist,
            isValid: isValid,
            quitItem: quitItem,
            back: back,
            editPlaylist: editPlaylist
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



