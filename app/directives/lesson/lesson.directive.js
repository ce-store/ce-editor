angular.module('ceEditorApp')

.directive('lesson', function () {
  'use strict';

  return {
    restrict: 'E',
    templateUrl: 'directives/lesson/lesson.html',
    scope: {
      lesson: '='
    },
    controller: function($scope, $timeout, $q, ce) {
      $scope.complete = false;
      $scope.validationText = 'Not connected';

      if ($scope.lesson.complete) {
        $scope.lesson.complete();
      }

      var validText = 'Valid CE';
      var invalidText = 'Invalid CE';
      var validationFailed = 'Validation failed';

      var lastChecked;
      var timeout;

      $scope.checkCompletion = function() {
        if (!lastChecked || Date.now() - lastChecked > 1000) { // 1 second
          $scope.validate($scope.lesson.ce).then(function() {
            if ($scope.lesson.complete) {
              $scope.lesson.complete($scope.lesson.ce).then(function() {
                console.log('complete');
                $scope.complete = true;
              }, function() {
                $scope.complete = false;
              });
            }
          });
          lastChecked = Date.now();
        } else {
          if (timeout) {
            $timeout.cancel(timeout);
          }
          timeout = $timeout($scope.checkCompletion, 1000);
        }
      };

      $scope.validate = function() {
        var deferred = $q.defer();

        ce.validate($scope.lesson.ce)
          .then(function successCallback(response) {
            if (response.data.alerts.errors.length > 0) {
              $scope.valid = false;
              $scope.validationText = invalidText;
              deferred.reject();
            } else {
              $scope.valid = true;
              $scope.validationText = validText;
              deferred.resolve();
            }
          }, function errorCallback() {
            $scope.validationText = validationFailed;
            deferred.reject();
          });

        return deferred.promise;
      };

      $scope.validate();
    }
  };
});
