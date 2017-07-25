angular.module('ceEditorApp')

.directive('ceVisualisation', [function () {
  'use strict';

  return {
    restrict: 'E',
    replace: true,
    scope: {
      ce: '='
    },
    templateUrl: 'directives/ce-visualisation/ce-visualisation.html',
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