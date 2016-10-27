angular.module('ceEditorApp')

.directive('lesson', function () {
  'use strict';

  return {
    restrict: 'E',
    templateUrl: 'directives/lesson/lesson.html',
    scope: {
      name: '=',
      desc: '=',
      ce: '=',
      open: '='
    },
    controller: function($scope) {
      $scope.complete = false;

      $scope.checkLesson = function() {
        console.log('checkLesson');
      };
    }
  };
});
