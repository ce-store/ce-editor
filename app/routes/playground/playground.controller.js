angular.module('ceEditorApp')

.controller('PlaygroundCtrl', ['$scope', function ($scope) {
  'use strict';
  $scope.ce = '';
  $scope.status = {
    status: 'OK',
    message: 'Valid CE'
  };
  $scope.$watch('ce', function () {
    console.log('ce updated', $scope.ce);
    if ($scope.ce !== '') {
      $scope.status = {
        status: 'Updated',
        message: 'The CE has modified and will be checked when you stop typing.'
      };
    }
  });
}]);
