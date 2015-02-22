/**
 * Created by cobos on 23/01/15.
 */
var resources = angular.module('APIModule', ['ngResource']);


resources.factory("Assets", function($resource) {
    return $resource("/apiWeb/assets/:id");
});

resources.factory("PlayLists", function($resource) {
    return $resource("/apiWeb/playLists/:id");
});

resources.factory("Screens", function($resource) {
    return $resource("/apiWeb/screens/:id");
});

resources.factory("UserCuota", function($resource) {
    return $resource("/apiWeb/userCuota", {}, {'query': {method: 'GET', isArray: false}});
});