/**
 * Created by cobos on 23/01/15.
 */
var playlistModule = angular.module('playlistModule', []);

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




playlistModule.directive('modalplaylist', function () {
    return {
        template: '<div class="modal fade">' +
            '<div class="modal-dialog">' +
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


