angular.module('ceEditorApp')

.directive('ceHeader', [function () {
  'use strict';

  return {
    restrict: 'E',
    replace: true,
    templateUrl: 'directives/ce-header/ce-header.html',
    link: function (scope, element, attrs) {

      scope.$watch('ce', function() {
        update();
      });

      function create() {

      }
      create();

      function update () {

      }


    }
  };
}]);
