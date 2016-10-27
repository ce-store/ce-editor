angular.module('ceEditorApp')

.directive('lesson', function () {
  'use strict';

  return {
    restrict: 'E',
    templateUrl: 'directives/lesson/lesson.html',
    scope: {
      lesson: '='
    },
    controller: function($scope, $timeout) {
      $scope.complete = false;
      if ($scope.lesson.complete) {
        $scope.lesson.complete();
      }

      var lastChecked = Date.now();
      var timeout;

      $scope.checkCompletion = function() {
        if (Date.now() - lastChecked > 1000) { // 1 second
          lastChecked = Date.now();

          $scope.lesson.complete($scope.lesson.ce).then(function(instance) {
            if (instance._concept && instance._concept.indexOf('tennis player') > -1) {
              $scope.complete = true;
            } else {
              $scope.complete = false;
            }
          });
        } else {
          if (timeout) {
            $timeout.cancel(timeout);
          }
          timeout = $timeout($scope.checkCompletion, 1000);
        }
      };
    }
  };
});
