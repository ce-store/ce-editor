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
    var thingsUrl = ceStore + '/concepts/thing/instances?style=normalised';
    var conceptsUrl = ceStore + '/concepts?style=summary';
    var saveUrl = ceStore + '/sources/generalCeForm?runRules=true&action=save';

    var getThings = function() {
      return $http({
        method: 'GET',
        url: thingsUrl
      });
    };

    var getConcepts = function() {
      return $http({
        method: 'GET',
        url: conceptsUrl
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
      getThings: getThings,
      getConcepts: getConcepts,
      save: saveCe
    };
  }]);
