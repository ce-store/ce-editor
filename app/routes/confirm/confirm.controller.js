angular.module('ceEditorApp')

.controller('ConfirmCtrl', function ($scope, $uibModalInstance, confirm, exportFunc) {
  'use strict';

  $scope.confirm = confirm;

  $scope.ok = function () {
    $uibModalInstance.close();
  };

  $scope.cancel = function () {
    $uibModalInstance.dismiss();
  };

  $scope.export = exportFunc;
});
