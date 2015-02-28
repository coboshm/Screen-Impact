/**
 * Created by cobos on 20/01/15.
 */
var ScreensApp = angular.module('ScreensApp', ['APIModule', 'AssetsModule', 'ngVideo', 'playlistModule', 'screensModule', 'groupsModule', 'ngQuickDate', 'as.sortable','localytics.directives' ]);

var formApp = angular.module('formApp', ['FormModule']);


var EVENTS = {
    UPDATED_FILE: 'fileUpdated',
    EDIT_PLAYLIST: 'editPlaylist',
    EDIT_PLAYLIST2: 'editPlaylist2',
    BACK_EDIT_PLAYLIST: 'backEditPlaylist'
};