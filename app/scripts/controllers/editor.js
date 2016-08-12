'use strict';

/**
 * @ngdoc function
 * @name ceEditorApp.controller:EditorCtrl
 * @description
 * # EditorCtrl
 * Controller of the ceEditorApp
 */
angular.module('ceEditorApp')
  .controller('EditorCtrl', ['$scope', '$http', 'ceStore', 'ce', 'visuals', function ($scope, $http, ceStore, ce, visuals) {
    var validText = 'Valid CE';
    var invalidText = 'Invalid CE';
    var validationFailed = 'Validation failed';

    $scope.validate = function() {
      var validateUrl = ceStore + '/sentences?action=validate';

      $http({
        method: 'POST',
        url: validateUrl,
        data: $scope.ce
      }).then(function successCallback(response) {
        if (response.data.alerts.errors.length > 0) {
          $scope.valid = false;
          $scope.validationText = invalidText;
        } else {
          $scope.valid = true;
          $scope.validationText = validText;
        }
      }, function errorCallback(response) {
        $scope.validationText = validationFailed;
        console.log(response);
      });
    };

    $scope.update = function() {
      var loadCe = "perform load sentences from url '/ce-store/ce/demo/cmd/load.cecmd'.";
      ce.save(loadCe + " " + $scope.ce).then(function() {
        console.log('done');
        visuals.update();
      });
    };

    $scope.ce = "there is a visual thing named 'Andy Murray'.";
    $scope.validate();

  }]);
