'use strict';

angular.module('ceEditorApp')
  .controller('SettingsCtrl', function ($scope, $uibModalInstance) {
    $scope.ok = function () {
      $uibModalInstance.close();
    };

    $scope.cancel = function () {
      $uibModalInstance.dismiss();
    };
  });
