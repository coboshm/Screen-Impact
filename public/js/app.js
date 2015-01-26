/**
 * Created by cobos on 20/01/15.
 */
var ScreensApp = angular.module('ScreensApp', ['APIModule', 'AssetsModule', 'ngVideo', 'playlistModule']);

var formApp = angular.module('formApp', ['FormModule']);


var EVENTS = {
    UPDATED_FILE: 'fileUpdated'
};