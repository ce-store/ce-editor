angular.module('ceEditorApp')

.controller('PlaygroundCtrl', ['$scope', function ($scope) {
  'use strict';
  $scope.ce = '';
  $scope.$watch('ce', function() {
    console.log('ce updated');
  });
}]);
