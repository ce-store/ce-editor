'use strict';

/**
 * @ngdoc service
 * @name ceEditorApp.ce
 * @description
 * # ce
 * Service in the ceEditorApp.
 */
angular.module('ceEditorApp')
  .service('ce', ['$http', 'ceStore', function ($http, ceStore) {
    var visualThingsUrl = ceStore + '/concepts/visual thing/instances';
    var iconsUrl = ceStore + '/concepts/icon/instances';
    var shapesUrl = ceStore + '/concepts/shape/instances';
    var saveUrl = ceStore + '/sources/generalCeForm?runRules=true&action=save';

    var getVisualThings = function() {
      return $http({
        method: 'GET',
        url: visualThingsUrl
      });
    };

    var getIcons = function() {
      return $http({
        method: 'GET',
        url: iconsUrl
      });
    };

    var getShapes = function() {
      return $http({
        method: 'GET',
        url: shapesUrl
      });
    };

    var saveCe = function(ce) {
      return $http({
        method: 'POST',
        url: saveUrl,
        data: ce
      });
    };

    return {
      getVisualThings: getVisualThings,
      getIcons: getIcons,
      getShapes: getShapes,
      save: saveCe
    };
  }]);
