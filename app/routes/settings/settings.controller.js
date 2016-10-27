angular.module('ceEditorApp')

.controller('SettingsCtrl', function ($scope, $uibModalInstance) {
  'use strict';
  $scope.ok = function () {
    $uibModalInstance.close();
  };

  $scope.cancel = function () {
    $uibModalInstance.dismiss();
  };
});
