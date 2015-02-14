/**
 * Created by cobos on 20/01/15.
 */
var ScreensApp = angular.module('ScreensApp', ['APIModule', 'AssetsModule', 'ngVideo', 'playlistModule', 'screensModule', 'ngQuickDate', 'as.sortable' ]);

var formApp = angular.module('formApp', ['FormModule']);


var EVENTS = {
    UPDATED_FILE: 'fileUpdated',
    EDIT_PLAYLIST: 'editPlaylist',
    BACK_EDIT_PLAYLIST: 'backEditPlaylist'
};