/**
 * An AngularJS directive for Dropzone.js, http://www.dropzonejs.com/
 * 
 * Usage:
 * 
 * <div ng-app="app" ng-controller="SomeCtrl">
 *   <button dropzone="dropzoneConfig">
 *     Drag and drop files here or click to upload
 *   </button>
 * </div>
 */

angular.module('dropzone', []).directive('dropzone', function () {
  return function (scope, element, attrs) {
    var config, dropzone;
    config = scope[attrs.dropzone];

    // create a Dropzone for the element with the given options
    dropzone = new Dropzone(element[0], config.options);

    // bind the given event handlers
    angular.forEach(config.eventHandlers, function (handler, event) {
      dropzone.on(event, handler);
    });
  };
});

angular.module('ScreensApp', ['APIModule', 'AssetsModule', 'dropzone']);

angular.module('ScreensApp').controller('SomeCtrl', function ($scope, $rootScope) {
  $scope.dropzoneConfig = {
    'options': { // passed into the Dropzone constructor
      'acceptedFiles': 'image/*, video/*',
      'url': '/upload'
    },
    'eventHandlers': {
      'sending': function (file, xhr, formData) {
      },
      'success': function (file, response) {
            $rootScope.$emit(EVENTS.UPDATED_FILE);
      }
    }
  };
});