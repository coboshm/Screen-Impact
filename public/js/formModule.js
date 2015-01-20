/**
 * Created by cobos on 20/01/15.
 */
var formModule = angular.module('FormModule', []);

formModule.controller('FormCtrl', ['$rootScope', '$scope', '$http',

    function($rootScope, $scope, $http) {

        $scope.isFormValid = function() {
            return $scope.model.username !== '' && $scope.model.password !== '';
        };


        $scope.init = function() {
            $scope.model = {
                username: '',
                password: ''
            };
        };

        $scope.init();
    }
]);


formModule.controller('FormCtrlRegister', ['$rootScope', '$scope', '$http',

    function($rootScope, $scope, $http) {

        $scope.isFormValid = function() {
            var result = $scope.model.username !== '' && $scope.model.firstName !== '' &&
                $scope.model.lastName && $scope.model.password !== '' && $scope.model.passwordRepeat !== '';
            if (!result) {
                $scope.model.message = 'All fields are required';
                return false;
            }
            if ($scope.model.password !== $scope.model.passwordRepeat) {
                $scope.model.message = 'Different passwords'
                return false;
            }
            var re = /^(([^<>()[\]\\.,;:\s@\"]+(\.[^<>()[\]\\.,;:\s@\"]+)*)|(\".+\"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
            if (!re.test($scope.model.email)) {
                $scope.model.message = 'Email not valid'
                return false;
            }
            $scope.model.message = 'All Correct, Thanks'
            return result;
        };


        $scope.init = function() {
            $scope.model = {
                username: '',
                password: '',
                email: '',
                passwordRepeat: '',
                firstName: '',
                lastName: '',
                message: 'All fields are required'
            };
        };

        $scope.init();
    }
]);